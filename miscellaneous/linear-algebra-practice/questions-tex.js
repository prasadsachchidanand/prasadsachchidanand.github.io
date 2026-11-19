/*
 * Reads questions.tex (the question bank, written in LaTeX) into the topics and questions the practice
 * page uses. The format is described at the top of questions.tex. Runs in the browser and in Node
 * (check-questions.mjs uses it to check the file before it is pushed).
 *
 * parseQuestions(source) → { topics, questions, problems }
 *   topics:    [{ id, name, weeks }]                 (name and weeks as HTML)
 *   questions: [{ id, topic, type, marks, q, options, answer, solution }]
 *              q, options and solution as HTML with the maths in \( \) and \[ \] for MathJax
 *   problems:  [{ where, message, fatal }]           fatal: the question was left out
 */

const MATH_ENVS = ['equation', 'align', 'gather', 'multline', 'alignat', 'flalign', 'eqnarray', 'displaymath', 'math']
  .flatMap(e => [e, e + '*']);

const escHTML = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// remove % comments (an unescaped % up to the end of the line, and the line break, as in TeX)
function stripComments(s) {
  return s.split('\n').map(line => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '\\') { i++; continue; }
      if (line[i] === '%') return { text: line.slice(0, i), cut: true };
    }
    return { text: line, cut: false };
  }).reduce((out, l, i, all) => out + l.text + (i < all.length - 1 && !l.cut ? '\n' : ''), '');
}

// s[i] is '{': return [contents, index after the closing brace], or null if it is never closed
function readGroup(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '\\') { j++; continue; }
    if (s[j] === '{') depth++;
    else if (s[j] === '}' && --depth === 0) return [s.slice(i + 1, j), j + 1];
  }
  return null;
}

// s[i] is '[': return [contents, index after ']'] (braces may hide a ']'), or null
function readOptional(s, i) {
  let depth = 0;
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === '\\') { j++; continue; }
    if (s[j] === '{') depth++;
    else if (s[j] === '}') depth--;
    else if (s[j] === ']' && depth === 0) return [s.slice(i + 1, j), j + 1];
  }
  return null;
}

const skipSpace = (s, i) => { while (i < s.length && /\s/.test(s[i])) i++; return i; };

// true if the braces in s balance (escaped braces do not count)
function balanced(s) {
  let depth = 0;
  for (let j = 0; j < s.length; j++) {
    if (s[j] === '\\') { j++; continue; }
    if (s[j] === '{') depth++;
    else if (s[j] === '}' && --depth < 0) return false;
  }
  return depth === 0;
}

// Split s into text and maths: [{ math: bool, src }]. Maths is $...$, $$...$$, \(...\), \[...\] or a
// displayed environment such as align*. Throws if a maths delimiter is never closed.
function splitMath(s) {
  const parts = [];
  let text = '', i = 0;
  const push = (src, math) => { if (math) { if (text) parts.push({ math: false, src: text }); text = ''; parts.push({ math: true, src }); } };
  const closeAt = (open, close, from) => {
    for (let j = from; j < s.length; j++) {
      if (s.startsWith(close, j)) return j;
      if (s[j] === '\\') j++;
    }
    throw new Error(`${open} is never closed by ${close}`);
  };
  while (i < s.length) {
    if (s.startsWith('$$', i)) {
      const j = closeAt('$$', '$$', i + 2);
      push(`\\[${s.slice(i + 2, j)}\\]`, true); i = j + 2;
    } else if (s[i] === '$') {
      const j = closeAt('$', '$', i + 1);
      push(`\\(${s.slice(i + 1, j)}\\)`, true); i = j + 1;
    } else if (s.startsWith('\\(', i) || s.startsWith('\\[', i)) {
      const close = s[i + 1] === '(' ? '\\)' : '\\]';
      const j = closeAt(s.slice(i, i + 2), close, i + 2);
      push(s.slice(i, j + 2), true); i = j + 2;
    } else if (s.startsWith('\\begin{', i)) {
      const g = readGroup(s, i + 6);
      if (g && MATH_ENVS.includes(g[0])) {
        const end = `\\end{${g[0]}}`, j = s.indexOf(end, g[1]);
        if (j < 0) throw new Error(`\\begin{${g[0]}} is never closed`);
        push(s.slice(i, j + end.length), true); i = j + end.length;
      } else { text += s.slice(i, i + 7); i += 7; }
    } else if (s[i] === '\\') {
      text += s.slice(i, i + 2); i += 2;           // \$ and \\ are not maths
    } else { text += s[i]; i++; }
  }
  if (text) parts.push({ math: false, src: text });
  return parts;
}

