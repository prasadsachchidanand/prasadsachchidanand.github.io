/*
 * Publications page: preprints, published papers, the PhD thesis and notes, with a search box.
 *
 * Papers come from data/publications.json (the same file as the Research page, the CV and
 * the homepage, so a new paper is added once, there). The thesis and the notes come from
 * data/thesis-and-notes.json. The data format and the shared helpers (author names, BibTeX,
 * maths, the Copy button) are in assets/js/publications-common.js, loaded before this file.
 */
(function () {
  const P = window.SitePubs;
  const { esc, rich } = P;
  const ROOT = '../';
  const ARXIV_LIST = 'https://arxiv.org/a/prasad_s_4.html';
  const SCHOLAR = 'https://scholar.google.com/citations?user=i_GAF6kAAAAJ&hl=en';

  const entries = [];   // { el, text } for the search
  const $ = id => document.getElementById(id);

  // Plain lower-case text for searching: no HTML, no TeX commands, no accents
  const plain = s => String(s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}$^_\\]/g, ' ')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim();

  const link = (url, html) => `<a class="rs-act" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${html}</a>`;
  const toggle = (id, html) => `<button type="button" class="rs-act" data-toggle="${id}" aria-expanded="false" aria-controls="${id}">${html}</button>`;

  function panels(key, abstract, bib) {
    return (abstract ? `<div class="rs-abstract" id="abs-${key}" hidden>${rich(abstract)}</div>` : '') +
      `<div class="rs-bib" id="bib-${key}" hidden>
        <pre>${esc(bib)}</pre>
        <button type="button" class="rs-act rs-copy" data-copy="bib-${key}"><i class="far fa-copy"></i>Copy</button>
      </div>`;
  }

  function entryHtml(key, cover, body) {
    return `
      <article class="rs-card pb-entry" id="${key}">
        <div class="pb-cover-box">${cover ? `<img class="pb-cover" src="${esc(cover)}" alt="" loading="lazy" decoding="async">` : '<span class="pb-cover pb-blank" aria-hidden="true"><i class="fas fa-book"></i></span>'}</div>
        <div class="pb-body">${body}</div>
      </article>`;
  }

  function paperHtml(p) {
    const key = `paper-${p.n}`;
    const id = P.arxivId(p.arxiv);
    const pdf = p.pdf || P.arxivPdf(p.arxiv);
    const doi = P.doi(p);
    const cite = P.citation(p);
    const venue = p.journal
      ? `<span class="rs-badge pub">Published</span><em>${esc(p.journal)}</em>${cite ? `<span>${esc(cite)}</span>` : ''}${p.published ? `<span>(${esc(p.published)})</span>` : ''}`
      : `<span class="rs-badge pre">Preprint</span><span>${esc(p.date)}</span>`;
    const links = [];
    if (p.arxiv) links.push(link(p.arxiv, `<i class="ai ai-arxiv"></i>${id ? 'arXiv:' + esc(id) : 'arXiv'}`));
    if (pdf) links.push(link(pdf, '<i class="far fa-file-pdf"></i>PDF'));
    // the journal link is often a DOI link already; then one button is enough
    const linkDoi = P.doiOf(p.journal_link);
    if (p.journal_link) links.push(link(p.journal_link, `<i class="fas fa-book-open"></i>${linkDoi ? 'DOI' : 'Journal'}`));
    if (doi && doi !== linkDoi) links.push(link('https://doi.org/' + doi, '<i class="fas fa-link"></i>DOI'));
    if (p.abstract) links.push(toggle(`abs-${key}`, '<i class="fas fa-align-left"></i>Abstract'));
    links.push(toggle(`bib-${key}`, '<i class="fas fa-quote-right"></i>BibTeX'));
    return entryHtml(key, p.image || (p.journal ? '' : '/assets/img/arxiv.svg'), `
          <h3 class="rs-pub-title">${rich(p.title)}</h3>
          <p class="rs-authors">${P.authorsHtml(p.authors)}</p>
          <p class="rs-venue">${venue}</p>
          <div class="rs-actions">${links.join('')}</div>
          ${panels(key, p.abstract, P.bibtex(p))}`);
  }

  function thesisHtml(t) {
    const key = 'thesis';
    const id = P.arxivId(t.arxiv);
    const fields = [
      ['author', P.bibName(t.author)],
      ['title', `{${t.title}}`],
      ['school', t.institution],
      ['year', t.year],
    ];
    if (id) { fields.push(['eprint', id]); fields.push(['archivePrefix', 'arXiv']); }
    const bib = P.bibEntry('phdthesis', `${t.author.split(' ').pop()}${t.year}${P.keyWord(t.title)}`, fields);
    const links = [];
    if (t.arxiv) links.push(link(t.arxiv, `<i class="ai ai-arxiv"></i>${id ? 'arXiv:' + esc(id) : 'arXiv'}`));
    (t.files || []).forEach(f => links.push(link(f.url, `<i class="far fa-file-pdf"></i>${esc(f.label)}`)));
    if (t.abstract) links.push(toggle(`abs-${key}`, '<i class="fas fa-align-left"></i>Abstract'));
    links.push(toggle(`bib-${key}`, '<i class="fas fa-quote-right"></i>BibTeX'));
    return entryHtml(key, t.image, `
          <h3 class="rs-pub-title">${rich(t.title)}</h3>
          <p class="rs-authors">Supervisor: ${esc(t.supervisor)}</p>
          <p class="rs-venue"><span class="rs-badge pb-thesis">PhD thesis</span><em>${esc(t.institution)}</em><span>Defended ${esc(t.defended)}</span></p>
          <div class="rs-actions">${links.join('')}</div>
          ${panels(key, t.abstract, bib)}`);
  }

  function noteHtml(n, i) {
    return entryHtml(`note-${i + 1}`, n.image, `
          <h3 class="rs-pub-title">${rich(n.title)}</h3>
          <p class="rs-venue">Expository note</p>
          <div class="rs-actions">${link(n.file, '<i class="far fa-file-pdf"></i>PDF')}</div>`);
  }

  // Fill one section; entries: [{ html, text }]
  function fill(section, list) {
    const box = $(`${section}-list`);
    box.innerHTML = list.map(e => e.html).join('');
    [...box.children].forEach((el, i) => entries.push({ el, text: list[i].text, section }));
    $(section).hidden = list.length === 0;
  }

  function render(papers, extra) {
    const pre = papers.filter(p => !p.journal);   // newest first already
    const pub = papers.filter(p => p.journal)
      .sort((a, b) => (+(b.published || b.year) - +(a.published || a.year)) || (b.year - a.year) || (b.month - a.month));
    const paperText = p => plain([p.title, p.authors, p.journal, p.date, p.published, P.citation(p), P.arxivId(p.arxiv), P.doi(p), p.abstract,
      p.journal ? 'published' : 'preprint'].join(' '));
    fill('preprints', pre.map(p => ({ html: paperHtml(p), text: paperText(p) })));
    fill('published', pub.map(p => ({ html: paperHtml(p), text: paperText(p) })));
    const t = extra && extra.thesis;
    fill('thesis', t ? [{ html: thesisHtml(t), text: plain([t.title, t.supervisor, t.institution, t.year, t.defended, P.arxivId(t.arxiv), t.abstract, 'phd thesis'].join(' ')) }] : []);
    const notes = (extra && extra.notes) || [];
    fill('notes', notes.map((n, i) => ({ html: noteHtml(n, i), text: plain(n.title + ' note') })));
    P.typeset($('pb-lists'));
  }

  function applySearch() {
    const raw = $('pb-q').value.trim();
    const words = plain(raw).split(' ').filter(Boolean);
    let shown = 0;
    entries.forEach(e => { const ok = words.every(w => e.text.includes(w)); e.el.hidden = !ok; if (ok) shown++; });
    ['preprints', 'published', 'thesis', 'notes'].forEach(s => {
      $(s).hidden = !entries.some(e => e.section === s && !e.el.hidden);
    });
    // a short line only while searching
    $('pb-showing').textContent = words.length && shown ? `${shown} result${shown === 1 ? '' : 's'} for “${raw}”` : '';
    const empty = $('pb-empty');
    empty.hidden = shown > 0;
    if (!shown) empty.textContent = `Nothing matches “${raw}”. Try a word from a title, a coauthor’s name, a journal or a year.`;
    const url = new URL(location.href);
    if (raw) url.searchParams.set('q', raw); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
  }

  function wire() {
    let timer;
    const q = $('pb-q');
    q.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(applySearch, 120); });
    q.addEventListener('keydown', e => { if (e.key === 'Escape' && q.value) { q.value = ''; applySearch(); } });
    $('pb-lists').addEventListener('click', e => {
      const t = e.target.closest('[data-toggle]');
      if (t) {
        const panel = $(t.dataset.toggle);
        panel.hidden = !panel.hidden;
        t.setAttribute('aria-expanded', String(!panel.hidden));
        return;
      }
      const c = e.target.closest('[data-copy]');
      if (c) P.copyText(document.querySelector(`#${c.dataset.copy} pre`).textContent, c);
    });
  }

  function fail() {
    $('pb-empty').hidden = false;
    $('pb-empty').innerHTML = `The publication list could not be loaded. Please refresh the page.
      My papers are also listed on <a class="rs-link" href="${ARXIV_LIST}">arXiv</a> and <a class="rs-link" href="${SCHOLAR}">Google Scholar</a>.`;
    $('pb-search').hidden = true;
  }

  function start() {
    const extra = fetch(ROOT + 'data/thesis-and-notes.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null)).catch(() => null);   // the papers still show without it
    Promise.all([P.loadPapers(ROOT), extra])
      .then(([papers, more]) => {
        render(papers, more);
        wire();
        const q = new URLSearchParams(location.search).get('q');
        if (q) $('pb-q').value = q;
        applySearch();
        // links like /publications/#thesis: the target exists only now, so scroll to it again
        const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target && !target.hidden) target.scrollIntoView();
      })
      .catch(fail);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
