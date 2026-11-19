/*
 * Code formatter: LaTeX (tex-fmt), BibTeX (bibtex-tidy), Typst (typstyle) and HTML (Prettier).
 *
 * Everything runs in the visitor's browser; nothing is uploaded. Each formatter is downloaded
 * the first time its tab is used. The formatter files are kept unchanged in ./vendor
 * (versions and licences in vendor/README.md); to update one, replace the files there.
 * The code boxes (line numbers, colours, Tab indenting) are in editor.js and syntax.js.
 */
import { makeEditor, enableTabIndent } from './editor.js';

const VENDOR = new URL('./vendor/', import.meta.url);
const $ = id => document.getElementById(id);
// Run a loader once; if it fails, allow a retry
const once = f => { let p = null; return () => (p = p || f().catch(e => { p = null; throw e; })); };

const loadTexFmt = once(async () => {
  const m = await import(new URL('tex-fmt/tex_fmt.js', VENDOR).href);
  await m.default({ module_or_path: new URL('tex-fmt/tex_fmt_bg.wasm', VENDOR) });
  const v = document.getElementById('texfmt-version');   // shown in the credits once it is known
  if (v) v.textContent = ' ' + m.version();
  return m;
});
const loadBibtexTidy = once(() => import(new URL('bibtex-tidy/bibtex-tidy.js', VENDOR).href));
// typstyle's package is made for build tools; connect its WebAssembly part by hand
const loadTypstyle = once(async () => {
  const glue = await import(new URL('typstyle/typstyle_wasm_bg.js', VENDOR).href);
  const res = await fetch(new URL('typstyle/typstyle_wasm_bg.wasm', VENDOR));
  if (!res.ok) throw new Error(`could not download the Typst formatter (${res.status})`);
  const { instance } = await WebAssembly.instantiate(await res.arrayBuffer(), { './typstyle_wasm_bg.js': glue });
  glue.__wbg_set_wasm(instance.exports);
  if (instance.exports.__wbindgen_start) instance.exports.__wbindgen_start();
  return glue;
});
const loadPrettier = once(async () => {
  const files = ['standalone', 'plugin-html', 'plugin-postcss', 'plugin-babel', 'plugin-estree'];
  const [prettier, ...plugins] = await Promise.all(files.map(f => import(new URL(`prettier/${f}.js`, VENDOR).href)));
  return { prettier, plugins };
});

const spaces = o => (o.indent === 'tab' ? 2 : Number(o.indent));

const LANGS = {
  latex: {
    label: 'LaTeX', tool: 'tex-fmt', size: '1.3 MB', ext: 'tex', exts: ['tex', 'sty', 'cls', 'ltx'],
    options: ['indent', 'width', 'wrap', 'tables'],
    defaults: { indent: '2', width: 80, wrap: false, tables: false },
    load: loadTexFmt,
    format(m, text, o) {
      const config = [
        `wrap = ${o.wrap}`,
        `wraplen = ${o.width}`,
        `wrapmin = ${Math.max(10, o.width - 10)}`,
        `tabsize = ${o.indent === 'tab' ? 1 : spaces(o)}`,
        `tabchar = "${o.indent === 'tab' ? 'tab' : 'space'}"`,
        `format-tables = ${o.tables}`,
      ].join('\n');
      const r = m.main(text, config);
      let out = String(r.output);
      // tex-fmt 0.5.7 adds an empty first line when "format-tables" is on and the text starts with a table
      if (out.startsWith('\n') && !text.startsWith('\n')) out = out.slice(1);
      return { text: out, notes: String(r.logs || '').trim() };
    },
  },
  bibtex: {
    label: 'BibTeX', tool: 'bibtex-tidy', size: '0.2 MB', ext: 'bib', exts: ['bib'],
    options: ['indent', 'align', 'sort', 'merge', 'curly'],
    defaults: { indent: '2', align: true, sort: 'none', merge: false, curly: true },
    load: loadBibtexTidy,
    format(m, text, o) {
      const r = m.tidy(text, {
        space: spaces(o),
        tab: o.indent === 'tab',
        align: o.align ? 14 : false,
        sort: o.sort === 'key' ? ['key'] : o.sort === 'year' ? ['-year', 'key'] : false,
        duplicates: ['doi', 'key', 'abstract', 'citation'],
        merge: o.merge ? 'combine' : false,
        curly: o.curly,
        blankLines: true,
      });
      return { text: r.bibtex, notes: (r.warnings || []).map(w => w.message).join('\n') };
    },
  },
  typst: {
    label: 'Typst', tool: 'typstyle', size: '0.7 MB', ext: 'typ', exts: ['typ'],
    options: ['indent', 'width', 'wrap'], noTabs: true,
    defaults: { indent: '2', width: 80, wrap: false },
    load: loadTypstyle,
    format(m, text, o) {
      return { text: m.format(text, { tab_spaces: spaces(o), max_width: o.width, wrap_mode: o.wrap ? 'fill' : 'none' }) };
    },
  },
  html: {
    label: 'HTML', tool: 'Prettier', size: '0.9 MB', ext: 'html', exts: ['html', 'htm'],
    options: ['indent', 'width'],
    defaults: { indent: '2', width: 80 },
    load: loadPrettier,
    async format({ prettier, plugins }, text, o) {
      const out = await prettier.format(text, { parser: 'html', plugins, printWidth: o.width, tabWidth: spaces(o), useTabs: o.indent === 'tab' });
      return { text: out };
    },
  },
};

