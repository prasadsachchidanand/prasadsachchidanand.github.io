/*
 * Linear algebra practice: topic-wise exam-style questions (MCQ, MSQ, NAT) with worked solutions.
 * Practice mode checks each answer at once; test mode marks the whole set at the end, as in GATE
 * (a wrong MCQ costs a third of its marks; MSQ and NAT have no negative marks, and an MSQ needs
 * exactly the correct options). The questions are written in LaTeX in questions.tex, which the page
 * fetches and converts (questions-tex.js). Results stay in this browser.
 */
import { parseQuestions } from './questions-tex.js';

const $ = id => document.getElementById(id);
const LETTERS = ['A', 'B', 'C', 'D'];
const TYPE_NAME = { mcq: 'MCQ', msq: 'MSQ', nat: 'NAT' };
const TYPE_HELP = {
  mcq: 'Choose one option.',
  msq: 'One or more options are correct. Choose all of them, and no others, to get the marks.',
  nat: 'Type a number. Fractions such as 3/4 and decimals such as 0.75 are accepted.',
};
let TOPICS = [], QUESTIONS = [], TOPIC = {};   // filled from questions.tex by load()
const STORE = 'la-practice-results';
const MIN_PER_MARK = 1.8;                      // GATE: 180 minutes for 100 marks

// ---------------------------------------------------------------- results kept in this browser
// { question id: 1 (right) or 0 (wrong) }, from the latest attempt at each question
let record = {};
try { record = JSON.parse(localStorage.getItem(STORE)) || {}; } catch { record = {}; }
const saveRecord = () => { try { localStorage.setItem(STORE, JSON.stringify(record)); } catch { /* private window */ } };

// ---------------------------------------------------------------- helpers
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const clock = ms => {
  const t = Math.max(0, Math.round(ms / 1000)), h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
  return (h ? `${h}:${String(m).padStart(2, '0')}` : `${m}`) + `:${String(s).padStart(2, '0')}`;
};
// marks are counted in thirds, so that 1/3 and 2/3 add up exactly
const marksText = thirds => {
  const v = thirds / 3, s = thirds % 3 === 0 ? String(Math.abs(v)) : Math.abs(v).toFixed(2);
  return (v < 0 ? '−' : '') + s;
};

// "-2", "0.75", "3/4", "−1.5" → number; '' → null; anything else → NaN
function parseNum(s) {
  const t = String(s).trim().replace(/[−–]/g, '-').replace(/\s+/g, '');
  if (!t) return null;
  const m = t.match(/^([+-]?(?:\d+\.?\d*|\.\d+))\/(\d+\.?\d*|\.\d+)$/);
  if (m) { const d = parseFloat(m[2]); return d ? parseFloat(m[1]) / d : NaN; }
  return /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(t) ? parseFloat(t) : NaN;
}

function answered(it) {
  if (it.q.type === 'mcq') return it.resp != null;
  if (it.q.type === 'msq') return it.resp.length > 0;
  const x = parseNum(it.resp);
  return x != null && !Number.isNaN(x);
}

// 'right', 'wrong' or 'blank'
function grade(it) {
  const q = it.q;
  if (!answered(it)) return 'blank';
  if (q.type === 'mcq') return it.resp === q.answer ? 'right' : 'wrong';
  if (q.type === 'msq') return it.resp.length === q.answer.length && it.resp.every((v, i) => v === q.answer[i]) ? 'right' : 'wrong';
  const x = parseNum(it.resp), a = q.answer;
  const good = 'value' in a ? Math.abs(x - a.value) <= 1e-9 * Math.max(1, Math.abs(a.value)) : x >= a.min - 1e-12 && x <= a.max + 1e-12;
  return good ? 'right' : 'wrong';
}

const thirdsFor = (q, result, negative) =>
  result === 'right' ? 3 * q.marks : result === 'wrong' && negative && q.type === 'mcq' ? -q.marks : 0;

