/*
 * Research page: the publication list, filters and statistics.
 * Everything comes from data/publications.json, so a new paper only needs a new entry there:
 *
 *   { "title": "...", "authors": "A. Bhowmick, Sachchidanand Prasad",
 *     "date": "Month YYYY",              when the paper first appeared (arXiv); sets its year group
 *     "theme": "geometry",               geometry | algebra | combinatorial | intuitive
 *     "arxiv": "https://arxiv.org/abs/...", "journal": "" (empty = preprint), "journal_link": "",
 *     "published": "2026",               optional: year of the journal version
 *     "abstract": "..." }
 */
(function () {
  const SELF = 'Sachchidanand Prasad';
  const THEMES = {
    geometry: 'Cut loci and Morse–Bott theory',
    algebra: 'Algebra',
    combinatorial: 'Combinatorial topology',
    intuitive: 'Intuitive geometry',
  };
  const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const state = { status: 'all', theme: 'all' };
  let papers = [];

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Titles and abstracts may contain TeX and a little HTML (<em>), written by the site owner.
  const rich = s => String(s == null ? '' : s);

  function parseDate(s) {
    const m = String(s || '').toLowerCase().match(/([a-z]+)\s+(\d{4})/);
    if (!m) { const y = String(s || '').match(/\d{4}/); return { year: y ? +y[0] : 0, month: 0 }; }
    return { year: +m[2], month: Math.max(0, MONTHS.indexOf(m[1])) };
  }
  const arxivId = url => { const m = String(url || '').match(/arxiv\.org\/abs\/([\w.\-\/]+)/i); return m ? m[1] : ''; };
  const doiOf = url => { const m = String(url || '').match(/(10\.\d{4,9}\/[^\s?#]+)/); return m ? decodeURIComponent(m[1]) : ''; };
  const splitAuthors = a => String(a || '').split(',').map(x => x.trim().replace(/\.(?=\S)/g, '. ')).filter(Boolean);

  function authorsHtml(a) {
    return splitAuthors(a).map(n => n === SELF ? `<strong>${esc(n)}</strong>` : esc(n)).join(', ');
  }

  function bibtex(p) {
    const authors = splitAuthors(p.authors);
    const last = (authors[0] || 'author').split(' ').pop().replace(/[^A-Za-z]/g, '');
    const word = (p.title.replace(/\$[^$]*\$/g, '').match(/[A-Za-z]{4,}/) || ['paper'])[0].toLowerCase();
    const year = p.published || String(p.year);
    const fields = [
      ['author', authors.map(n => { const parts = n.split(' '); const l = parts.pop(); return `${l}, ${parts.join(' ')}`; }).join(' and ')],
      ['title', `{${p.title}}`],
    ];
    if (p.journal) fields.push(['journal', p.journal]);
    if (p.journal ? p.published : true) fields.push(['year', year]);
    const doi = doiOf(p.journal_link);
    if (doi) fields.push(['doi', doi]);
    const id = arxivId(p.arxiv);
    if (id) { fields.push(['eprint', id]); fields.push(['archivePrefix', 'arXiv']); }
    if (!p.journal && !id && p.arxiv) fields.push(['url', p.arxiv]);
    const width = Math.max(...fields.map(f => f[0].length));
    const body = fields.map(([k, v]) => `  ${k.padEnd(width)} = {${v}}`).join(',\n');
    return `@${p.journal ? 'article' : 'misc'}{${last}${year}${word},\n${body}\n}`;
  }

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
    fetch('../data/publications.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        papers = data.map(p => Object.assign({}, p, parseDate(p.date)));
        // number the papers in order of appearance, oldest = [1]
        papers.sort((a, b) => (a.year - b.year) || (a.month - b.month)).forEach((p, i) => { p.n = i + 1; });
        papers.reverse();
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