const R = String.raw;
const EXAMPLES = {
  latex: R`\documentclass{article}
\usepackage{amsmath,amsthm}
\newtheorem{theorem}{Theorem}
\begin{document}
\section{Introduction}
Let $M$ be a closed Riemannian manifold and $N\subset M$ a closed submanifold.
\begin{theorem}\label{thm:main}
The squared distance function $d_N^2$ is Morse--Bott on $M\setminus\mathrm{Cu}(N)$.
\end{theorem}
\begin{proof}
\begin{enumerate}
\item First consider the distance function
\begin{align}
d_N(x)&=\inf_{y\in N}d(x,y),\\
\nabla d_N^2&=2\,d_N\,\nabla d_N.
\end{align}
\item Then use the gradient flow.
\end{enumerate}
\end{proof}
\begin{tabular}{c|c}
$n$ & $n^2$\\
\hline
1 & 1\\
10 & 100
\end{tabular}
\end{document}
`,
  bibtex: R`@article{BasuPrasad2023,
title="A connection between cut locus, {T}hom space and {M}orse-{B}ott functions",
author = {Basu, Somnath and Prasad, Sachchidanand},
journal={Algebraic \& Geometric Topology},
year = 2023, volume={23},number={9},
pages = {4185--4233},
doi={10.2140/agt.2023.23.4185}}
@MISC{basu2025spheres,
    AUTHOR={Basu, Somnath and Prasad, Sachchidanand},
  TITLE = {On manifolds homeomorphic to spheres},YEAR={2025},
      EPRINT={2509.13008}, ARCHIVEPREFIX = {arXiv}}
@phdthesis{prasad2023thesis, author={Prasad, Sachchidanand}, title={Cut Locus of Submanifolds: A Geometric and Topological Viewpoint}, school={Indian Institute of Science Education and Research Kolkata}, year={2023}}
`,
  typst: R`#set page(paper:"a4",margin:2cm)
#set text(size:11pt)
= Introduction
Let $M$ be a closed manifold and $N subset M$ a closed submanifold.
#let theorem(body)=block(fill:luma(240),inset:8pt,radius:4pt,[*Theorem.* #body])
#theorem[The squared distance $d_N^2$ is Morse--Bott on $M without "Cu"(N)$.]
#table(columns:3,[$n$],[$n^2$],[$n^3$],[1],[1],[1],[2],[4],[8])
`,
  html: R`<!DOCTYPE html><html><head><title>Seminar</title><style>body{font-family:sans-serif;margin:2rem}h1{color:#4338ca}</style></head>
<body><h1>Topology and Geometry Seminar</h1><p>Speaker: <b>Sachchidanand Prasad</b><br>Title: Cut locus and Thom spaces</p>
<ul><li>Date: 20 November</li><li>Room: A-101</li></ul>
<script>document.querySelectorAll('li').forEach(function(li){li.style.margin='4px'})</script></body></html>
`,
};

