/*
 * Searchable link directory, used by Miscellaneous > Useful links and > Qualifier exams.
 *
 * The page needs:  <div id="link-directory" data-src="links.json"></div>
 * and this script. The links live in the JSON file next to the page:
 *
 *   { "updated": "YYYY-MM-DD",
 *     "sections": [ { "id": "latex", "title": "LaTeX", "blurb": "...", "compact": false,
 *                     "groups": [ { "title": "Learn",            (optional)
 *                                   "links": [ { "title": "...", "url": "https://...", "desc": "...",
 *                                                "tag": "Free",                       (optional)
 *                                                "also": [ { "label": "...", "url": "..." } ] (optional)
 *                                              } ] } ] } ] }
 *
 * To add a link, add an entry to the right "links" list. Nothing else needs to change.
 */
(function () {
  const CSS = `
    .ld { --ld-card: #ffffff; --ld-line: #e2e8f0; --ld-text: #4b5563; --ld-strong: #111827; --ld-muted: #6b7280;
      --ld-accent: #4338ca; --ld-accent-soft: #eef2ff; --ld-free: #047857; --ld-free-soft: #ecfdf5;
      --ld-paid: #b45309; --ld-paid-soft: #fffbeb; --ld-field: #ffffff; }
    html.dark .ld { --ld-card: #1e293b; --ld-line: #334155; --ld-text: #cbd5e1; --ld-strong: #f1f5f9; --ld-muted: #94a3b8;
      --ld-accent: #a5b4fc; --ld-accent-soft: #312e81; --ld-free: #6ee7b7; --ld-free-soft: #064e3b;
      --ld-paid: #fcd34d; --ld-paid-soft: #451a03; --ld-field: #0f172a; }
    .ld { color: var(--ld-text); }
    .ld-tools { display: grid; gap: 14px; justify-items: center; margin: 8px auto 40px; max-width: 720px; }
    .ld-search { position: relative; width: 100%; }
    .ld-search svg { position: absolute; left: 14px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: var(--ld-muted); pointer-events: none; }
    .ld-search input { width: 100%; box-sizing: border-box; padding: 12px 14px 12px 42px; border: 1px solid var(--ld-line); border-radius: 10px;
      background: var(--ld-field); color: var(--ld-strong); font-size: 16px; }
    .ld-search input:focus { outline: 2px solid var(--ld-accent); outline-offset: 1px; }
    .ld-count { font-size: 13px; color: var(--ld-muted); font-variant-numeric: tabular-nums; }
    .ld-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
    .ld-chip { padding: 5px 12px; border-radius: 999px; border: 1px solid var(--ld-line); background: var(--ld-card); color: var(--ld-text);
      font-size: 13px; font-weight: 500; text-decoration: none; }
    .ld-chip:hover { border-color: var(--ld-accent); color: var(--ld-accent); }
    .ld-section { margin-top: 44px; scroll-margin-top: 90px; }
    .ld-section-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px; padding-bottom: 10px; margin-bottom: 18px; border-bottom: 1px solid var(--ld-line); }
    .ld-section-title { margin: 0; font-size: 22px; font-weight: 600; color: var(--ld-strong); }
    .ld-blurb { margin: 0; font-size: 15px; color: var(--ld-muted); }
    .ld-group + .ld-group { margin-top: 26px; }
    .ld-group-title { margin: 0 0 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ld-muted); }
    .ld-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .ld-card { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 16px 18px; border: 1px solid var(--ld-line);
      border-radius: 12px; background: var(--ld-card); transition: border-color 0.15s ease, box-shadow 0.15s ease; }
    .ld-card:hover { border-color: var(--ld-accent); box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); }
    .ld-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
    .ld-title { font-size: 16px; font-weight: 600; line-height: 1.35; color: var(--ld-strong); text-decoration: none; }
    .ld-title::after { content: ""; position: absolute; inset: 0; border-radius: 12px; }
    .ld-title:focus-visible { outline: none; }
    .ld-card:focus-within { outline: 2px solid var(--ld-accent); outline-offset: 2px; }
    .ld-domain { font-size: 12.5px; color: var(--ld-muted); overflow-wrap: anywhere; }
    .ld-desc { margin: 0; font-size: 14.5px; line-height: 1.55; }
    .ld-tag { flex: none; padding: 1px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 600; line-height: 20px; }
    .ld-tag-free { background: var(--ld-free-soft); color: var(--ld-free); }
    .ld-tag-paid, .ld-tag-subscription { background: var(--ld-paid-soft); color: var(--ld-paid); }
    .ld-also { position: relative; z-index: 1; font-size: 13.5px; font-weight: 600; color: var(--ld-accent); text-decoration: none; }
    .ld-also:hover { text-decoration: underline; }
    .ld-compact .ld-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }
    .ld-compact .ld-card { padding: 12px 16px; gap: 2px; }
    .ld-compact .ld-title { font-size: 15.5px; }
    .ld-compact .ld-desc { font-size: 14px; color: var(--ld-muted); }
    .ld-empty { margin: 40px 0; text-align: center; color: var(--ld-muted); }
    .ld-foot { margin-top: 48px; text-align: center; font-size: 13px; color: var(--ld-muted); }
    @media (prefers-reduced-motion: reduce) { .ld-card { transition: none; } }
  `;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const domain = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  const fold = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const SEARCH_ICON = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5L17 17" stroke-linecap="round"/></svg>';

  function cardHtml(l) {
    const tag = l.tag ? `<span class="ld-tag ld-tag-${esc(l.tag.toLowerCase())}">${esc(l.tag)}</span>` : '';
    const also = (l.also || []).map(a =>
      `<a class="ld-also" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(a.label)} →</a>`).join('');
    const text = fold([l.title, l.desc, l.tag || '', domain(l.url)].join(' '));
    return `<div class="ld-card" data-text="${esc(text)}">` +
      `<div class="ld-card-top"><a class="ld-title" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.title)}</a>${tag}</div>` +
      (l.desc ? `<p class="ld-desc">${esc(l.desc)}</p>` : '') +
      also +
      `<span class="ld-domain">${esc(domain(l.url))}</span></div>`;
  }

  function render(root, data) {
    const sections = data.sections || [];
    const total = sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.links.length, 0), 0);
    const chips = sections.length > 1
      ? `<nav class="ld-chips" aria-label="Sections">${sections.map(s => `<a class="ld-chip" href="#${esc(s.id)}">${esc(s.title)}</a>`).join('')}</nav>`
      : '';
    const checked = data.updated
      ? new Date(data.updated + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    root.innerHTML =
      `<div class="ld-tools">` +
      `<label class="ld-search"><span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Search links</span>${SEARCH_ICON}` +
      `<input id="ld-search" type="search" placeholder="Search ${total} links" autocomplete="off"></label>` +
      `<span class="ld-count" id="ld-count" aria-live="polite">${total} links</span>${chips}</div>` +
      sections.map(s =>
        `<section class="ld-section${s.compact ? ' ld-compact' : ''}" id="${esc(s.id)}">` +
        (sections.length > 1 || s.blurb ? `<div class="ld-section-head"><h3 class="ld-section-title">${esc(s.title)}</h3>${s.blurb ? `<p class="ld-blurb">${esc(s.blurb)}</p>` : ''}</div>` : '') +
        s.groups.map(g =>
          `<div class="ld-group">${g.title ? `<h4 class="ld-group-title">${esc(g.title)}</h4>` : ''}` +
          `<div class="ld-grid">${g.links.map(cardHtml).join('')}</div></div>`).join('') +
        `</section>`).join('') +
      `<p class="ld-empty" id="ld-empty" hidden>No links match your search.</p>` +
      (checked ? `<p class="ld-foot">All links checked on ${checked}. If one stops working, please let me know.</p>` : '');

    const input = root.querySelector('#ld-search');
    const count = root.querySelector('#ld-count');
    input.addEventListener('input', () => {
      const words = fold(input.value).split(/\s+/).filter(Boolean);
      let shown = 0;
      root.querySelectorAll('.ld-section').forEach(sec => {
        let inSection = 0;
        sec.querySelectorAll('.ld-group').forEach(g => {
          let inGroup = 0;
          g.querySelectorAll('.ld-card').forEach(c => {
            const ok = words.every(w => c.dataset.text.includes(w));
            c.hidden = !ok;
            if (ok) inGroup++;
          });
          g.hidden = inGroup === 0;
          inSection += inGroup;
        });
        sec.hidden = inSection === 0;
        shown += inSection;
      });
      count.textContent = words.length ? `${shown} of ${total} links` : `${total} links`;
      root.querySelector('#ld-empty').hidden = shown !== 0;
      const nav = root.querySelector('.ld-chips');
      if (nav) nav.hidden = words.length > 0;
    });
  }

  function start() {
    const root = document.getElementById('link-directory');
    if (!root) return;
    const style = document.createElement('style');
    style.textContent = CSS + ' .ld [hidden] { display: none !important; }';
    document.head.appendChild(style);
    root.classList.add('ld');
    fetch(root.dataset.src || 'links.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => render(root, data))
      .catch(() => { root.innerHTML = '<p class="ld-empty">The links could not be loaded. Please refresh the page.</p>'; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
