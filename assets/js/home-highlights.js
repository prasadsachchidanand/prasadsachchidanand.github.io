/*
 * "Latest" section on the homepage: recent publications, current teaching and news.
 *
 * Everything is read from the site's own data files, so the homepage updates
 * by itself whenever those files change:
 *   data/publications.json      newest first (also used by the Research/Publications pages)
 *   teaching/courses-data.json  courses with "status": "ongoing" are shown as current
 *   data/news.json              {"date": "YYYY-MM-DD", "end": "YYYY-MM-DD" (optional), "text": "..."};
 *                               upcoming events first (soonest first), then past news; four are shown
 *
 * The page needs <section id="home-highlights"></section> and this script.
 */
(function () {
  const PUBLICATIONS_SHOWN = 3;
  const NEWS_SHOWN = 4;
  const MY_NAME = 'Sachchidanand Prasad';

  const CSS = `
    #home-highlights { --hh-card: #ffffff; --hh-line: #e5e7eb; --hh-text: #4b5563; --hh-strong: #111827;
      --hh-muted: #6b7280; --hh-link: #3730a3; --hh-accent: #6366f1; --hh-chip: #eef2ff; --hh-chip-text: #3730a3;
      margin-top: 64px; }
    html.dark #home-highlights { --hh-card: #1e293b; --hh-line: #334155; --hh-text: #cbd5e1; --hh-strong: #f1f5f9;
      --hh-muted: #94a3b8; --hh-link: #a5b4fc; --hh-accent: #818cf8; --hh-chip: #312e81; --hh-chip-text: #e0e7ff; }
    .hh-title { text-align: center; font-size: 30px; font-weight: 500; color: var(--hh-strong); margin: 0; }
    .hh-rule { width: 96px; height: 4px; border-radius: 4px; background: var(--hh-accent); margin: 8px auto 32px; }
    .hh-grid { display: grid; gap: 24px; align-items: start; }
    @media (min-width: 1024px) { .hh-grid { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); } }
    .hh-side { display: grid; gap: 24px; align-content: start; }
    .hh-card { background: var(--hh-card); border: 1px solid var(--hh-line); border-radius: 12px; padding: 24px; color: var(--hh-text); }
    .hh-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
    .hh-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--hh-strong); margin: 0; }
    .hh-all { font-size: 14px; font-weight: 500; color: var(--hh-link); text-decoration: none; white-space: nowrap; }
    .hh-all:hover { text-decoration: underline; }
    .hh-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 18px; }
    .hh-list > li + li { border-top: 1px solid var(--hh-line); padding-top: 18px; }
    .hh-pub-title { font-size: 17px; font-weight: 600; line-height: 1.4; color: var(--hh-strong); text-decoration: none; }
    a.hh-pub-title:hover { color: var(--hh-link); }
    .hh-authors { margin: 4px 0 0; font-size: 15px; }
    .hh-authors strong { font-weight: 600; color: var(--hh-strong); }
    .hh-meta { margin: 6px 0 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; font-size: 14px; color: var(--hh-muted); }
    .hh-chip { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; background: var(--hh-chip); color: var(--hh-chip-text); }
    .hh-meta a { color: var(--hh-link); text-decoration: none; }
    .hh-meta a:hover { text-decoration: underline; }
    .hh-course { display: block; text-decoration: none; color: inherit; }
    .hh-course-title { font-size: 17px; font-weight: 600; color: var(--hh-strong); }
    a.hh-course:hover .hh-course-title { color: var(--hh-link); }
    .hh-course-meta { margin: 4px 0 0; font-size: 14px; color: var(--hh-muted); }
    .hh-date { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--hh-muted); font-variant-numeric: tabular-nums; }
    .hh-news-text { margin: 2px 0 0; font-size: 15px; line-height: 1.55; }
    .hh-news-text a { color: var(--hh-link) !important; }
    .hh-empty { margin: 0; font-size: 15px; color: var(--hh-muted); }
  `;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // The homepage has no MathJax, so turn simple TeX in titles ($C^2$, $\mathbb{R}^n$) into HTML.
  const SYMBOLS = { '\\mathbb{R}': 'ℝ', '\\mathbb{C}': 'ℂ', '\\mathbb{Z}': 'ℤ', '\\mathbb{Q}': 'ℚ', '\\mathbb{N}': 'ℕ',
    '\\infty': '∞', '\\times': '×', '\\le': '≤', '\\ge': '≥', '\\pi': 'π' };
  function tex(s) {
    return esc(s).replace(/\$([^$]+)\$/g, (_, m) => {
      for (const [k, v] of Object.entries(SYMBOLS)) m = m.split(k).join(v);
      m = m.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>').replace(/\^(\S)/g, '<sup>$1</sup>')
           .replace(/_\{([^}]*)\}/g, '<sub>$1</sub>').replace(/_(\S)/g, '<sub>$1</sub>')
           .replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '');
      return '<em>' + m + '</em>';
    });
  }

  function authors(list) {
    return esc(list).replace(MY_NAME, `<strong>${MY_NAME}</strong>`);
  }

  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? esc(iso) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function card(title, allHref, allLabel, body) {
    const all = allHref ? `<a class="hh-all" href="${allHref}">${allLabel} →</a>` : '';
    return `<div class="hh-card"><div class="hh-head"><h3 class="hh-eyebrow">${title}</h3>${all}</div>${body}</div>`;
  }

  function publicationsHtml(pubs) {
    if (!pubs.length) return '<p class="hh-empty">No publications listed yet.</p>';
    return '<ul class="hh-list">' + pubs.slice(0, PUBLICATIONS_SHOWN).map(p => {
      const link = p.journal_link || p.arxiv || '';
      const title = link
        ? `<a class="hh-pub-title" href="${esc(link)}" target="_blank" rel="noopener noreferrer">${tex(p.title)}</a>`
        : `<span class="hh-pub-title">${tex(p.title)}</span>`;
      const venue = p.journal ? `<span>${esc(p.journal)}</span>` : '<span class="hh-chip">Preprint</span>';
      const arxiv = p.arxiv ? `<a href="${esc(p.arxiv)}" target="_blank" rel="noopener noreferrer">arXiv</a>` : '';
      return `<li>${title}<p class="hh-authors">${authors(p.authors || '')}</p>` +
        `<p class="hh-meta">${venue}<span>${esc(p.date || '')}</span>${arxiv}</p></li>`;
    }).join('') + '</ul>';
  }

  function teachingHtml(courses) {
    const now = courses.filter(c => c.status === 'ongoing');
    const shown = now.length ? now : courses.slice(0, 1);
    if (!shown.length) return '<p class="hh-empty">No courses listed yet.</p>';
    const label = now.length ? '' : '<p class="hh-empty" style="margin-bottom:8px">Most recent course</p>';
    return label + '<ul class="hh-list">' + shown.map(c =>
      `<li><a class="hh-course" href="teaching/${esc(c.url || '')}"><span class="hh-course-title">${esc(c.title)}</span>` +
      `<p class="hh-course-meta">${esc([c.code, c.semester].filter(Boolean).join(' · '))}</p></a></li>`
    ).join('') + '</ul>';
  }

  // "3–6 Dec 2026", "4 Feb – 14 Mar 2027", or a single date.
  function formatRange(start, end) {
    const a = new Date(start + 'T00:00:00'), b = end ? new Date(end + 'T00:00:00') : null;
    if (isNaN(a)) return esc(start);
    if (!b || isNaN(b) || +a === +b) return formatDate(start);
    const mon = d => d.toLocaleDateString('en-GB', { month: 'short' });
    if (a.getFullYear() !== b.getFullYear()) return `${formatDate(start)} – ${formatDate(end)}`;
    if (a.getMonth() !== b.getMonth()) return `${a.getDate()} ${mon(a)} – ${b.getDate()} ${mon(b)} ${b.getFullYear()}`;
    return `${a.getDate()}–${b.getDate()} ${mon(b)} ${b.getFullYear()}`;
  }

  // Upcoming and current events first (soonest first), then past news (newest first).
  function newsHtml(news) {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const ends = n => String(n.end || n.date);
    const coming = news.filter(n => ends(n) >= today).sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const past = news.filter(n => ends(n) < today).sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const items = coming.concat(past).slice(0, NEWS_SHOWN);
    if (!items.length) return '<p class="hh-empty">No news yet.</p>';
    // News text is written by the site owner and may contain links, so it is used as HTML.
    return '<ul class="hh-list">' + items.map(n => {
      const tag = ends(n) < today ? '' : (String(n.date) <= today ? '<span class="hh-chip">Now</span>' : '<span class="hh-chip">Upcoming</span>');
      return `<li><span class="hh-date">${formatRange(n.date, n.end)}${tag}</span><p class="hh-news-text">${n.text}</p></li>`;
    }).join('') + '</ul>';
  }

  async function load(url) {
    try {
      const r = await fetch(url, { cache: 'no-cache' });
      return r.ok ? await r.json() : null;
    } catch (e) { return null; }
  }

  async function render() {
    const root = document.getElementById('home-highlights');
    if (!root) return;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const [pubs, courses, news] = await Promise.all([
      load('data/publications.json'), load('teaching/courses-data.json'), load('data/news.json')]);

    root.innerHTML = `<h2 class="hh-title">Latest</h2><div class="hh-rule"></div><div class="hh-grid">` +
      card('Recent publications', 'publications/', 'All publications', publicationsHtml(Array.isArray(pubs) ? pubs : [])) +
      `<div class="hh-side">` +
      card('Teaching now', 'teaching/', 'All courses', teachingHtml(courses && Array.isArray(courses.courses) ? courses.courses : [])) +
      card('News', '', '', newsHtml(Array.isArray(news) ? news : [])) +
      `</div></div>`;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