// ---------------------------------------------------------------- state (kept in this browser)
const STORE = 'code-formatter:v1';
const state = { lang: 'latex', live: true, opts: {}, input: {}, fileName: {} };
function loadState() {
  try { Object.assign(state, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) { /* private window etc. */ }
  for (const k of Object.keys(LANGS)) state.opts[k] = Object.assign({}, LANGS[k].defaults, state.opts && state.opts[k]);
  state.input = state.input || {};
  state.fileName = {};
  const fromHash = location.hash.slice(1);
  if (LANGS[fromHash]) state.lang = fromHash;
  if (!LANGS[state.lang]) state.lang = 'latex';
}
let saveTimer;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ lang: state.lang, live: state.live, opts: state.opts, input: state.input })); } catch (e) { /* not saved */ }
  }, 250);
}

// ---------------------------------------------------------------- page
const inEd = makeEditor($('cf-in'), () => state.lang);
const outEd = makeEditor($('cf-out'), () => state.lang);
enableTabIndent(inEd.el, () => { const o = state.opts[state.lang]; return o.indent === 'tab' ? '\t' : ' '.repeat(spaces(o)); });

function status(text, kind, goTo) {
  const el = $('cf-status');
  el.textContent = text;
  el.dataset.kind = kind || '';
  if (goTo && goTo.line) {
    const b = Object.assign(document.createElement('button'), { type: 'button', className: 'cf-linkbtn', textContent: `Go to line ${goTo.line}` });
    b.addEventListener('click', () => { inEd.goTo(goTo.line, goTo.column); updateInfo(); });
    el.append(' ', b);
  }
}
function notes(text) { $('cf-notes').hidden = !text; $('cf-notes').textContent = text || ''; }
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
function updateInfo() {
  const c = inEd.cursor();
  $('cf-in-info').textContent = inEd.value ? `Line ${c.line}, column ${c.column} · ${plural(inEd.lineCount, 'line')}` : '';
  $('cf-out-info').textContent = outEd.value ? plural(outEd.lineCount, 'line') : '';
}
function setStale(on) { $('cf-pane-out').classList.toggle('cf-stale', on); }

function showLang(lang, initial) {
  if (!initial) state.input[state.lang] = inEd.value;   // keep what was typed in the old tab
  state.lang = lang;
  const L = LANGS[lang];
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.querySelectorAll('[data-opt]').forEach(el => { el.hidden = !L.options.includes(el.dataset.opt); });
  $('opt-tab').hidden = $('opt-tab').disabled = !!L.noTabs;   // typstyle indents with spaces only
  const o = state.opts[lang];
  if (L.noTabs && o.indent === 'tab') o.indent = '2';
  $('opt-indent').value = o.indent;
  if ('width' in o) $('opt-width').value = o.width;
  ['wrap', 'tables', 'align', 'merge', 'curly'].forEach(k => { if (k in o) $(`opt-${k}`).checked = !!o[k]; });
  if ('sort' in o) $('opt-sort').value = o.sort;
  inEd.set(state.input[lang] || '');
  inEd.mark(0);
  inEd.el.placeholder = `Paste your ${L.label} here, open a file, or click “Example”.`;
  outEd.set('');
  setStale(false);
  $('cf-file').accept = L.exts.map(e => '.' + e).join(',') + ',.txt';
  dropUndo();
  status(''); notes(''); updateInfo();
  history.replaceState(null, '', '#' + lang);
  saveState();
  if (state.live && inEd.value.trim()) runFormat(true);
}

function readOptions() {
  const o = state.opts[state.lang];
  o.indent = $('opt-indent').value;
  const w = parseInt($('opt-width').value, 10);
  if ('width' in o) o.width = Number.isFinite(w) ? Math.min(200, Math.max(20, w)) : 80;
  ['wrap', 'tables', 'align', 'merge', 'curly'].forEach(k => { if (k in o) o[k] = $(`opt-${k}`).checked; });
  if ('sort' in o) o.sort = $('opt-sort').value;
  saveState();
  return o;
}