function answerHTML(q) {
  if (q.type === 'mcq') return `(${LETTERS[q.answer]})`;
  if (q.type === 'msq') {
    const l = q.answer.map(k => `(${LETTERS[k]})`);
    return l.length === 1 ? l[0] : `${l.slice(0, -1).join(', ')} and ${l[l.length - 1]}`;
  }
  return 'value' in q.answer ? String(q.answer.value).replace('-', '−') : `any number from ${q.answer.min} to ${q.answer.max}`;
}

function responseText(it) {
  const q = it.q;
  if (!answered(it)) return 'not answered';
  if (q.type === 'mcq') return `(${LETTERS[it.resp]})`;
  if (q.type === 'msq') return it.resp.map(k => `(${LETTERS[k]})`).join(', ');
  return esc(String(it.resp).trim());
}

// wait for MathJax (it loads asynchronously), then typeset el
async function typeset(el) {
  for (let i = 0; i < 100 && !(window.MathJax && window.MathJax.typesetPromise); i++) await new Promise(r => setTimeout(r, 100));
  const mj = window.MathJax;
  if (!mj || !mj.typesetPromise) return;
  try { await mj.startup.promise; await mj.typesetPromise([el]); } catch { /* leave the TeX as text */ }
}

// ---------------------------------------------------------------- setup
const setup = { topics: new Set(), types: new Set(['mcq', 'msq', 'nat']), mode: 'practice' };

function renderTopics() {
  $('lp-topics').innerHTML = TOPICS.map(t => {
    const qs = QUESTIONS.filter(x => x.topic === t.id);
    const right = qs.filter(x => record[x.id] === 1).length;
    return `<label class="lp-topic">
      <input type="checkbox" value="${t.id}"${setup.topics.has(t.id) ? ' checked' : ''}>
      <span class="lp-tname"><b>${t.name}</b><small>${t.weeks} · ${plural(qs.length, 'question')}${qs.some(fromGate) ? `, ${qs.filter(fromGate).length} from GATE` : ''}</small></span>
      <span class="lp-tprog" title="Right so far: ${right} of ${qs.length}" aria-label="Right so far: ${right} of ${qs.length}">
        <span class="lp-meter"><span style="width: ${Math.round((100 * right) / qs.length)}%"></span></span><small>${right}/${qs.length}</small>
      </span>
    </label>`;
  }).join('');
  renderRecord();
}

function renderRecord(asking = false) {
  const tried = QUESTIONS.filter(x => x.id in record).length;
  const right = QUESTIONS.filter(x => record[x.id] === 1).length;
  const el = $('lp-record');
  if (!tried) {
    el.textContent = `${plural(QUESTIONS.length, 'question')} in all. Your results are kept in this browser, so the bars show which topics need more work.`;
  } else if (asking) {
    el.innerHTML = `Forget all your results on this page? <button type="button" class="tl-btn" data-forget="yes">Yes, forget them</button> <button type="button" class="tl-btn" data-forget="no">Keep them</button>`;
  } else {
    el.innerHTML = `You have got <b>${right}</b> of the ${QUESTIONS.length} questions right so far (your latest attempt at each, kept in this browser). <button type="button" class="lp-linkbtn" data-forget="ask">Forget my results</button>`;
  }
}

