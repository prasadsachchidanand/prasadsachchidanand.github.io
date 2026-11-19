/*
 * Citation tools.
 *  1. Get BibTeX: for DOIs, arXiv numbers or titles, from the databases behind DOIs (Crossref for
 *     journal DOIs, DataCite for arXiv DOIs). Only the identifiers are sent to them.
 *  2. Check a paper: compares the citations and cross-references of .tex files with a .bib file.
 *     This part runs entirely in the browser.
 * BibTeX is tidied with bibtex-tidy, the copy kept for the code formatter.
 */
import { tidy } from '../code-formatter/vendor/bibtex-tidy/bibtex-tidy.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plural = (n, w, ws) => `${n} ${n === 1 ? w : (ws || w + 's')}`;

function flash(button, html) { const old = button.innerHTML; button.innerHTML = html; setTimeout(() => { button.innerHTML = old; }, 1500); }
function copy(text, button) {
  const done = () => flash(button, '<i class="fas fa-check"></i> Copied');
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => {});
}
function download(text, name, type) {
  const url = URL.createObjectURL(new Blob([text], { type: (type || 'text/plain') + ';charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------------------------------------------------------------- tabs
function showTab(name) {
  document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tab === name)));
  $('ct-get').hidden = name !== 'get';
  $('ct-check').hidden = name !== 'check';
  history.replaceState(null, '', '#' + name);
}

// ================================================================ 1. Get BibTeX
// One identifier per line: a DOI (or doi.org link), an arXiv number (or arXiv link), or a title
function parseLine(line) {
  const s = line.trim().replace(/^<|>$/g, '');
  if (!s) return null;
  const ax = s.match(/arxiv\.org\/(?:abs|pdf)\/([a-z.\-]+\/\d{7}|\d{4}\.\d{4,5})/i) ||
    s.match(/^(?:arxiv:\s*)?([a-z.\-]+\/\d{7}|\d{4}\.\d{4,5})(?:v\d+)?(?:\.pdf)?$/i) ||
    s.match(/10\.48550\/arxiv\.([a-z.\-]+\/\d{7}|\d{4}\.\d{4,5})/i);
  if (ax) return { kind: 'arxiv', id: ax[1], text: s };
  const doi = s.match(/(10\.\d{4,9}\/[^\s"<>]+)/);
  if (doi) return { kind: 'doi', id: decodeURIComponent(doi[1]).replace(/[.,;]+$/, ''), text: s };
  return { kind: 'title', id: s, text: s };
}

async function getText(url, accept) {
  const r = await fetch(url, accept ? { headers: { Accept: accept } } : {});
  if (r.status === 404) throw new Error('not found');
  if (!r.ok) throw new Error(`the database answered ${r.status}`);
  return r.text();
}
const doiURL = doi => 'https://doi.org/' + doi.split('/').map(encodeURIComponent).join('/');
const bibForDoi = doi => getText(doiURL(doi), 'application/x-bibtex');

// Add fields before the closing brace of one BibTeX entry
function addFields(bib, fields) {
  const extra = Object.entries(fields).filter(([k]) => !new RegExp(`\\b${k}\\s*=`, 'i').test(bib))
    .map(([k, v]) => `,\n  ${k} = {${v}}`).join('');
  return bib.trim().replace(/,?\s*\}\s*$/, extra + '\n}');
}

async function fetchOne(item, usePublished) {
  if (item.kind === 'doi') {
    return { bib: await bibForDoi(item.id), note: 'DOI' };
  }
  if (item.kind === 'arxiv') {
    const arxivDoi = `10.48550/arXiv.${item.id}`;
    let journal = null;
    if (usePublished) {
      try {
        const meta = JSON.parse(await getText(`https://api.datacite.org/dois/${arxivDoi}`));
        const rel = (meta.data.attributes.relatedIdentifiers || [])
          .find(r => r.relationType === 'IsVersionOf' && r.relatedIdentifierType === 'DOI' && !/^10\.48550\//.test(r.relatedIdentifier));
        if (rel) journal = rel.relatedIdentifier;
      } catch (e) { /* fall back to the arXiv record */ }
    }
    if (journal) {
      const bib = await bibForDoi(journal);
      return { bib: addFields(bib, { eprint: item.id, archivePrefix: 'arXiv' }), note: `published version (DOI ${journal})` };
    }
    const bib = await getText(`https://api.datacite.org/dois/application/x-bibtex/${arxivDoi}`);
    return { bib: addFields(bib, { eprint: item.id, archivePrefix: 'arXiv' }), note: 'arXiv preprint' };
  }
  // a title: the best match in Crossref
  const res = JSON.parse(await getText(`https://api.crossref.org/works?rows=1&select=DOI,title&query.bibliographic=${encodeURIComponent(item.id)}`));
  const top = res.message && res.message.items && res.message.items[0];
  if (!top) throw new Error('no match');
  const found = (top.title && top.title[0]) || top.DOI;
  return { bib: await bibForDoi(top.DOI), note: `best match by title: “${found}”. Please check it is the right paper.`, warn: true };
}

const decodeEntities = s => s.replace(/&(amp|lt|gt|quot|#39|apos);/g, (m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" }[e]));
const KEYS = {
  word: '[auth:required:capitalize][year:required][veryshorttitle:lower][duplicateLetter]',
  authors: '[authEtAl:required:capitalize][year:required][duplicateLetter]',
  lower: '[auth:required:lower][year:required][veryshorttitle:lower][duplicateLetter]',
};

let lastBib = '';
async function runGet() {
  const items = $('ct-ids').value.split('\n').map(parseLine).filter(Boolean);
  const list = $('ct-results');
  if (!items.length) { $('ct-get-status').textContent = 'Paste at least one DOI, arXiv number or title.'; return; }
  if (items.length > 100) { $('ct-get-status').textContent = 'Please ask for at most 100 at a time.'; return; }
  $('ct-fetch').disabled = true;
  $('ct-get-status').textContent = '';
  list.innerHTML = items.map((it, i) => `<li id="ct-r${i}"><span class="ct-badge ct-wait">…</span><span class="ct-id">${esc(it.text)}</span><span class="ct-what tl-muted">waiting</span></li>`).join('');
  $('ct-out-box').hidden = true;
  const bibs = [];
  let ok = 0;
  for (let i = 0; i < items.length; i++) {
    const row = $('ct-r' + i);
    row.querySelector('.ct-what').textContent = 'asking the database…';
    try {
      const r = await fetchOne(items[i], $('ct-published').checked);
      if (!/^\s*@/.test(r.bib)) throw new Error('no BibTeX in the answer');
      bibs.push(decodeEntities(r.bib.trim()));
      ok++;
      row.querySelector('.ct-badge').className = 'ct-badge ' + (r.warn ? 'ct-warn' : 'ct-ok');
      row.querySelector('.ct-badge').textContent = r.warn ? '?' : '✓';
      row.querySelector('.ct-what').textContent = r.note;
    } catch (e) {
      row.querySelector('.ct-badge').className = 'ct-badge ct-bad';
      row.querySelector('.ct-badge').textContent = '✗';
      row.querySelector('.ct-what').textContent = /fetch/i.test(String(e.message)) ? 'could not reach the database (check the connection)' : String(e.message || e);
    }
  }
  $('ct-fetch').disabled = false;
  if (!bibs.length) { $('ct-get-status').textContent = 'Nothing was found.'; return; }
  try {
    // first merge the same paper found twice (by DOI), then make the keys, so no key gets a stray letter
    const merged = tidy(bibs.join('\n\n'), { duplicates: ['doi'], merge: 'combine', omit: ['keywords', 'copyright', 'abstract'] }).bibtex;
    const opts = {
      curly: true, months: true, align: 14, blankLines: true, lowercase: true, escape: true,
      generateKeys: KEYS[$('ct-keys').value] || KEYS.word,
    };
    if ($('ct-protect').checked) opts.enclosingBraces = ['title'];
    lastBib = tidy(merged, opts).bibtex.trim() + '\n';
  } catch (e) {
    lastBib = bibs.join('\n\n') + '\n';   // untidied, but still usable
  }
  $('ct-out').textContent = lastBib;
  $('ct-out-box').hidden = false;
  const entries = (lastBib.match(/^@/gm) || []).length;
  $('ct-get-status').textContent = `Found ${ok} of ${items.length}` +
    (entries < ok ? `; ${ok - entries === 1 ? 'two were' : 'some were'} the same paper, so the .bib has ${plural(entries, 'entry', 'entries')}.` : '.');
}

// ================================================================ 2. Check a paper
// Files opened into a box are marked with a line "%% ==== file: name ====", so that the report
// can say "chapter2.tex, line 41".
const MARK = /^%% ==== file: (.*) ====$/;

function addFiles(box, files) {
  const reads = [...files].map(f => f.text().then(t => `%% ==== file: ${f.name} ====\n${t.replace(/\r\n?/g, '\n')}`));
  Promise.all(reads).then(parts => {
    const cur = $(box).value.trim();
    $(box).value = (cur ? cur + '\n' : '') + parts.join('\n');
  });
}

// Lines of a box, with the file and line number they came from
function located(text) {
  let file = '', line = 0;
  return text.replace(/\r\n?/g, '\n').split('\n').map(l => {
    const m = l.match(MARK);
    if (m) { file = m[1]; line = 0; return { file, line: 0, text: '' }; }
    line++;
    return { file, line, text: l };
  });
}
const where = loc => (loc.file ? `${loc.file}, line ${loc.line}` : `line ${loc.line}`);

// remove a TeX comment (an unescaped %) from a line
const uncomment = l => l.replace(/(^|[^\\])(\\\\)*%.*$/, (m, a, b) => a + (b || ''));

// The text of the lines joined together, and a function from a position in it to its line
function joined(lines, clean) {
  const parts = lines.map(l => clean(l.text));
  const starts = [];
  let pos = 0;
  parts.forEach(p => { starts.push(pos); pos += p.length + 1; });
  const lineAt = p => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= p) lo = mid; else hi = mid - 1; }
    return lines[lo];
  };
  return { src: parts.join('\n'), lineAt };
}

function scanTex(text) {
  const lines = located(text);
  // the whole text at once, so that a \cite{a,<newline>b} split over two lines is still read
  const { src, lineAt } = joined(lines, uncomment);
  const cites = [], refs = [], labels = [];
  let all = false, m;
  const CITE = /\\(?:[a-zA-Z]*cite[a-zA-Z]*|nocite)\*?\s*(?:\[[^\]]*\]\s*){0,2}\{([^}]*)\}/g;
  const REF = /\\(?:eqref|ref|cref|Cref|autoref|pageref|vref|nameref|labelcref)\*?\{([^}]*)\}/g;
  const LABEL = /\\label\{([^}]*)\}/g;
  const keysOf = s => s.split(',').map(k => k.trim()).filter(Boolean);
  while ((m = CITE.exec(src))) { const loc = lineAt(m.index); keysOf(m[1]).forEach(k => { if (k === '*') all = true; else cites.push({ key: k, loc }); }); }
  while ((m = REF.exec(src))) { const loc = lineAt(m.index); keysOf(m[1]).forEach(k => refs.push({ key: k, loc })); }
  while ((m = LABEL.exec(src))) labels.push({ key: m[1].trim(), loc: lineAt(m.index) });
  return { cites, refs, labels, all, lines: lines.filter(l => l.line).length };
}