// ---------------------------------------------------------------- formatting
// The first line number mentioned in a message ("... is line 12")
const lineIn = text => { const m = String(text || '').match(/\bline (\d+)/i); return m ? Number(m[1]) : 0; };

// A short message, and the line (and column) when the formatter says where the problem is
function describe(e, L) {
  if (e && e.loadFailed) return { message: e.message, line: 0 };
  const raw = String((e && e.message) || e || 'unknown error').replace(/\u001b\[[0-9;]*m/g, '');
  if (e && e.loc && e.loc.start) {                       // Prettier
    const first = raw.split('\n')[0].replace(/\s*For more info see \S+/, '').replace(/\s*\(\d+:\d+\)\s*$/, '');
    return { message: `Line ${e.loc.start.line}: ${first}`, line: e.loc.start.line, column: e.loc.start.column };
  }
  if (e && typeof e.line === 'number') {                 // bibtex-tidy
    return { message: `Syntax error near line ${e.line}: check that every { and " before it is closed.`, line: e.line, column: e.column };
  }
  if (L.tool === 'typstyle' && /syntax error/i.test(raw)) {
    return { message: 'This Typst has a syntax error: check for an unclosed bracket, parenthesis, quote or $.', line: 0 };
  }
  return { message: `Could not format this ${L.label}: ${raw.slice(0, 600)}`, line: lineIn(raw) };
}

let busy = false, again = false, liveTimer = 0;
function scheduleLive(delay) {
  if (!state.live) return;
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => runFormat(true), delay);
}

// auto: started by typing or by an option change (quiet when there is nothing to format)
async function runFormat(auto) {
  if (busy) { again = true; return; }
  clearTimeout(liveTimer);
  const lang = state.lang, L = LANGS[lang], text = inEd.value;
  if (!text.trim()) {
    outEd.set(''); setStale(false); inEd.mark(0); notes(''); updateInfo();
    status(auto ? '' : `Paste some ${L.label} first, or click “Example”.`, 'info');
    return;
  }
  busy = true;
  $('cf-format').disabled = true;
  const o = readOptions();
  const loading = setTimeout(() => status(`Loading the ${L.label} formatter (about ${L.size}, only the first time)…`, 'info'), 150);
  try {
    let mod;
    try { mod = await L.load(); } catch (e) {
      throw Object.assign(new Error(`Could not load the ${L.label} formatter. Check the internet connection and try again.`), { loadFailed: true });
    }
    clearTimeout(loading);
    const t0 = performance.now();
    const result = await L.format(mod, text, o);
    const ms = Math.max(1, Math.round(performance.now() - t0));
    if (state.lang === lang) {
      outEd.set(result.text);
      setStale(false);
      inEd.mark(lineIn(result.notes), 'warn');
      notes(result.notes);
      status(result.text === text ? `Already tidy: no changes (${L.tool}).` : `Formatted with ${L.tool} in ${ms} ms.`, 'ok');
    }
  } catch (e) {
    clearTimeout(loading);
    if (state.lang === lang) {
      const err = describe(e, L);
      inEd.mark(err.line, 'error');
      setStale(!!outEd.value);   // keep the last result that worked, greyed out
      notes('');
      status(err.message, 'error', err);
    }
  } finally {
    busy = false;
    $('cf-format').disabled = false;
    updateInfo();
    // run again if something changed while this run was busy
    if (again || (state.live && state.lang === lang && inEd.value !== text)) { again = false; runFormat(true); }
  }
}

// ---------------------------------------------------------------- buttons
// A one-step Undo after Clear, Example, Open file and Use as input
let undoText = null;
function dropUndo() { undoText = null; $('cf-undo').hidden = true; }
function replaceInput(text) {
  undoText = inEd.value.trim() ? { lang: state.lang, text: inEd.value } : null;
  inEd.set(text);
  inEd.mark(0);
  state.input[state.lang] = text;
  saveState();
  $('cf-undo').hidden = !undoText;
  updateInfo();
}
function undo() {
  if (!undoText) return;
  const { lang, text } = undoText;
  if (lang !== state.lang) showLang(lang);
  inEd.set(text);
  state.input[state.lang] = text;
  saveState();
  dropUndo();
  updateInfo();
  if (state.live) runFormat(true); else status('Brought back your previous code.', 'info');
}