function setMode(mode) {
  setup.mode = mode;
  document.querySelectorAll('#lp-mode button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  $('lp-test-opts').hidden = mode !== 'test';
  $('lp-mode-help').innerHTML = mode === 'test'
    ? 'Answer the questions in any order, then submit to see your marks and the solutions. Marking as in GATE: an MCQ carries 1 or 2 marks, and a wrong MCQ answer costs a third of them; MSQ and NAT have no negative marks, and an MSQ needs exactly the correct options.'
    : 'Check each answer as you go and read the solution straight away.';
}

function readSetup() {
  return {
    topics: new Set(setup.topics), types: new Set(setup.types), mode: setup.mode,
    count: Number($('lp-count').value), fresh: $('lp-fresh').checked,
    negative: $('lp-negative').checked, timed: $('lp-timed').checked, gate: $('lp-gate').checked,
  };
}

const fromGate = q => /^GATE\b/.test(q.source || '');
function matching(o = readSetup()) { return QUESTIONS.filter(x => o.topics.has(x.topic) && o.types.has(x.type) && (!o.gate || fromGate(x))); }

function updateStatus() {
  const n = matching().length, el = $('lp-status');
  el.dataset.kind = n ? '' : 'error';
  el.textContent = n
    ? `${plural(n, 'question')} ${n === 1 ? 'matches' : 'match'} your choice.`
    : 'Choose at least one topic and one type of question.';
  $('lp-start').disabled = !n;
}

// Choose n questions: the topics take turns (so a mixed set covers them all); with "fresh",
// questions not yet answered right come first. Then 1-mark questions before 2-mark ones, as in GATE.
function pick(pool, n, fresh) {
  const all = shuffle(pool.slice());
  const tiers = fresh ? [all.filter(x => record[x.id] !== 1), all.filter(x => record[x.id] === 1)] : [all];
  const out = [];
  for (const tier of tiers) {
    const groups = shuffle(TOPICS.map(t => tier.filter(x => x.topic === t.id)).filter(g => g.length));
    for (let i = 0; out.length < n && groups.some(g => i < g.length); i++)
      for (const g of groups) if (i < g.length && out.length < n) out.push(g[i]);
  }
  return out.sort((a, b) => a.marks - b.marks || TOPIC[a.topic].order - TOPIC[b.topic].order);
}

function startFromSetup(o) {
  const pool = matching(o);
  if (!pool.length) return updateStatus();
  begin(pick(pool, o.count || pool.length, o.fresh), o);
}

// ---------------------------------------------------------------- a session
let session = null;
const guard = e => { e.preventDefault(); e.returnValue = ''; };

function begin(questions, o) {
  if (session && session.timer) clearInterval(session.timer);
  const test = o.mode === 'test';
  session = {
    mode: o.mode, opts: o, negative: test && o.negative,
    items: questions.map(q => ({ q, resp: q.type === 'msq' ? [] : q.type === 'nat' ? '' : null, review: false, seen: false, checked: false })),
    cur: 0, started: Date.now(), deadline: null, timer: null,
  };
  const marks = questions.reduce((s, q) => s + q.marks, 0);
  if (test && o.timed) session.deadline = Date.now() + Math.round(marks * MIN_PER_MARK) * 60000;
  $('lp-setup').hidden = true;
  $('lp-result').hidden = true;
  $('lp-quiz').hidden = false;
  $('lp-confirm').hidden = true;
  $('lp-finish').innerHTML = test ? '<i class="fas fa-flag-checkered"></i> Submit test' : '<i class="fas fa-flag-checkered"></i> Finish';
  $('lp-legend').innerHTML = (test
    ? [['answered', 'Answered'], ['seen', 'Not answered'], ['new', 'Not visited'], ['review', 'Marked for review']]
    : [['right', 'Right'], ['wrong', 'Wrong'], ['answered', 'Answered, not checked'], ['seen', 'Not answered']])
    .map(([k, t]) => `<span><i class="lp-key" data-state="${k}"></i>${t}</span>`).join('');
  $('lp-timer').hidden = !session.deadline;
  if (session.deadline) { tick(); session.timer = setInterval(tick, 1000); }
  window.addEventListener('beforeunload', guard);
  show(0);
  $('lp-quiz').scrollIntoView({ block: 'start' });
}

function tick() {
  const left = session.deadline - Date.now();
  const el = $('lp-timer');
  el.textContent = `Time left ${clock(left)}`;
  el.dataset.low = left < 5 * 60000 ? '1' : '';
  if (left <= 0) finish(true);
}

function stateOf(it) {
  if (session.mode === 'practice' && it.checked) return grade(it) === 'right' ? 'right' : 'wrong';
  return answered(it) ? 'answered' : it.seen ? 'seen' : 'new';
}
const STATE_LABEL = { right: 'right', wrong: 'wrong', answered: 'answered', seen: 'not answered', new: 'not visited' };

function renderPalette() {
  $('lp-palette').innerHTML = session.items.map((it, i) => {
    const st = stateOf(it);
    return `<button type="button" data-i="${i}" data-state="${st}"${it.review ? ' data-review="1"' : ''}${i === session.cur ? ' aria-current="true"' : ''}
      aria-label="Question ${i + 1}, ${STATE_LABEL[st]}${it.review ? ', marked for review' : ''}">${i + 1}</button>`;
  }).join('');
  const s = session, n = s.items.length, done = s.items.filter(answered).length;
  let text = `Question <b>${s.cur + 1}</b> of ${n}`;
  if (s.mode === 'test') {
    const rev = s.items.filter(it => it.review).length;
    text += ` · ${done} answered${rev ? ` · ${rev} marked for review` : ''}`;
  } else {
    const checked = s.items.filter(it => it.checked), right = checked.filter(it => grade(it) === 'right').length;
    if (checked.length) text += ` · ${right} of ${checked.length} checked ${checked.length === 1 ? 'is' : 'are'} right`;
  }
  $('lp-progress').innerHTML = text;
}

function optionMark(q, k, chosen) {
  const correct = q.type === 'mcq' ? q.answer === k : q.answer.includes(k);
  return correct ? 'right' : chosen ? 'wrong' : '';
}

function optionsHTML(it, locked, name) {
  const q = it.q, kind = q.type === 'mcq' ? 'radio' : 'checkbox';
  return `<fieldset class="lp-options"><legend class="lp-sr">Options</legend>${q.options.map((o, k) => {
    const on = q.type === 'mcq' ? it.resp === k : it.resp.includes(k);
    const mark = locked ? optionMark(q, k, on) : '';
    return `<label class="lp-opt"${mark ? ` data-mark="${mark}"` : ''}>
      <input type="${kind}" name="${name}" value="${k}"${on ? ' checked' : ''}${locked ? ' disabled' : ''}>
      <span class="lp-letter">(${LETTERS[k]})</span><span class="lp-otext">${o}</span>
      ${mark === 'right' ? '<i class="fas fa-check lp-omark" aria-label="correct option"></i>' : mark === 'wrong' ? '<i class="fas fa-xmark lp-omark" aria-label="wrong choice"></i>' : ''}
    </label>`;
  }).join('')}</fieldset>`;
}

function verdictHTML(it) {
  const r = grade(it), q = it.q;
  if (r === 'right') return `<p class="lp-verdict" data-kind="ok"><i class="fas fa-circle-check"></i> Right${q.type === 'nat' ? `: the answer is ${answerHTML(q)}` : ''}.</p>`;
  const yours = q.type === 'nat' && r === 'wrong' ? `You wrote ${responseText(it)}; the` : 'The';
  return `<p class="lp-verdict" data-kind="${r === 'wrong' ? 'err' : ''}"><i class="fas ${r === 'wrong' ? 'fa-circle-xmark' : 'fa-circle-minus'}"></i> ${r === 'wrong' ? 'Not right.' : 'Not answered.'} ${yours} answer is ${answerHTML(q)}.</p>`;
}

function solutionHTML(q) { return q.solution ? `<div class="lp-solution"><b>Solution.</b> ${q.solution}</div>` : ''; }

function show(i) {
  const s = session;
  s.cur = i;
  const it = s.items[i], q = it.q;
  it.seen = true;
  const locked = s.mode === 'practice' && it.checked;
  const body = q.type === 'nat'
    ? `<div class="lp-nat"><label class="tl-label" for="lp-nat">Your answer</label>
        <input type="text" id="lp-nat" inputmode="decimal" autocomplete="off" spellcheck="false" value="${esc(it.resp)}"${locked ? ' disabled' : ''}>
        <p class="lp-nat-err" id="lp-nat-err" role="alert"></p></div>`
    : optionsHTML(it, locked, 'lp-opt');
  $('lp-card').innerHTML = `
    <div class="lp-meta">
      <span class="lp-tag lp-tag-type" title="${esc(TYPE_HELP[q.type])}">${TYPE_NAME[q.type]}</span>
      <span class="lp-tag">${plural(q.marks, 'mark')}${s.negative && q.type === 'mcq' ? `, −${q.marks}/3 if wrong` : ''}</span>
      <span class="lp-tag">${TOPIC[q.topic].name}</span>
      ${q.source ? `<span class="lp-tag lp-tag-src">${q.source}</span>` : ''}
    </div>
    <div class="lp-q" data-id="${q.id}">${q.q}</div>
    <p class="lp-help">${TYPE_HELP[q.type]}</p>
    ${body}
    <div class="lp-feedback" id="lp-feedback" aria-live="polite"${locked ? '' : ' hidden'}>${locked ? verdictHTML(it) + solutionHTML(q) : ''}</div>`;
  renderPalette();
  renderButtons();
  typeset($('lp-card'));
}

function renderButtons() {
  const s = session, it = s.items[s.cur], test = s.mode === 'test';
  $('lp-prev').disabled = s.cur === 0;
  $('lp-next').disabled = s.cur === s.items.length - 1;
  $('lp-clear').hidden = !test && it.checked;
  $('lp-clear').disabled = !answered(it) && !(it.q.type === 'nat' && String(it.resp).trim());
  $('lp-review-btn').hidden = !test;
  $('lp-review-btn').innerHTML = it.review ? '<i class="fas fa-bookmark"></i> Unmark' : '<i class="far fa-bookmark"></i> Mark for review';
  $('lp-check').hidden = test || it.checked;
  $('lp-done').hidden = test || !it.checked || s.cur < s.items.length - 1;
  const lead = !test && it.checked && s.cur < s.items.length - 1;   // after checking, "Next" is the main button
  $('lp-next').classList.toggle('tl-primary', lead);
  $('lp-next').classList.toggle('tl-btn', !lead);
}

function go(i) {
  if (i < 0 || i >= session.items.length) return;
  $('lp-confirm').hidden = true;
  show(i);
  const top = $('lp-quiz').getBoundingClientRect().top;
  if (top < 0) $('lp-quiz').scrollIntoView({ block: 'start' });
}

function readResponse() {
  const it = session.items[session.cur], q = it.q;
  if (q.type === 'mcq') {
    const c = document.querySelector('#lp-card input[name="lp-opt"]:checked');
    it.resp = c ? Number(c.value) : null;
  } else if (q.type === 'msq') {
    it.resp = [...document.querySelectorAll('#lp-card input[name="lp-opt"]:checked')].map(c => Number(c.value)).sort((a, b) => a - b);
  } else {
    it.resp = $('lp-nat').value;
    const x = parseNum(it.resp);
    $('lp-nat-err').textContent = Number.isNaN(x) ? 'This is not a number. Type, for example, 3, −2, 0.75 or 3/4.' : '';
  }
  renderPalette();
  renderButtons();
}

function check() {
  const s = session, it = s.items[s.cur];
  if (!answered(it)) {
    const fb = $('lp-feedback');
    fb.hidden = false;
    fb.innerHTML = `<p class="lp-verdict">${it.q.type === 'nat' ? 'Type a number first.' : 'Choose an option first.'}</p>`;
    return;
  }
  it.checked = true;
  record[it.q.id] = grade(it) === 'right' ? 1 : 0;
  saveRecord();
  show(s.cur);
  $('lp-feedback').scrollIntoView({ block: 'nearest' });
}

// confirm in the page: action 'finish' (submit the test, or end the practice) or 'quit'
function ask(action) {
  const s = session, n = s.items.length;
  const done = s.items.filter(answered).length, rev = s.items.filter(it => it.review).length;
  let text, yes;
  if (action === 'quit') {
    text = 'Stop now? Your answers to these questions will not be marked.';
    yes = 'Stop';
  } else if (s.mode === 'test') {
    text = `You have answered ${done} of the ${n} questions${rev ? `, and ${plural(rev, 'question')} ${rev === 1 ? 'is' : 'are'} marked for review` : ''}. Submit now?`;
    yes = 'Submit';
  } else {
    text = `You have checked ${s.items.filter(it => it.checked).length} of the ${n} questions. Finish and see your summary?`;
    yes = 'Finish';
  }
  $('lp-confirm').dataset.action = action;
  $('lp-confirm-text').textContent = text;
  $('lp-confirm-yes').textContent = yes;
  $('lp-confirm').hidden = false;
  $('lp-confirm-yes').focus();
}

// ---------------------------------------------------------------- the result
function finish(timeUp = false) {
  const s = session;
  if (!s || s.done) return;
  s.done = true;
  if (s.timer) clearInterval(s.timer);
  window.removeEventListener('beforeunload', guard);
  const rows = s.items.map(it => { const r = grade(it); return { it, r, thirds: thirdsFor(it.q, r, s.negative) }; });
  rows.forEach(({ it, r }) => { if (r !== 'blank') record[it.q.id] = r === 'right' ? 1 : 0; });
  saveRecord();

  const count = r => rows.filter(x => x.r === r).length;
  const total = rows.reduce((t, x) => t + x.it.q.marks, 0);
  const got = rows.reduce((t, x) => t + x.thirds, 0);
  const elapsed = Math.min(Date.now(), s.deadline || Infinity) - s.started;
  $('lp-quiz').hidden = true;
  $('lp-result').hidden = false;
  $('lp-result-note').innerHTML = (timeUp ? '<b>Time is up</b>, so your answers were submitted. ' : '')
    + (s.mode === 'test'
      ? (s.negative ? 'Marked as in GATE: a wrong MCQ answer costs a third of its marks; MSQ and NAT have no negative marks.' : 'Marked without negative marks.')
      : 'Practice mode: each question counts its full marks if right, with no negative marks.');
  const stat = (b, t) => `<div class="lp-stat"><b>${b}</b><span>${t}</span></div>`;
  $('lp-score').innerHTML = stat(`${marksText(got)}<small> / ${total}</small>`, 'marks')
    + stat(count('right'), 'right') + stat(count('wrong'), 'wrong') + stat(count('blank'), 'not answered') + stat(clock(elapsed), 'time taken');

  // by topic, in syllabus order
  const topics = TOPICS.filter(t => rows.some(x => x.it.q.topic === t.id));
  const trow = t => {
    const tr = rows.filter(x => x.it.q.topic === t.id);
    const c = r => tr.filter(x => x.r === r).length;
    const m = tr.reduce((a, x) => a + x.thirds, 0), tot = tr.reduce((a, x) => a + x.it.q.marks, 0);
    return { t, n: tr.length, right: c('right'), wrong: c('wrong'), blank: c('blank'), m, tot };
  };
  const stats = topics.map(trow);
  $('lp-by-topic').innerHTML = `<table><thead><tr><th scope="col">Topic</th><th scope="col">Questions</th><th scope="col">Right</th><th scope="col">Wrong</th><th scope="col">Not answered</th><th scope="col">Marks</th></tr></thead><tbody>${stats.map(x =>
    `<tr><th scope="row">${x.t.name}</th><td>${x.n}</td><td>${x.right}</td><td>${x.wrong}</td><td>${x.blank}</td><td>${marksText(x.m)} / ${x.tot}</td></tr>`).join('')}</tbody></table>`;
  const weak = stats.filter(x => x.right / x.n < 0.6).map(x => x.t.name);
  $('lp-advice').innerHTML = weak.length
    ? `Worth revising: ${weak.map(w => `<b>${w}</b>`).join(', ')}. The solutions below show where each answer comes from.`
    : 'Well done: you got at least 60% of the questions right in every topic.';

  const missed = rows.filter(x => x.r !== 'right').map(x => x.it.q);
  $('lp-missed').hidden = !missed.length;
  $('lp-missed').innerHTML = `<i class="fas fa-rotate-right"></i> Practise the ${plural(missed.length, 'question')} I missed`;
  s.missed = missed;

  // every question with your answer and the solution
  $('lp-review').innerHTML = rows.map(({ it, r, thirds }, i) => {
    const q = it.q;
    const badge = { right: ['ok', 'fa-circle-check', 'Right'], wrong: ['err', 'fa-circle-xmark', 'Wrong'], blank: ['', 'fa-circle-minus', 'Not answered'] }[r];
    const body = q.type === 'nat'
      ? `<p class="lp-natans">Your answer: <b>${responseText(it)}</b>. Correct answer: <b>${answerHTML(q)}</b>.</p>`
      : `${optionsHTML(it, true, `lp-rev-${i}`)}<p class="lp-natans">Your answer: <b>${responseText(it)}</b>. Correct answer: <b>${answerHTML(q)}</b>.</p>`;
    return `<article class="lp-rev" data-result="${r}">
      <div class="lp-meta">
        <span class="lp-badge" data-kind="${badge[0]}"><i class="fas ${badge[1]}"></i> ${badge[2]}</span>
        <span class="lp-tag">Q${i + 1} · ${TYPE_NAME[q.type]} · ${plural(q.marks, 'mark')}</span>
        <span class="lp-tag">${TOPIC[q.topic].name}</span>
        ${q.source ? `<span class="lp-tag lp-tag-src">${q.source}</span>` : ''}
        <span class="lp-got">${marksText(thirds)} / ${q.marks}</span>
      </div>
      <div class="lp-q">${q.q}</div>
      ${body}
      ${q.solution ? `<details class="lp-sol"${r === 'right' ? '' : ' open'}><summary>Solution</summary><div class="lp-solution">${q.solution}</div></details>` : ''}
    </article>`;
  }).join('');
  typeset($('lp-result'));
  $('lp-result').scrollIntoView({ block: 'start' });
}

function backToSetup() {
  if (session && session.timer) clearInterval(session.timer);
  window.removeEventListener('beforeunload', guard);
  session = null;
  $('lp-quiz').hidden = true;
  $('lp-result').hidden = true;
  $('lp-setup').hidden = false;
  renderTopics();
  updateStatus();
  $('lp-setup').scrollIntoView({ block: 'start' });
}

// ---------------------------------------------------------------- wiring
function init() {
  setup.topics = new Set(TOPICS.map(x => x.id));
  // a link may preselect: ?topics=eig,det&mode=test&n=10&types=mcq,nat&gate=1
  const p = new URLSearchParams(location.search);
  const listed = (key, valid) => (p.get(key) || '').split(',').filter(v => valid.includes(v));
  const t = listed('topics', TOPICS.map(x => x.id));
  if (t.length) setup.topics = new Set(t);
  const ty = listed('types', ['mcq', 'msq', 'nat']);
  if (ty.length) setup.types = new Set(ty);
  document.querySelectorAll('#lp-types .tl-chip').forEach(b => b.setAttribute('aria-pressed', String(setup.types.has(b.dataset.type))));
  if (['5', '10', '15', '20', '30', '0'].includes(p.get('n'))) $('lp-count').value = p.get('n');
  if (p.get('gate') === '1') $('lp-gate').checked = true;
  setMode(p.get('mode') === 'test' ? 'test' : 'practice');
  renderTopics();
  updateStatus();

  $('lp-topics').addEventListener('change', e => {
    if (e.target.type !== 'checkbox') return;
    if (e.target.checked) setup.topics.add(e.target.value); else setup.topics.delete(e.target.value);
    updateStatus();
  });
  $('lp-all').addEventListener('click', () => { setup.topics = new Set(TOPICS.map(x => x.id)); renderTopics(); updateStatus(); });
  $('lp-none').addEventListener('click', () => { setup.topics.clear(); renderTopics(); updateStatus(); });
  $('lp-types').addEventListener('click', e => {
    const b = e.target.closest('.tl-chip');
    if (!b) return;
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    if (on) setup.types.add(b.dataset.type); else setup.types.delete(b.dataset.type);
    updateStatus();
  });
  $('lp-mode').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setMode(b.dataset.mode); });
  $('lp-gate').addEventListener('change', updateStatus);
  $('lp-record').addEventListener('click', e => {
    const b = e.target.closest('[data-forget]');
    if (!b) return;
    if (b.dataset.forget === 'ask') { renderRecord(true); return; }
    if (b.dataset.forget === 'yes') { record = {}; saveRecord(); renderTopics(); return; }
    renderRecord();
  });
  $('lp-start').addEventListener('click', () => startFromSetup(readSetup()));
  $('lp-mock').addEventListener('click', () => startFromSetup({
    topics: new Set(TOPICS.map(x => x.id)), types: new Set(['mcq', 'msq', 'nat']), mode: 'test',
    count: 20, fresh: false, negative: true, timed: true,
  }));

  $('lp-palette').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) go(Number(b.dataset.i)); });
  $('lp-card').addEventListener('change', e => { if (e.target.name === 'lp-opt') readResponse(); });
  $('lp-card').addEventListener('input', e => { if (e.target.id === 'lp-nat') readResponse(); });
  $('lp-card').addEventListener('keydown', e => {
    if (e.target.id !== 'lp-nat' || e.key !== 'Enter') return;
    e.preventDefault();
    if (session.mode === 'practice') check(); else go(session.cur + 1);
  });
  $('lp-prev').addEventListener('click', () => go(session.cur - 1));
  $('lp-next').addEventListener('click', () => go(session.cur + 1));
  $('lp-check').addEventListener('click', check);
  $('lp-clear').addEventListener('click', () => {
    const it = session.items[session.cur];
    it.resp = it.q.type === 'msq' ? [] : it.q.type === 'nat' ? '' : null;
    show(session.cur);
  });
  $('lp-review-btn').addEventListener('click', () => {
    const it = session.items[session.cur];
    it.review = !it.review;
    renderPalette();
    renderButtons();
  });
  $('lp-finish').addEventListener('click', () => ask('finish'));
  $('lp-done').addEventListener('click', () => finish(false));
  $('lp-confirm-yes').addEventListener('click', () => ($('lp-confirm').dataset.action === 'quit' ? backToSetup() : finish(false)));
  $('lp-confirm-no').addEventListener('click', () => { $('lp-confirm').hidden = true; });
  $('lp-quit').addEventListener('click', () => (session.items.some(answered) ? ask('quit') : backToSetup()));

  $('lp-missed').addEventListener('click', () => begin(shuffle(session.missed.slice()).sort((a, b) => a.marks - b.marks), { ...session.opts, mode: 'practice' }));
  $('lp-again').addEventListener('click', () => begin(session.items.map(it => it.q), session.opts));
  $('lp-new').addEventListener('click', backToSetup);
}

