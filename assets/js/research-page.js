/*
 * Research page: the publication list, filters and statistics.
 * The papers come from data/publications.json. Its format, and the helpers shared with the
 * Publications page (author names, BibTeX, maths, the Copy button), are described in
 * assets/js/publications-common.js, which must be loaded before this file.
 */
(function () {
  const { esc, rich, arxivId, doiOf, authorsHtml, bibtex, typeset, copyText } = window.SitePubs;
  const THEMES = {
    geometry: 'Cut loci and Morse–Bott theory',
    algebra: 'Algebra',
    combinatorial: 'Combinatorial topology',
    intuitive: 'Intuitive geometry',
  };
  const state = { status: 'all', theme: 'all' };
  let papers = [];

  function paperHtml(p) {
    const id = arxivId(p.arxiv);
    const venue = p.journal
      ? `<span class="rs-badge pub">Published</span><em>${esc(p.journal)}</em>${p.published ? `<span>${esc(p.published)}</span>` : ''}`
      : `<span class="rs-badge pre">Preprint</span><span>${esc(p.date)}</span>`;
    const links = [];
    if (p.arxiv) links.push(`<a class="rs-act" href="${esc(p.arxiv)}" target="_blank" rel="noopener noreferrer"><i class="ai ai-arxiv"></i>${id ? 'arXiv:' + esc(id) : 'arXiv'}</a>`);
    if (p.journal_link) links.push(`<a class="rs-act" href="${esc(p.journal_link)}" target="_blank" rel="noopener noreferrer"><i class="fas fa-book-open"></i>${doiOf(p.journal_link) ? 'DOI' : 'Journal'}</a>`);
    if (p.abstract) links.push(`<button type="button" class="rs-act" data-toggle="abs-${p.n}" aria-expanded="false" aria-controls="abs-${p.n}"><i class="fas fa-align-left"></i>Abstract</button>`);
    links.push(`<button type="button" class="rs-act" data-toggle="bib-${p.n}" aria-expanded="false" aria-controls="bib-${p.n}"><i class="fas fa-quote-right"></i>BibTeX</button>`);
    return `
      <article class="rs-card rs-pub" id="paper-${p.n}">
        <div class="rs-num">[${p.n}]</div>
        <div>
          <h3 class="rs-pub-title">${rich(p.title)}</h3>
          <p class="rs-authors">${authorsHtml(p.authors)}</p>
          <p class="rs-venue">${venue}</p>
          <div class="rs-actions">${links.join('')}</div>
          ${p.abstract ? `<div class="rs-abstract" id="abs-${p.n}" hidden>${rich(p.abstract)}</div>` : ''}
          <div class="rs-bib" id="bib-${p.n}" hidden>
            <pre>${esc(bibtex(p))}</pre>
            <button type="button" class="rs-act rs-copy" data-copy="bib-${p.n}"><i class="far fa-copy"></i>Copy</button>
          </div>
        </div>
      </article>`;
  }

  function matches(p) {
    if (state.status === 'published' && !p.journal) return false;
    if (state.status === 'preprint' && p.journal) return false;
    if (state.theme !== 'all' && p.theme !== state.theme) return false;
    return true;
  }

  function renderFilters() {
    const count = f => papers.filter(f).length;
    const seg = [['all', 'All', papers.length], ['published', 'Published', count(p => p.journal)], ['preprint', 'Preprints', count(p => !p.journal)]]
      .map(([k, label, n]) => `<button type="button" data-status="${k}" aria-pressed="${state.status === k}">${label}<span>${n}</span></button>`).join('');
    const themes = [['all', 'All themes', papers.length]].concat(
      Object.entries(THEMES).map(([k, label]) => [k, label, count(p => p.theme === k)]).filter(t => t[2] > 0))
      .map(([k, label, n]) => `<button type="button" class="rs-chip" data-theme="${k}" aria-pressed="${state.theme === k}">${esc(label)}<span>${n}</span></button>`).join('');
    document.getElementById('rs-filters').innerHTML =
      `<div class="rs-seg" role="group" aria-label="Status">${seg}</div><div class="rs-chips" role="group" aria-label="Theme">${themes}</div>`;
  }

  function renderList() {
    const shown = papers.filter(matches);
    const box = document.getElementById('rs-publist');
    document.getElementById('rs-showing').textContent =
      shown.length === papers.length ? `${papers.length} papers` : `Showing ${shown.length} of ${papers.length} papers`;
    if (!shown.length) { box.innerHTML = '<div class="rs-card rs-empty">No papers match these filters.</div>'; return; }
    const years = [...new Set(shown.map(p => p.year))].sort((a, b) => b - a);
    box.innerHTML = years.map(y => {
      const list = shown.filter(p => p.year === y);
      return `<div class="rs-year"><b>${y}</b></div><div class="rs-pubs">${list.map(paperHtml).join('')}</div>`;
    }).join('');
    typeset(box);
  }

  function wire() {
    document.getElementById('rs-filters').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.status) state.status = b.dataset.status;
      if (b.dataset.theme) state.theme = b.dataset.theme;
      renderFilters(); renderList();
    });
    document.getElementById('rs-publist').addEventListener('click', e => {
      const t = e.target.closest('[data-toggle]');
      if (t) {
        const panel = document.getElementById(t.dataset.toggle);
        panel.hidden = !panel.hidden;
        t.setAttribute('aria-expanded', String(!panel.hidden));
        return;
      }
      const c = e.target.closest('[data-copy]');
      if (c) copyText(document.querySelector(`#${c.dataset.copy} pre`).textContent, c);
    });
    // "Papers on this theme" buttons in the theme cards
    document.querySelectorAll('[data-show-theme]').forEach(b => b.addEventListener('click', () => {
      state.theme = b.dataset.showTheme; state.status = 'all';
      renderFilters(); renderList();
      document.getElementById('publications').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  // Group photo at the top of the page, from data/group.json -> "groupPhoto": { "file": "...", "caption": "..." }
  function showGroupPhoto() {
    fetch('../data/group.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(g => {
        const ph = g && g.groupPhoto;
        if (!ph || !ph.file) return;
        const src = /^(https?:)?\/\/|^\//.test(ph.file) ? ph.file : '../assets/img/group/' + ph.file;
        const img = document.getElementById('rs-photo-img');
        img.src = src;
        img.alt = ph.caption || 'Research group';
        img.onload = () => { document.getElementById('rs-photo').hidden = false; };
        document.getElementById('rs-photo-cap').textContent = ph.caption || '';
      })
      .catch(() => {});
  }

  function start() {
    showGroupPhoto();
    window.SitePubs.loadPapers('../')
      .then(list => {
        papers = list;   // newest first, numbered in order of appearance (oldest = [1])
        renderFilters(); renderList(); wire();
      })
      .catch(() => {
        document.getElementById('rs-publist').innerHTML =
          '<div class="rs-card rs-empty">The publication list could not be loaded. Please refresh the page.</div>';
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
