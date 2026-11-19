/*
 * Problem sheet builder: choose daily problems by topic, subtopic, source and difficulty, then
 * print the sheet (or save it as PDF) or download it as LaTeX.
 *
 * It reads the daily-problem data (../data/*.json). Like the problem pages, it uses only problems
 * whose date has come, and their solutions only from the next day. A sheet's link (?ids=...)
 * lists its problems, so the same sheet can be opened again or shared.
 */
(function () {
  const TOPICS = [
    ['linear-algebra', 'Linear Algebra'], ['real-analysis', 'Real Analysis'], ['complex-analysis', 'Complex Analysis'],
    ['abstract-algebra', 'Abstract Algebra'], ['topology', 'Topology'], ['differential-equations', 'Differential Equations'],
    ['miscellaneous', 'Miscellaneous'],
  ];
  const MAIN_TAGS = new Set(['linear-algebra', 'real-analysis', 'complex-analysis', 'abstract-algebra', 'topology', 'differential-equation', 'miscellaneous', 'mcq']);
  const BOOKS = {
    'linear-algebra-hoffman-kunze': 'Hoffman and Kunze, Linear Algebra',
    'real-analysis-bartle-sherbert': 'Bartle and Sherbert, Introduction to Real Analysis',
    'real-analysis-rudin': 'Rudin, Principles of Mathematical Analysis',
    'complex-variables-brown-and-churchill': 'Brown and Churchill, Complex Variables and Applications',
    'abstract-algebra-herstein': 'Herstein, Abstract Algebra',
    'topics-in-algebra-herstein': 'Herstein, Topics in Algebra',
    'topology-munkres': 'Munkres, Topology',
  };
  const EXAMS = [['gate', 'GATE'], ['csir-net', 'CSIR-NET'], ['nbhm', 'NBHM']];
  const SITE = 'https://prasadsachchidanand.github.io';
  const LAST_FOLDER_DATE = '2026-04-29';   // same as problem-loader.js
  const TODAY = new Date().toLocaleDateString('en-CA');   // yyyy-mm-dd, local time

  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const problemURL = date => (date <= LAST_FOLDER_DATE ? `/miscellaneous/daily-problems/${date}/` : `/miscellaneous/daily-problems/problem/?date=${date}`);
  const longDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  let all = [];        // problems whose date has come, newest first
  const state = { topics: new Set(), tags: new Set(), source: 'any', diff: new Set(), count: 10, order: 'random',
    hints: false, solutions: true, sources: true, seed: newSeed(), showAllTags: false };
  let sheet = [];      // the problems on the current sheet

  // ---------------------------------------------------------------- data
  function examLabel(tag) {
    const [pre, name] = EXAMS.find(([p]) => tag.startsWith(p)) || [];
    if (!pre) return tag;
    const rest = tag.slice(pre.length).replace(/^-/, '').split('-').map(w =>
      ({ jan: 'January', feb: 'February', june: 'June', jun: 'June', dec: 'December', phd: 'PhD', msc: 'MSc' }[w] || w)).join(' ');
    return `${name} ${rest}`.trim();
  }

  function enrich(p, topic, topicName) {
    const books = [], exams = [], sub = [];
    for (const raw of p.tags || []) {
      const m = raw.match(/^(.+?)(?: \(([\d.]+)\))?$/);
      const base = (m ? m[1] : raw).trim().toLowerCase();
      if (BOOKS[base]) books.push({ key: base, number: m && m[2] });
      else if (EXAMS.some(([pre]) => base.startsWith(pre + '-') || base === pre)) exams.push(base);
      else if (!MAIN_TAGS.has(base)) sub.push(base);
    }
    return Object.assign({}, p, { topic, topicName, books, exams, sub, diff: p.difficulty || 'unrated' });
  }

  async function load() {
    const lists = await Promise.all(TOPICS.map(([key, name]) =>
      fetch(`../data/${key}.json`, { cache: 'no-cache' })
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(d => d.problems.filter(p => p.date <= TODAY && p.problem).map(p => enrich(p, key, name)))));
    all = lists.flat().sort((a, b) => b.date.localeCompare(a.date));
  }

  // ---------------------------------------------------------------- filters
  function inSource(p) {
    const s = state.source;
    if (s === 'any') return true;
    if (s === 'books') return p.books.length > 0;
    if (s === 'exams') return p.exams.length > 0;
    if (s === 'other') return !p.books.length && !p.exams.length;
    if (s.startsWith('book:')) return p.books.some(b => b.key === s.slice(5));
    if (s.startsWith('exam:')) return p.exams.some(e => e.startsWith(s.slice(5)));
    return true;
  }
  const inTopics = p => !state.topics.size || state.topics.has(p.topic);
  const matches = p => inTopics(p) && inSource(p) &&
    (!state.diff.size || state.diff.has(p.diff)) &&
    (!state.tags.size || p.sub.some(t => state.tags.has(t)));

  // seeded shuffle (mulberry32), so "the same random sheet" can be rebuilt
  function newSeed() { return Math.floor(Math.random() * 2 ** 31); }
  function shuffled(list, seed) {
    let a = seed >>> 0;
    const rand = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }

  function chip(attr, value, label, count, pressed) {
    return `<button type="button" class="tl-chip" ${attr}="${esc(value)}" aria-pressed="${pressed}">${esc(label)}${count != null ? `<small>${count}</small>` : ''}</button>`;
  }

  function renderFilters() {
    const count = f => all.filter(f).length;
    $('ps-topics').innerHTML = TOPICS.map(([k, name]) => chip('data-topic', k, name, count(p => p.topic === k), state.topics.has(k))).join('');
    // subtopics of the chosen topics (all topics if none is chosen)
    const tagCount = {};
    all.filter(inTopics).forEach(p => p.sub.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    const tags = Object.entries(tagCount).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const shown = state.showAllTags ? tags : tags.slice(0, 24);
    state.tags.forEach(t => { if (!tagCount[t]) state.tags.delete(t); });
    $('ps-tags').innerHTML = shown.map(([t, n]) => chip('data-tag', t, t.replace(/-/g, ' '), n, state.tags.has(t))).join('') +
      (tags.length > 24 ? `<button type="button" class="tl-btn" id="ps-more-tags">${state.showAllTags ? 'Fewer subtopics' : `All ${tags.length} subtopics`}</button>` : '');
    // sources
    const books = Object.keys(BOOKS).filter(k => all.some(p => inTopics(p) && p.books.some(b => b.key === k)));
    const exams = EXAMS.filter(([pre]) => all.some(p => inTopics(p) && p.exams.some(e => e.startsWith(pre))));
    const opts = [['any', 'Any source'], ['books', 'Any book'], ...books.map(k => ['book:' + k, 'Book: ' + BOOKS[k]]),
      ['exams', 'Any exam question'], ...exams.map(([pre, name]) => ['exam:' + pre, 'Exam: ' + name]), ['other', 'Neither a book nor an exam']];
    if (!opts.some(o => o[0] === state.source)) state.source = 'any';
    $('ps-source').innerHTML = opts.map(([v, l]) => `<option value="${esc(v)}"${v === state.source ? ' selected' : ''}>${esc(l)}</option>`).join('');
    const diffs = [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard'], ['unrated', 'Not rated']];
    $('ps-diff').innerHTML = diffs.map(([k, l]) => chip('data-diff', k, l, null, state.diff.has(k))).join('');
    const n = all.filter(matches).length;
    $('ps-match').textContent = `${n} problem${n === 1 ? '' : 's'} match`;
    $('ps-build').disabled = n === 0;
  }

  // ---------------------------------------------------------------- the sheet
  function sourceText(p) {
    const parts = [];
    p.books.forEach(b => parts.push(BOOKS[b.key] + (b.number ? `, exercise ${b.number}` : '')));
    p.exams.forEach(e => parts.push(examLabel(e)));
    parts.push(`daily problem of ${longDate(p.date)}`);
    const s = parts.join('; ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  const hasSolution = p => p.date < TODAY && p.solution && p.solution.trim();
  const hasHint = p => p.date < TODAY && p.hint && p.hint.trim();

  function defaultTitle() {
    const topics = [...new Set(sheet.map(p => p.topicName))];
    return topics.length === 1 ? `${topics[0]}: practice problems` : 'Practice problems';
  }
  function subtitle() {
    const topics = [...new Set(sheet.map(p => p.topicName))];
    return `${topics.join(', ')} · ${sheet.length} problem${sheet.length === 1 ? '' : 's'} · ${longDate(TODAY)}`;
  }

  function renderSheet() {
    const title = $('ps-title').value.trim() || defaultTitle();
    const list = (cls, items) => `<ol class="${cls}">${items.join('')}</ol>`;
    let html = `<header class="ps-head"><h2>${esc(title)}</h2><p>${esc(subtitle())}</p></header>`;
    html += list('ps-problems', sheet.map((p, i) => `<li id="ps-p${i + 1}"><div class="ps-math">${p.problem}</div>` +
      (state.sources ? `<p class="ps-src">${esc(sourceText(p))} · <a href="${problemURL(p.date)}">online</a></p>` : '') + '</li>'));
    if (state.hints) {
      html += `<section class="ps-part"><h3>Hints</h3>` + list('ps-answers', sheet.map(p =>
        `<li><div class="ps-math">${hasHint(p) ? p.hint : '<p><em>No hint for this problem.</em></p>'}</div></li>`)) + '</section>';
    }
    if (state.solutions) {
      html += `<section class="ps-part ps-solutions"><h3>Solutions</h3>` + list('ps-answers', sheet.map(p =>
        `<li><div class="ps-math">${hasSolution(p) ? p.solution : `<p><em>The solution appears online on ${esc(longDate(nextDay(p.date)))}.</em></p>`}</div></li>`)) + '</section>';
    }
    $('ps-sheet').innerHTML = html;
    $('ps-result').hidden = false;
    typeset($('ps-sheet'));
  }
  function nextDay(d) { const t = new Date(d + 'T12:00:00'); t.setDate(t.getDate() + 1); return t.toLocaleDateString('en-CA'); }

  // each block on its own, so equation labels from different problems cannot clash
  async function typeset(root) {
    const mj = window.MathJax;
    if (!mj || !mj.startup || !mj.startup.promise) return;
    await mj.startup.promise;
    for (const el of root.querySelectorAll('.ps-math')) {
      if (mj.texReset) mj.texReset();
      try { await mj.typesetPromise([el]); } catch (e) { /* leave this block as text */ }
    }
  }

  function build(fresh) {
    if (fresh) state.seed = newSeed();
    let list = all.filter(matches);
    if (state.order === 'newest') list.sort((a, b) => b.date.localeCompare(a.date));
    else if (state.order === 'oldest') list.sort((a, b) => a.date.localeCompare(b.date));
    else list = shuffled(list, state.seed);
    sheet = list.slice(0, state.count);
    const short = sheet.length < state.count;
    $('ps-status').textContent = short ? `Only ${sheet.length} problem${sheet.length === 1 ? '' : 's'} match these choices, so the sheet has ${sheet.length}.` : '';
    renderSheet();
    saveLink();
    $('ps-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------------------------------------------------------------- link, print, LaTeX
  function linkURL() {
    const u = new URL(location.href);
    u.search = '';
    u.searchParams.set('ids', sheet.map(p => p.date).join(','));
    const title = $('ps-title').value.trim();
    if (title) u.searchParams.set('title', title);
    u.searchParams.set('show', [state.hints ? 'h' : '', state.solutions ? 's' : '', state.sources ? 'r' : ''].join('') || '-');
    u.hash = '';
    return u.toString();
  }
  function saveLink() { history.replaceState(null, '', linkURL()); }

  function copyLink() {
    const url = linkURL();
    const done = () => flash($('ps-copy'), '<i class="fas fa-check"></i> Link copied');
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, () => prompt('Copy this link:', url));
    else prompt('Copy this link:', url);
  }
  function flash(button, html) { const old = button.innerHTML; button.innerHTML = html; setTimeout(() => { button.innerHTML = old; }, 1600); }

  // HTML of a problem -> LaTeX. The problems are HTML with TeX maths in the text.
  function htmlToLatex(html) {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
    return walk(doc.body.firstChild).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  }
  function walk(node) { let out = ''; node.childNodes.forEach(n => { out += convert(n); }); return out; }
  function convert(n) {
    if (n.nodeType === 3) return textToLatex(n.nodeValue);
    if (n.nodeType !== 1) return '';
    const tag = n.tagName.toLowerCase();
    const cls = String(n.getAttribute('class') || '');
    const inner = () => walk(n);
    switch (tag) {
      case 'strong': case 'b': return `\\textbf{${inner().trim()}}`;
      case 'em': case 'i': return `\\emph{${inner().trim()}}`;
      case 'br': return '\n\n';
      case 'hr': return '\n\n\\medskip\n\n';
      case 'p': case 'div': case 'section': case 'article': return `\n\n${inner().trim()}\n\n`;
      case 'h1': case 'h2': case 'h3': case 'h4': return `\n\n\\textbf{${inner().trim()}}\n\n`;
      case 'ul': return `\n\\begin{itemize}\n${inner()}\n\\end{itemize}\n`;
      case 'ol': {
        if (/disc/.test(cls)) return `\n\\begin{itemize}\n${inner()}\n\\end{itemize}\n`;
        const label = /alpha/.test(cls) ? '(\\alph*)' : /roman/.test(cls) ? '(\\roman*)' : '\\arabic*.';
        return `\n\\begin{enumerate}[label=${label}]\n${inner()}\n\\end{enumerate}\n`;
      }
      case 'li': return `\\item ${inner().trim()}\n`;
      case 'a': {
        const href = n.getAttribute('href') || '';
        const text = inner().trim();
        if (!href || href.startsWith('#')) return text;
        const url = new URL(href, SITE + '/miscellaneous/daily-problems/').toString();
        return `\\href{${url.replace(/[%#]/g, c => '\\' + c)}}{${text || '\\url{' + url + '}'}}`;
      }
      case 'img': case 'svg': case 'figure': return '\n\n\\emph{[A figure: see the online version.]}\n\n';
      case 'table': return '\n\n\\emph{[A table: see the online version.]}\n\n';
      case 'blockquote': return `\n\\begin{quote}\n${inner().trim()}\n\\end{quote}\n`;
      case 'code': return `\\texttt{${inner()}}`;
      case 'input': case 'button': case 'script': case 'style': case 'iframe': return '';
      default: return inner();
    }
  }
  // Text with maths: leave the maths (and references such as \eqref{eq:1}) alone, and escape LaTeX's
  // special characters in the rest. A blank line inside maths is an error in LaTeX (not in MathJax).
  const MATH = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\\begin\{([a-zA-Z*]+)\}[\s\S]*?\\end\{\2\}|\$(?:\\.|[^$\\])+\$|\\(?:eqref|ref|autoref|pageref|label|cite[a-z]*|url)\{[^{}]*\})/g;
  function textToLatex(s) {
    let out = '', last = 0;
    s.replace(MATH, (m, _a, _b, offset) => {
      out += plainText(s.slice(last, offset)) + m.replace(/\n[ \t]*(?:\n[ \t]*)+/g, '\n');
      last = offset + m.length;
      return m;
    });
    return out + plainText(s.slice(last));
  }
  const plainText = t => t
    .replace(/([&%#_])/g, '\\$1')
    .replace(/</g, '\\textless{}').replace(/>/g, '\\textgreater{}')
    .replace(/✓/g, '$\\checkmark$');

  function latexDocument() {
    const title = $('ps-title').value.trim() || defaultTitle();
    const L = [];
    L.push('% Made with the problem sheet builder: ' + SITE + '/miscellaneous/daily-problems/sheets/');
    L.push('% Problems from the daily problems of Sachchidanand Prasad. Compile with pdfLaTeX.');
    L.push(String.raw`\documentclass[11pt]{article}`);
    L.push(String.raw`\usepackage[a4paper,margin=2.2cm]{geometry}`);
    L.push(String.raw`\usepackage{amsmath,amssymb,amsthm,mathtools}`);
    L.push(String.raw`\usepackage{nicefrac}`);
    L.push(String.raw`\usepackage{enumitem}`);
    L.push(String.raw`\usepackage{xcolor}`);
    L.push(String.raw`\usepackage[colorlinks=true,urlcolor=blue,linkcolor=blue]{hyperref}`);
    L.push(String.raw`\providecommand{\lt}{<}`);
    L.push(String.raw`\providecommand{\gt}{>}`);
    L.push(String.raw`\setlength{\parindent}{0pt}`);
    L.push(String.raw`\setlength{\parskip}{4pt}`);
    L.push(String.raw`\begin{document}`);
    L.push(String.raw`\begin{center}{\Large\bfseries ` + plainText(title) + String.raw`}\\[4pt]{\small ` + plainText(subtitle()) + String.raw`}\end{center}`);
    L.push(String.raw`\begin{enumerate}[label=\textbf{\arabic*.}, leftmargin=*, itemsep=1.2em]`);
    sheet.forEach(p => {
      L.push('% Daily problem of ' + p.date);
      L.push(String.raw`\item ` + htmlToLatex(p.problem));
      if (state.sources) L.push(String.raw`\par{\small\itshape ` + plainText(sourceText(p)) + String.raw` (\href{` + SITE + problemURL(p.date).replace(/[%#]/g, c => '\\' + c) + '}{online}).}');
    });
    L.push(String.raw`\end{enumerate}`);
    const part = (name, get) => {
      L.push(String.raw`\section*{` + name + '}');
      L.push(String.raw`\begin{enumerate}[label=\textbf{\arabic*.}, leftmargin=*, itemsep=1em]`);
      sheet.forEach(p => { L.push('% ' + name + ': daily problem of ' + p.date); L.push(String.raw`\item ` + get(p)); });
      L.push(String.raw`\end{enumerate}`);
    };
    if (state.hints) part('Hints', p => (hasHint(p) ? htmlToLatex(p.hint) : String.raw`\emph{No hint for this problem.}`));
    if (state.solutions) { L.push(String.raw`\newpage`); part('Solutions', p => (hasSolution(p) ? htmlToLatex(p.solution) : String.raw`\emph{The solution appears online on ` + longDate(nextDay(p.date)) + '.}')); }
    L.push(String.raw`\end{document}`);
    return L.join('\n') + '\n';
  }

  function downloadLatex() {
    const title = ($('ps-title').value.trim() || defaultTitle()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'problem-sheet';
    const url = URL.createObjectURL(new Blob([latexDocument()], { type: 'application/x-tex;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: title + '.tex' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------------------------------------------------------------- start
  function wire() {
    $('ps-filters').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.topic) { state.topics.has(b.dataset.topic) ? state.topics.delete(b.dataset.topic) : state.topics.add(b.dataset.topic); }
      else if (b.dataset.tag) { state.tags.has(b.dataset.tag) ? state.tags.delete(b.dataset.tag) : state.tags.add(b.dataset.tag); }
      else if (b.dataset.diff) { state.diff.has(b.dataset.diff) ? state.diff.delete(b.dataset.diff) : state.diff.add(b.dataset.diff); }
      else if (b.id === 'ps-more-tags') state.showAllTags = !state.showAllTags;
      else return;
      renderFilters();
    });
    $('ps-source').addEventListener('change', e => { state.source = e.target.value; renderFilters(); });
    $('ps-count').addEventListener('change', e => { const n = parseInt(e.target.value, 10); state.count = Math.min(50, Math.max(1, n || 10)); e.target.value = state.count; });
    $('ps-order').addEventListener('change', e => { state.order = e.target.value; });
    ['hints', 'solutions', 'sources'].forEach(k => $('ps-' + k).addEventListener('change', e => {
      state[k] = e.target.checked;
      if (sheet.length) { renderSheet(); saveLink(); }
    }));
    $('ps-build').addEventListener('click', () => build(true));
    $('ps-shuffle').addEventListener('click', () => { state.order = 'random'; $('ps-order').value = 'random'; build(true); });
    $('ps-title').addEventListener('change', () => { if (sheet.length) { renderSheet(); saveLink(); } });
    $('ps-print').addEventListener('click', () => window.print());
    $('ps-latex').addEventListener('click', downloadLatex);
    $('ps-copy').addEventListener('click', copyLink);
  }

  // a link with ?ids= opens that exact sheet
  function fromLink() {
    const q = new URLSearchParams(location.search);
    if (!q.get('ids')) return false;
    const byDate = new Map(all.map(p => [p.date, p]));
    sheet = q.get('ids').split(',').map(d => byDate.get(d.trim())).filter(Boolean);
    if (!sheet.length) return false;
    if (q.get('title')) $('ps-title').value = q.get('title');
    const show = q.get('show') || 'sr';
    state.hints = show.includes('h'); state.solutions = show.includes('s'); state.sources = show.includes('r');
    ['hints', 'solutions', 'sources'].forEach(k => { $('ps-' + k).checked = state[k]; });
    renderSheet();
    return true;
  }

  async function start() {
    wire();
    try {
      await load();
    } catch (e) {
      $('ps-match').textContent = 'The problems could not be loaded. Please refresh the page.';
      return;
    }
    $('ps-total').textContent = all.length.toLocaleString('en');
    renderFilters();
    fromLink();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