// ---------------------------------------------------------------- the questions, from questions.tex
// A question the page cannot read is left out, and listed in #lp-problems so that it can be fixed.
async function load() {
  let text;
  try {
    const res = await fetch('questions.tex', { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.statusText);
    text = await res.text();
  } catch {
    $('lp-record').textContent = 'The questions could not be loaded. Reload the page to try again.';
    return false;
  }
  const { topics, questions, problems } = parseQuestions(text);
  QUESTIONS = questions;
  TOPICS = topics.filter(t => questions.some(q => q.topic === t.id));
  TOPIC = Object.fromEntries(TOPICS.map((t, i) => [t.id, { ...t, order: i }]));
  const left = problems.filter(p => p.fatal);
  if (problems.length) console.warn('questions.tex:\n' + problems.map(p => `${p.where}: ${p.message}`).join('\n'));
  if (left.length) {
    const box = $('lp-problems');
    box.innerHTML = `<b>${plural(left.length, 'question')} in questions.tex could not be read, so ${left.length === 1 ? 'it is' : 'they are'} left out:</b><ul>${
      left.map(p => `<li>${esc(p.where)}: ${esc(p.message)}</li>`).join('')}</ul>`;
    box.hidden = false;
  }
  return true;
}

load().then(ok => { if (ok) init(); });