// text-mode commands with one argument, and the HTML they become
const WRAP = {
  emph: ['<em>', '</em>'], textit: ['<em>', '</em>'], textsl: ['<em>', '</em>'], textbf: ['<strong>', '</strong>'],
  texttt: ['<code>', '</code>'], underline: ['<u>', '</u>'],
  text: ['', ''], textrm: ['', ''], textup: ['', ''], textnormal: ['', ''], mbox: ['', ''],
};
const DROP = ['noindent', 'medskip', 'smallskip', 'bigskip', 'hfill', 'centering', 'indent', 'clearpage', 'newpage'];
const DROP_ARG = ['vspace', 'vspace*', 'hspace', 'hspace*', 'label'];
const SYMBOL = { ldots: '…', dots: '…', textellipsis: '…', quad: '&emsp;', qquad: '&emsp;&emsp;', textendash: '–', textemdash: '—', S: '§', LaTeX: 'LaTeX', TeX: 'TeX', newline: '<br>', par: '\n\n' };

// LaTeX text (no maths in it; maths was swapped for placeholders) → HTML
function convertText(s, warn) {
  let out = '', i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\') {
      const m = s.slice(i + 1).match(/^([a-zA-Z]+\*?|.)/);
      const name = m ? m[1] : '';
      let j = i + 1 + name.length;
      if (name === '\\') { out += '<br>'; i = j; if (s[i] === '[') { const o = readOptional(s, i); if (o) i = o[1]; } continue; }
      if ('%&$#_{}'.includes(name)) { out += escHTML(name); i = j; continue; }
      if (name === ',') { out += '&thinsp;'; i = j; continue; }
      if (name === ' ' || name === '\n' || name === '@' || name === '/') { out += name === ' ' || name === '\n' ? ' ' : ''; i = j; continue; }
      const bare = name.replace(/\*$/, '');
      const arg = () => { const k = skipSpace(s, j); return s[k] === '{' ? readGroup(s, k) : null; };
      if (bare in WRAP) {
        const g = arg();
        if (g) { out += WRAP[bare][0] + convertText(g[0], warn) + WRAP[bare][1]; i = g[1]; continue; }
      } else if (name === 'href') {
        const g = arg(), h = g && s[skipSpace(s, g[1])] === '{' && readGroup(s, skipSpace(s, g[1]));
        if (g && h) { out += `<a class="tl-link" href="${escHTML(g[0].trim())}">${convertText(h[0], warn)}</a>`; i = h[1]; continue; }
      } else if (name === 'url') {
        const g = arg();
        if (g) { out += `<a class="tl-link" href="${escHTML(g[0].trim())}">${escHTML(g[0].trim())}</a>`; i = g[1]; continue; }
      } else if (DROP_ARG.includes(name)) {
        const g = arg();
        if (g) { i = g[1]; continue; }
      } else if (DROP.includes(name)) {
        i = skipSpace(s, j); continue;
      } else if (name in SYMBOL) {
        out += SYMBOL[name]; i = j;
        if (/^[a-zA-Z]/.test(name) && s[i] === '{' && s[i + 1] === '}') i += 2;   // \ldots{}
        else if (/^[a-zA-Z]/.test(name)) i = skipSpace(s, i);                       // as in TeX, spaces after a command word go
        continue;
      } else if (name === 'begin' || name === 'end') {
        const g = arg(), env = g && g[0];
        if (env === 'itemize' || env === 'enumerate') {
          i = g[1];
          if (name === 'end') { out += `</li></${env === 'itemize' ? 'ul' : 'ol'}>`; continue; }
          let type = '';
          const k = skipSpace(s, i);
          if (env === 'enumerate' && s[k] === '[') {
            const o = readOptional(s, k);
            if (o) { i = o[1]; const t = (o[0].match(/\\(alph|Alph|roman|Roman)|[aAiI](?![a-zA-Z])/) || [])[0] || ''; type = { '\\alph': 'a', '\\Alph': 'A', '\\roman': 'i', '\\Roman': 'I' }[t] || (/^[aAiI]$/.test(t) ? t : ''); }
          }
          out += env === 'itemize' ? '<ul>' : `<ol${type ? ` type="${type}"` : ''}>`;
          continue;
        }
        if (env === 'center' || env === 'quote') { i = g[1]; out += name === 'begin' ? `<div class="lp-${env}">` : '</div>'; continue; }
        if (env) { warn(`the environment ${env} is not converted for the web page`); out += escHTML(s.slice(i, g[1])); i = g[1]; continue; }
      } else if (name === 'item') {
        out += '</li><li>'; i = j;
        const k = skipSpace(s, i);
        if (s[k] === '[') { const o = readOptional(s, k); if (o) { out += `<b>${convertText(o[0], warn)}</b> `; i = o[1]; } }
        continue;
      }
      warn(`\\${name} is not converted for the web page, so it shows as typed`);
      out += escHTML(s.slice(i, j)); i = j;
      for (let g; s[i] === '{' && (g = readGroup(s, i)); i = g[1]) out += `{${convertText(g[0], warn)}}`;   // its arguments too
      continue;
    }
    if (c === '{' || c === '}') { i++; continue; }                  // grouping braces
    if (c === '~') { out += '&nbsp;'; i++; continue; }
    if (s.startsWith('---', i)) { out += '—'; i += 3; continue; }
    if (s.startsWith('--', i)) { out += '–'; i += 2; continue; }
    if (s.startsWith('``', i)) { out += '“'; i += 2; continue; }
    if (s.startsWith("''", i)) { out += '”'; i += 2; continue; }
    out += escHTML(c); i++;
  }
  // tidy the lists: no empty item before the first \item
  return out.replace(/(<(?:ul|ol)[^>]*>)\s*<\/li>/g, '$1');
}