function flash(button, html) {
  const old = button.innerHTML;
  button.innerHTML = html;
  setTimeout(() => { button.innerHTML = old; }, 1500);
}

function copyOutput() {
  const text = outEd.value;
  if (!text) { status('Nothing to copy yet: format some code first.', 'info'); return; }
  const done = () => flash($('cf-copy'), '<i class="fas fa-check"></i> Copied');
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
  else fallback();
  function fallback() {
    outEd.el.select();
    try { document.execCommand('copy'); done(); } catch (e) { status('Select the formatted code and copy it by hand.', 'info'); }
  }
}

function downloadOutput() {
  const L = LANGS[state.lang];
  const text = outEd.value;
  if (!text) { status('Nothing to download yet: format some code first.', 'info'); return; }
  const name = state.fileName[state.lang] || `formatted.${L.ext}`;
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openFile(file) {
  if (!file) return;
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const lang = Object.keys(LANGS).find(k => LANGS[k].exts.includes(ext));
  if (lang && lang !== state.lang) showLang(lang);
  const reader = new FileReader();
  reader.onload = () => {
    replaceInput(String(reader.result));
    state.fileName[state.lang] = file.name;
    outEd.set(''); setStale(false); notes('');
    status(`Opened ${file.name}.`, 'info');
    if (state.live) runFormat(true);
  };
  reader.onerror = () => status(`Could not read ${file.name}.`, 'error');
  reader.readAsText(file);
}

function start() {
  loadState();
  $('opt-live').checked = state.live;
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => showLang(b.dataset.lang)));
  document.querySelectorAll('#cf-options select, #cf-options input').forEach(el => el.addEventListener('change', () => { readOptions(); scheduleLive(0); }));
  $('opt-live').addEventListener('change', e => { state.live = e.target.checked; saveState(); scheduleLive(0); });
  inEd.el.addEventListener('input', () => {
    state.input[state.lang] = inEd.value;
    saveState();
    dropUndo();
    updateInfo();
    scheduleLive(400);
  });
  ['keyup', 'click', 'select', 'focus'].forEach(t => inEd.el.addEventListener(t, updateInfo));
  document.addEventListener('selectionchange', () => { if (document.activeElement === inEd.el) updateInfo(); });
  $('cf-format').addEventListener('click', () => runFormat(false));
  $('cf-copy').addEventListener('click', copyOutput);
  $('cf-download').addEventListener('click', downloadOutput);
  $('cf-use').addEventListener('click', () => {
    if (!outEd.value) { status('Nothing to use yet: format some code first.', 'info'); return; }
    replaceInput(outEd.value);
    status('The formatted code is now in “Your code”, ready to edit.', 'info');
    if (state.live) runFormat(true);
  });
  $('cf-example').addEventListener('click', () => {
    replaceInput(EXAMPLES[state.lang]);
    delete state.fileName[state.lang];
    runFormat(false);
  });
  $('cf-clear').addEventListener('click', () => {
    replaceInput('');
    delete state.fileName[state.lang];
    outEd.set(''); setStale(false); notes('');
    status(undoText ? 'Cleared.' : '', 'info');
    updateInfo();
    inEd.el.focus();
  });
  $('cf-undo').addEventListener('click', undo);
  $('cf-open').addEventListener('click', () => $('cf-file').click());
  $('cf-file').addEventListener('change', e => { openFile(e.target.files[0]); e.target.value = ''; });
  inEd.el.addEventListener('dragover', e => { e.preventDefault(); inEd.el.classList.add('cf-drop'); });
  inEd.el.addEventListener('dragleave', () => inEd.el.classList.remove('cf-drop'));
  inEd.el.addEventListener('drop', e => { e.preventDefault(); inEd.el.classList.remove('cf-drop'); openFile(e.dataTransfer.files[0]); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runFormat(false); }
  });
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (LANGS[h] && h !== state.lang) showLang(h); });
  showLang(state.lang, true);
}

start();
