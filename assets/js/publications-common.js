/*
 * Shared by the Research page (assets/js/research-page.js) and the Publications page
 * (publications/publications.js): reading the paper list, author names, BibTeX, the
 * Copy button and typesetting maths.
 *
 * The papers live in data/publications.json (the homepage and the CV page read it too),
 * one entry per paper, in any order:
 *
 *   { "title": "...",                       may contain TeX ($...$) and a little HTML (<em>)
 *     "authors": "A. Bhowmick, Sachchidanand Prasad",
 *     "date": "Month YYYY",                 when the paper first appeared (arXiv)
 *     "theme": "geometry",                  geometry | algebra | combinatorial | intuitive
 *     "arxiv": "https://arxiv.org/abs/...",
 *     "journal": "",                        empty = preprint
 *     "journal_link": "",
 *     "published": "2026",                  optional: year of the journal version
 *     "volume": "36", "issue": "117", "pages": "1-46",    optional, published papers
 *     "doi": "10.1007/...",                 optional
 *     "pdf": "https://...",                 optional: a PDF that is not on arXiv
 *     "image": "/assets/img/JGA.jpg",       optional: journal cover (Publications page)
 *     "abstract": "..." }
 *
 * The PhD thesis and the notes are in data/thesis-and-notes.json (Publications page only).
 */
window.SitePubs = (function () {
  const SELF = 'Sachchidanand Prasad';
  const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Titles and abstracts may contain TeX and a little HTML (<em>), written by the site owner.
  const rich = s => String(s == null ? '' : s);

  function parseDate(s) {
    const m = String(s || '').toLowerCase().match(/([a-z]+)\s+(\d{4})/);
    if (!m) { const y = String(s || '').match(/\d{4}/); return { year: y ? +y[0] : 0, month: 0 }; }
    return { year: +m[2], month: Math.max(0, MONTHS.indexOf(m[1])) };
  }
  const arxivId = url => { const m = String(url || '').match(/arxiv\.org\/abs\/([\w.\-\/]+)/i); return m ? m[1] : ''; };
  const arxivPdf = url => { const id = arxivId(url); return id ? 'https://arxiv.org/pdf/' + id : ''; };
  const doiOf = url => { const m = String(url || '').match(/(10\.\d{4,9}\/[^\s?#]+)/); return m ? decodeURIComponent(m[1]) : ''; };
  const doi = p => p.doi || doiOf(p.journal_link);
  const splitAuthors = a => String(a || '').split(',').map(x => x.trim().replace(/\.(?=\S)/g, '. ')).filter(Boolean);
  const dash = s => String(s || '').replace(/\s*-+\s*/g, '–');   // page ranges: 1-16 -> 1–16

  function authorsHtml(a) {
    return splitAuthors(a).map(n => n === SELF ? `<strong>${esc(n)}</strong>` : esc(n)).join(', ');
  }

  // "Vol. 557, no. 2, pp. 1–16" (empty when none of these is known)
  function citation(p) {
    const parts = [];
    if (p.volume) parts.push(`Vol. ${p.volume}`);
    if (p.issue) parts.push(`no. ${p.issue}`);
    if (p.pages) parts.push(`pp. ${dash(p.pages)}`);
    return parts.join(', ');
  }

  // One BibTeX entry with aligned fields
  function bibEntry(type, key, fields) {
    const width = Math.max(...fields.map(f => f[0].length));
    const body = fields.map(([k, v]) => `  ${k.padEnd(width)} = {${v}}`).join(',\n');
    return `@${type}{${key},\n${body}\n}`;
  }
  const bibName = n => { const parts = n.split(' '); const last = parts.pop(); return `${last}, ${parts.join(' ')}`; };
  const keyWord = title => (String(title).replace(/\$[^$]*\$/g, '').match(/[A-Za-z]{4,}/) || ['paper'])[0].toLowerCase();

  // p needs .year (from parseDate) as well as the fields of data/publications.json
  function bibtex(p) {
    const authors = splitAuthors(p.authors);
    const last = (authors[0] || 'author').split(' ').pop().replace(/[^A-Za-z]/g, '');
    const year = p.published || String(p.year);
    const fields = [
      ['author', authors.map(bibName).join(' and ')],
      ['title', `{${p.title}}`],
    ];
    if (p.journal) {
      fields.push(['journal', p.journal]);
      if (p.volume) fields.push(['volume', p.volume]);
      if (p.issue) fields.push(['number', p.issue]);
      if (p.pages) fields.push(['pages', String(p.pages).replace(/\s*-+\s*/g, '--')]);
    }
    if (p.journal ? p.published : true) fields.push(['year', year]);
    if (doi(p)) fields.push(['doi', doi(p)]);
    const id = arxivId(p.arxiv);
    if (id) { fields.push(['eprint', id]); fields.push(['archivePrefix', 'arXiv']); }
    if (!p.journal && !id && p.arxiv) fields.push(['url', p.arxiv]);
    return bibEntry(p.journal ? 'article' : 'misc', `${last}${year}${keyWord(p.title)}`, fields);
  }

  function typeset(el) {
    const mj = window.MathJax;
    if (mj && mj.startup && mj.startup.promise && mj.typesetPromise) {
      mj.startup.promise.then(() => mj.typesetPromise([el])).catch(() => {});
    }
  }

  function copyText(text, button) {
    const done = () => { const old = button.innerHTML; button.innerHTML = '<i class="fas fa-check"></i>Copied'; setTimeout(() => { button.innerHTML = old; }, 1600); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallback());
    } else fallback();
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* the text stays visible to copy by hand */ }
      ta.remove();
    }
  }

  // Papers with .year/.month (first appearance) and .n (oldest = 1), newest first.
  // root: path from the page to the site root, e.g. '../'
  function loadPapers(root) {
    return fetch(root + 'data/publications.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        const papers = data.map(p => Object.assign({}, p, parseDate(p.date)));
        papers.sort((a, b) => (a.year - b.year) || (a.month - b.month)).forEach((p, i) => { p.n = i + 1; });
        return papers.reverse();
      });
  }

  return { SELF, esc, rich, parseDate, arxivId, arxivPdf, doiOf, doi, splitAuthors, dash, authorsHtml, citation, bibEntry, bibName, keyWord, bibtex, typeset, copyText, loadPapers };
})();