// LaTeX (text with maths) → HTML. Paragraphs (blank lines) after the first go in <div class="lp-par">.
export function texToHtml(src, warn = () => {}) {
  const parts = splitMath(src.trim());
  const maths = [];
  const joined = parts.map(p => (p.math ? `\u0001${maths.push(p.src) - 1}\u0002` : p.src)).join('');
  if (!balanced(joined)) throw new Error('the braces { } do not balance');
  const html = convertText(joined, warn);
  const paras = html.split(/\n[ \t]*\n\s*/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const body = paras.map((p, k) => (k ? `<div class="lp-par">${p}</div>` : p)).join('');
  return body.replace(/\u0001(\d+)\u0002/g, (_, k) => escHTML(maths[Number(k)]));
}

// a short stable id for a question that has none: the topic and a hash of its source
function hashId(topic, src) {
  let h = 0x811c9dc5;
  for (const ch of src.replace(/\s+/g, ' ').trim()) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return `${topic}-${h.toString(36)}`;
}

// \begin{name} ... \end{name} inside s (not nested): [contents, start, end] or null
function findEnv(s, name) {
  const b = s.indexOf(`\\begin{${name}}`);
  if (b < 0) return null;
  const e = s.indexOf(`\\end{${name}}`, b);
  if (e < 0) throw new Error(`\\begin{${name}} is never closed`);
  return [s.slice(b + name.length + 8, e), b, e + name.length + 6];
}

function parseQuestion(body, opts, topic, warn) {
  const keys = {};
  for (const kv of opts.split(',')) {
    const [k, ...v] = kv.split('=');
    if (k.trim()) keys[k.trim()] = v.join('=').trim();
  }
  for (const k of Object.keys(keys)) if (!['id', 'marks', 'type'].includes(k)) warn(`unknown key "${k}" (use id, marks or type)`);

  let rest = body;
  const cut = env => {
    const f = findEnv(rest, env);
    if (!f) return null;
    rest = rest.slice(0, f[1]) + rest.slice(f[2]);
    return f[0];
  };
  const solSrc = cut('solution');
  const optSrc = cut('options');

  let answerSrc = null;
  const a = rest.search(/\\answer(?![a-zA-Z])/);
  if (a >= 0) {
    const k = skipSpace(rest, a + 7), g = rest[k] === '{' ? readGroup(rest, k) : null;
    if (!g) throw new Error('\\answer needs its value in braces, as in \\answer{2} or \\answer{6.70 to 6.72}');
    answerSrc = g[0].replace(/\$/g, '').trim();
    rest = rest.slice(0, a) + rest.slice(g[1]);
  }

  let options = null, correct = [];
  if (optSrc != null) {
    const pieces = optSrc.split(/\\(option|correct)(?![a-zA-Z])/);
    if (pieces[0].trim()) throw new Error('there is text in the options before the first \\option or \\correct');
    options = [];
    for (let k = 1; k < pieces.length; k += 2) {
      if (pieces[k] === 'correct') correct.push(options.length);
      options.push(texToHtml(pieces[k + 1], warn));
    }
  }

  let type = keys.type ? keys.type.toLowerCase() : answerSrc != null ? 'nat' : correct.length > 1 ? 'msq' : 'mcq';
  if (!['mcq', 'msq', 'nat'].includes(type)) throw new Error(`type=${keys.type}: the type is mcq, msq or nat`);

  let answer;
  if (type === 'nat') {
    if (options) throw new Error('a numerical (nat) question has no options; give \\answer{...} instead');
    if (answerSrc == null) throw new Error('a numerical (nat) question needs \\answer{...}');
    const num = t => { const x = Number(t.replace(/[−–]/g, '-').replace(/\s+/g, '')); return t.trim() && Number.isFinite(x) ? x : NaN; };
    const range = answerSrc.split(/\s+to\s+/);
    if (range.length === 2) {
      const [min, max] = range.map(num);
      if (Number.isNaN(min) || Number.isNaN(max) || min > max) throw new Error(`\\answer{${answerSrc}} is not a range like \\answer{6.70 to 6.72}`);
      answer = { min, max };
    } else {
      const v = num(answerSrc);
      if (Number.isNaN(v)) throw new Error(`\\answer{${answerSrc}} is not a number (write decimals, such as 0.75, not fractions)`);
      answer = { value: v };
    }
  } else {
    if (answerSrc != null) throw new Error(`\\answer is only for numerical questions; in an ${type} question mark the right options with \\correct`);
    if (!options) throw new Error('the options are missing: add \\begin{options} ... \\end{options}, or \\answer{...} for a numerical question');
    if (options.length < 2 || options.length > 4) throw new Error(`there are ${options.length} options; give 2 to 4`);
    if (!correct.length) throw new Error('no option is marked \\correct');
    if (type === 'mcq' && correct.length > 1) throw new Error('an MCQ has exactly one \\correct option (for more, write type=msq)');
    answer = type === 'mcq' ? correct[0] : correct;
  }

  const marks = keys.marks ? Number(keys.marks) : 1;
  if (!Number.isInteger(marks) || marks < 1) throw new Error(`marks=${keys.marks}: marks is a whole number such as 1 or 2`);
  const q = texToHtml(rest, warn);
  if (!q) throw new Error('the question has no text');
  if (solSrc == null) warn('there is no solution');

  return {
    id: keys.id || hashId(topic, body), topic, type, marks, q,
    ...(options ? { options } : {}), answer,
    solution: solSrc == null ? '' : texToHtml(solSrc, warn),
  };
}

// true if s[idx] is inside a % comment
function commented(s, idx) {
  for (let j = s.lastIndexOf('\n', idx - 1) + 1; j < idx; j++) {
    if (s[j] === '\\') j++;
    else if (s[j] === '%') return true;
  }
  return false;
}

// the first needle at or after from that is not in a comment, or -1
function findLive(s, needle, from) {
  for (let i = s.indexOf(needle, from); i >= 0; i = s.indexOf(needle, i + 1)) if (!commented(s, i)) return i;
  return -1;
}

export function parseQuestions(source) {
  const s = source.replace(/\r\n?/g, '\n');
  const lineOf = idx => s.slice(0, idx).split('\n').length;
  let from = findLive(s, '\\begin{document}', 0), to = s.length;
  if (from < 0) from = 0;
  else { const e = findLive(s, '\\end{document}', from); if (e >= 0) to = e; }

  const problems = [], topics = [], questions = [], ids = new Set();
  let topic = null, m;
  const re = /\\topic(?![a-zA-Z])|\\begin\{question\}/g;
  re.lastIndex = from;
  while ((m = re.exec(s)) && m.index < to) {
    if (commented(s, m.index)) continue;
    let where = `Line ${lineOf(m.index)}`;
    const report = (message, fatal) => problems.push({ where, message, fatal });

    if (m[0] === '\\begin{question}') {
      const end = findLive(s, '\\end{question}', m.index);
      if (end < 0 || end > to) { report('\\begin{question} is never closed by \\end{question}', true); break; }
      re.lastIndex = end + 14;
      let i = m.index + 16, opts = '';
      const k = skipSpace(s, i);
      if (s[k] === '[') { const o = readOptional(s, k); if (o) { opts = stripComments(o[0]); i = o[1]; } }
      const idMatch = opts.match(/(?:^|,)\s*id\s*=\s*([^,]+)/);
      if (idMatch) where += ` (id=${idMatch[1].trim()})`;
      if (!topic) { report('the question comes before any \\topic{id}{name}{weeks}', true); continue; }
      try {
        const q = parseQuestion(stripComments(s.slice(i, end)), opts, topic.id, msg => report(msg, false));
        if (ids.has(q.id)) throw new Error(`the id ${q.id} is used twice`);
        ids.add(q.id);
        questions.push(q);
      } catch (err) { report(err.message, true); }
    } else {
      const args = [];
      let i = m.index + 6;
      for (let n = 0; n < 3; n++) {
        const k = skipSpace(s, i);
        const g = s[k] === '{' ? readGroup(s, k) : null;
        if (!g) break;
        args.push(stripComments(g[0])); i = g[1];
      }
      re.lastIndex = i;
      if (args.length < 2) { report('write \\topic{id}{name}{weeks}; the questions below it are left out', true); topic = null; continue; }
      const id = args[0].trim();
      if (!/^[A-Za-z0-9_-]+$/.test(id)) report(`the topic id "${id}" should be letters, digits, - and _ only`, false);
      topic = topics.find(t => t.id === id);       // a topic may be continued further down
      if (!topic) {
        try {
          topic = { id, name: texToHtml(args[1]), weeks: args[2] ? texToHtml(args[2]) : '' };
        } catch (err) { report(err.message, false); topic = { id, name: id, weeks: '' }; }
        topics.push(topic);
      }
    }
  }
  return { topics, questions, problems };
}