// A small BibTeX reader: entry type, key, a few fields, and where the entry starts
function scanBib(text) {
  const lines = located(text);
  const entries = [];
  const { src, lineAt } = joined(lines, t => t);
  const AT = /@([a-zA-Z]+)\s*([{(])/g;
  let m;
  while ((m = AT.exec(src))) {
    const type = m[1].toLowerCase();
    const open = m[2], close = open === '{' ? '}' : ')';
    let i = AT.lastIndex, depth = 1;
    while (i < src.length && depth > 0) { const c = src[i]; if (c === '{' || (open === '(' && c === '(')) depth++; else if (c === '}' || (open === '(' && c === ')')) depth--; if (depth === 0 && c === close) break; i++; }
    const body = src.slice(AT.lastIndex, i);
    AT.lastIndex = i + 1;
    if (['comment', 'preamble', 'string'].includes(type)) continue;
    const key = (body.match(/^\s*([^,\s]+)\s*,/) || [])[1];
    if (!key) continue;
    entries.push({ type, key, fields: readFields(body.slice(body.indexOf(',') + 1)), loc: lineAt(m.index) });
  }
  return entries;
}
function readFields(body) {
  const fields = {};
  const NAME = /\s*([a-zA-Z][\w:.+-]*)\s*=\s*/y;
  let i = 0;
  while (i < body.length) {
    NAME.lastIndex = i;
    const m = NAME.exec(body);
    if (!m) { i++; continue; }
    i = NAME.lastIndex;
    let value = '';
    while (i < body.length && body[i] !== ',') {
      const c = body[i];
      if (c === '{') { let d = 1, j = i + 1; while (j < body.length && d) { if (body[j] === '{') d++; else if (body[j] === '}') d--; j++; } value += body.slice(i + 1, j - 1); i = j; }
      else if (c === '"') { let j = i + 1; while (j < body.length && (body[j] !== '"' || body[j - 1] === '\\')) j++; value += body.slice(i + 1, j); i = j + 1; }
      else { value += c; i++; }
    }
    fields[m[1].toLowerCase()] = value.replace(/\s+/g, ' ').trim();
    i++;
  }
  return fields;
}

const NEEDED = {
  article: [['author'], ['title'], ['journal'], ['year', 'date']],
  book: [['author', 'editor'], ['title'], ['publisher'], ['year', 'date']],
  inproceedings: [['author'], ['title'], ['booktitle'], ['year', 'date']],
  incollection: [['author'], ['title'], ['booktitle'], ['year', 'date']],
  phdthesis: [['author'], ['title'], ['school', 'institution'], ['year', 'date']],
  mastersthesis: [['author'], ['title'], ['school', 'institution'], ['year', 'date']],
  misc: [['author', 'title']],
};

function runCheck() {
  const tex = scanTex($('ct-tex').value);
  const bib = scanBib($('ct-bib').value);
  const out = [];
  if (!$('ct-tex').value.trim()) { $('ct-report').innerHTML = '<p class="tl-status">Paste or open the .tex file(s) first.</p>'; return; }
  const keys = new Map();
  bib.forEach(e => { if (!keys.has(e.key)) keys.set(e.key, []); keys.get(e.key).push(e); });
  const cited = new Set(tex.cites.map(c => c.key));
  const labelSet = new Set(tex.labels.map(l => l.key));

  const missing = tex.cites.filter(c => !keys.has(c.key));
  const missingKeys = [...new Set(missing.map(c => c.key))];
  const unused = tex.all ? [] : bib.filter(e => !cited.has(e.key));
  const dupKeys = [...keys.entries()].filter(([, list]) => list.length > 1);
  const byDoi = new Map(), byTitle = new Map();
  bib.forEach(e => {
    const doi = (e.fields.doi || '').toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
    if (doi) { if (!byDoi.has(doi)) byDoi.set(doi, []); byDoi.get(doi).push(e); }
    const t = (e.fields.title || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (t.length > 12) { if (!byTitle.has(t)) byTitle.set(t, []); byTitle.get(t).push(e); }
  });
  const sameKey = new Set(dupKeys.map(([k]) => k));
  const dupEntries = [...byDoi.values(), ...byTitle.values()].filter(l => new Set(l.map(e => e.key)).size > 1)
    .map(l => [...new Set(l.map(e => e.key))]).filter(ks => !(ks.length === 1 && sameKey.has(ks[0])));
  const seenPairs = new Set();
  const dups = dupEntries.filter(ks => { const id = ks.slice().sort().join('|'); if (seenPairs.has(id)) return false; seenPairs.add(id); return true; });
  const incomplete = bib.map(e => ({ e, lacks: (NEEDED[e.type] || []).filter(alts => !alts.some(f => e.fields[f])).map(alts => alts.join(' or ')) }))
    .filter(x => x.lacks.length);
  const undefinedRefs = tex.refs.filter(r => !labelSet.has(r.key));
  const labelCount = new Map();
  tex.labels.forEach(l => { if (!labelCount.has(l.key)) labelCount.set(l.key, []); labelCount.get(l.key).push(l); });
  const dupLabels = [...labelCount.entries()].filter(([, l]) => l.length > 1);

  const section = (title, n, kind, body, empty) =>
    `<section class="ct-sec ct-${n ? kind : 'good'}"><h3><span class="ct-badge ct-${n ? (kind === 'bad' ? 'bad' : 'warn') : 'ok'}">${n ? n : '✓'}</span> ${esc(title)}</h3>${n ? body : `<p class="tl-muted">${esc(empty)}</p>`}</section>`;
  const ul = items => `<ul class="ct-list">${items.join('')}</ul>`;

  out.push(`<p class="ct-summary">${plural(tex.cites.length, 'citation')} of ${plural(cited.size, 'key')} in ${plural(tex.lines, 'line')} of LaTeX; ${plural(bib.length, 'entry', 'entries')} in the .bib; ${plural(tex.labels.length, 'label')} and ${plural(tex.refs.length, 'reference')}.${tex.all ? ' The paper uses \\nocite{*}, so every entry counts as cited.' : ''}</p>`);
  out.push(section('Cited, but not in the .bib', missingKeys.length, 'bad', ul(missingKeys.map(k =>
    `<li><code>${esc(k)}</code> <span class="tl-muted">— ${missing.filter(c => c.key === k).slice(0, 4).map(c => esc(where(c.loc))).join('; ')}${missing.filter(c => c.key === k).length > 4 ? '; …' : ''}</span></li>`)),
    'Every citation has an entry in the .bib.'));
  out.push(section('In the .bib, but never cited', unused.length, 'warn', ul(unused.map(e =>
    `<li><code>${esc(e.key)}</code> <span class="tl-muted">— ${esc(e.fields.title || '(no title)')}</span></li>`)),
    tex.all ? 'Not checked: \\nocite{*} cites everything.' : 'Every entry of the .bib is cited.'));
  out.push(section('The same key used for two entries', dupKeys.length, 'bad', ul(dupKeys.map(([k, l]) =>
    `<li><code>${esc(k)}</code> <span class="tl-muted">— ${l.map(e => esc(where(e.loc))).join('; ')}</span></li>`)),
    'No key is used twice.'));
  out.push(section('Possibly the same paper twice (same DOI or title)', dups.length, 'warn', ul(dups.map(ks =>
    `<li>${ks.map(k => `<code>${esc(k)}</code>`).join(', ')}</li>`)), 'No two entries share a DOI or a title.'));
  out.push(section('Entries without the usual fields', incomplete.length, 'warn', ul(incomplete.map(x =>
    `<li><code>${esc(x.e.key)}</code> (@${esc(x.e.type)}) <span class="tl-muted">— no ${esc(x.lacks.join(', no '))}</span></li>`)),
    'Every entry has the usual fields for its type.'));
  out.push(section('References to labels that are not defined', undefinedRefs.length, 'bad', ul([...new Set(undefinedRefs.map(r => r.key))].map(k =>
    `<li><code>${esc(k)}</code> <span class="tl-muted">— ${undefinedRefs.filter(r => r.key === k).slice(0, 4).map(r => esc(where(r.loc))).join('; ')}</span></li>`)),
    'Every \\ref, \\eqref and \\cref points to a \\label.'));
  out.push(section('Labels defined twice', dupLabels.length, 'bad', ul(dupLabels.map(([k, l]) =>
    `<li><code>${esc(k)}</code> <span class="tl-muted">— ${l.map(x => esc(where(x.loc))).join('; ')}</span></li>`)),
    'No label is defined twice.'));
  $('ct-report').innerHTML = out.join('');
  $('ct-report').hidden = false;
}

// ---------------------------------------------------------------- start
function start() {
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  showTab(location.hash === '#check' ? 'check' : 'get');
  $('ct-fetch').addEventListener('click', runGet);
  $('ct-ids').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runGet(); } });
  $('ct-example').addEventListener('click', () => {
    $('ct-ids').value = '10.2140/agt.2023.23.4185\narXiv:2509.13008\nhttps://arxiv.org/abs/2307.11045\nA connection between cut locus, Thom space and Morse-Bott functions';
  });
  $('ct-copy').addEventListener('click', () => copy(lastBib, $('ct-copy')));
  $('ct-download').addEventListener('click', () => download(lastBib, 'references.bib', 'application/x-bibtex'));
  ['tex', 'bib'].forEach(k => {
    $(`ct-${k}-open`).addEventListener('click', () => $(`ct-${k}-file`).click());
    $(`ct-${k}-file`).addEventListener('change', e => { addFiles(`ct-${k}`, e.target.files); e.target.value = ''; });
    const box = $(`ct-${k}`);
    box.addEventListener('dragover', e => { e.preventDefault(); box.classList.add('ct-drop'); });
    box.addEventListener('dragleave', () => box.classList.remove('ct-drop'));
    box.addEventListener('drop', e => { e.preventDefault(); box.classList.remove('ct-drop'); addFiles(`ct-${k}`, e.dataTransfer.files); });
    $(`ct-${k}-clear`).addEventListener('click', () => { box.value = ''; });
  });
  $('ct-run').addEventListener('click', runCheck);
}

start();
