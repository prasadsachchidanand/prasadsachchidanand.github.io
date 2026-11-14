/*
 * Shared header (menu) and footer for every page of the site.
 *
 * Edit the menu or the footer HERE ONLY; every page shows the change.
 *
 * How a page uses it:
 *   1. In <head> (normal script, not async/defer), with the path to this file
 *      from that page, e.g. for a page two folders deep:
 *        <script src="../../assets/js/site-layout.js"></script>
 *   2. In <body>, where the menu and the footer should go:
 *        <site-header></site-header>      (add active="none" for no highlighted item)
 *        ...page content...
 *        <site-footer></site-footer>
 *
 * Because the script is loaded in <head>, both are filled in while the page is
 * being read, so they appear immediately and page scripts can use #year/#updated.
 *
 * Look: indigo header bar (name on the left, menu on the right) and an indigo
 * footer with a link to today's daily problem. Colours are in LAYOUT_CSS below.
 */
(function () {
  // Menu entries, in order. `path` is relative to the site root.
  const NAV_LINKS = [
    { label: 'Home', path: '' },
    { label: 'Research', path: 'research/' },
    { label: 'Teaching', path: 'teaching/', menu: 'teaching' },
    { label: 'CV', path: 'resume/' },
    { label: 'Publications', path: 'publications/' },
    { label: 'Miscellaneous', path: 'miscellaneous/', menu: 'misc' },
    { label: 'Contact', path: 'contact/' },
  ];

  // Dropdown under "Miscellaneous": [label, path]. Pages not listed here are
  // still reachable from the Miscellaneous page itself.
  const MISC_MENU = [
    ['Daily problems', 'miscellaneous/daily-problems/'],
    ['Book solutions', 'miscellaneous/books/'],
    ['Problems by topic', 'miscellaneous/daily-problems/tags/'],
    ['Qualifier exams', 'miscellaneous/qualifier-exams/'],
    ['Quiz', 'miscellaneous/quiz/rules/'],
    ['Useful links', 'miscellaneous/useful-links/'],
  ];
  // The dropdown under "Teaching" is filled from teaching/courses-data.json:
  // courses with "status": "ongoing" first, then the rest in file order.

  // Footer icons: [label, url, icon classes]
  const SOCIAL_LINKS = [
    ['Facebook', 'https://www.facebook.com/sachchidanand.prasad/', 'fa-brands fa-facebook-f'],
    ['Instagram', 'https://www.instagram.com/sachchidanand1729/', 'fa-brands fa-instagram'],
    ['Twitter', 'https://twitter.com/speinstene26', 'fa-brands fa-twitter'],
    ['GitHub', 'https://github.com/prasadsachchidanand', 'fa-brands fa-github'],
    ['ResearchGate', 'https://www.researchgate.net/profile/Sachchidanand-Prasad-2', 'ai ai-researchgate ai-lg'],
    ['Academia.edu', 'https://nitrkl.academia.edu/SachchidanandPrasad', 'ai ai-academia'],
  ];

  // ---- Light / dark mode ----------------------------------------------
  // By default the site follows the device's light/dark setting (and changes
  // with it). Clicking the sun/moon button overrides that in this browser;
  // clicking back to the device's setting returns to following the device.
  // Applied here, while the page is still loading, so it never flashes in
  // the wrong colours.
  const THEME_KEY = 'theme';
  const systemDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function savedTheme() {
    try {
      const t = localStorage.getItem(THEME_KEY);
      return t === 'dark' || t === 'light' ? t : null;
    } catch (e) { return null; }
  }
  function systemTheme() {
    return systemDark && systemDark.matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
  applyTheme(savedTheme() || systemTheme());
  if (systemDark) {
    const follow = () => { if (!savedTheme()) applyTheme(systemTheme()); };
    if (systemDark.addEventListener) systemDark.addEventListener('change', follow);
    else if (systemDark.addListener) systemDark.addListener(follow);
  }

  const MOON = '<svg class="theme-icon-moon w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>';
  const SUN = '<svg class="theme-icon-sun w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>';
  function themeButton(extra) {
    return `<button type="button" class="sl-icon-btn site-theme-button ${extra}" aria-label="Switch between light and dark mode" title="Light / dark mode">${MOON}${SUN}</button>`;
  }

  const VISITOR_COUNTER =
    'https://counter.digits.net/?counter={ecc0f233-f3f7-d324-95c8-cc741ed787df}&COUNTER_TEMPLATE1&background=FFFFFF&foreground=8D8D8D';

  // The site root is worked out from this script's own address, so links work
  // on GitHub Pages, on a local server and when a file is opened directly.
  const scriptSrc = document.currentScript ? document.currentScript.src : '/assets/js/site-layout.js';
  const ROOT = scriptSrc.replace(/assets\/js\/site-layout\.js(\?.*)?$/, '');

  // ---- Styles -------------------------------------------------------------
  // The header keeps the original sizes (60px tall, 68px on phones), so the
  // space every page leaves for it still fits.
  const LAYOUT_CSS = `
    site-header, site-footer { display: contents; }
    html.dark .theme-icon-moon, html:not(.dark) .theme-icon-sun { display: none; }

    html {
      --sl-band: #312e81; --sl-band-2: #3730a3; --sl-text: #eef2ff; --sl-muted: #c7d2fe;
      --sl-mark: #a5b4fc; --sl-line: rgba(255, 255, 255, 0.16);
      --sl-hover: rgba(255, 255, 255, 0.10); --sl-active: rgba(255, 255, 255, 0.18);
      --sl-panel: #ffffff; --sl-panel-text: #111827; --sl-panel-muted: #6b7280; --sl-panel-line: #e5e7eb;
      --sl-panel-hover: #eef2ff; --sl-panel-accent: #4338ca;
    }
    html.dark {
      --sl-band: #1e1b4b; --sl-band-2: #29266a; --sl-text: #e0e7ff; --sl-muted: #a5b4fc;
      --sl-mark: #818cf8; --sl-line: rgba(255, 255, 255, 0.10);
      --sl-hover: rgba(255, 255, 255, 0.07); --sl-active: rgba(255, 255, 255, 0.13);
      --sl-panel: #1e293b; --sl-panel-text: #f1f5f9; --sl-panel-muted: #94a3b8; --sl-panel-line: #334155;
      --sl-panel-hover: #273449; --sl-panel-accent: #a5b4fc;
    }

    .sl-inner { max-width: 1280px; margin: 0 auto; padding-left: 16px; padding-right: 16px; }
    @media (min-width: 768px) { .sl-inner { padding-left: 24px; padding-right: 24px; } }
    @media (min-width: 1024px) { .sl-inner { padding-left: 32px; padding-right: 32px; } }

    .sl-header { position: fixed; top: 0; left: 0; right: 0; z-index: 10; background: var(--sl-band); color: var(--sl-text); box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2); }
    .sl-bar { display: flex; flex-direction: column; }
    .sl-brand-row { display: flex; align-items: center; justify-content: space-between; padding: 16px; }
    .sl-brand { font-size: 18px; line-height: 28px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #ffffff; text-decoration: none; white-space: nowrap; }
    @media (max-width: 420px) { .sl-brand { font-size: 15px; letter-spacing: 0.07em; } }
    .sl-mobile { display: flex; align-items: center; gap: 8px; }
    .sl-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 0; border-radius: 8px; background: transparent; color: var(--sl-muted); cursor: pointer; }
    .sl-icon-btn:hover { color: #ffffff; background: var(--sl-hover); }
    .sl-icon-btn svg { width: 20px; height: 20px; }
    .sl-burger svg { width: 24px; height: 24px; }
    .sl-menu { display: none; flex-direction: column; padding-bottom: 16px; }
    .sl-menu.sl-open { display: flex; }
    .sl-menu.sl-open { max-height: calc(100vh - 68px); overflow-y: auto; }
    .sl-nav-link { margin-top: 8px; padding: 8px 16px; border-radius: 8px; font-size: 14px; line-height: 20px; font-weight: 600; color: var(--sl-muted); text-decoration: none; }
    .sl-nav-link:hover { color: #ffffff; background: var(--sl-hover); }
    .sl-nav-link[aria-current="page"] { color: #ffffff; background: var(--sl-active); }
    .sl-menu .sl-icon-btn { display: none; }

    /* Dropdowns (Teaching, Miscellaneous). Phones: the list opens inside the menu. */
    .sl-dd { display: flex; flex-wrap: wrap; align-items: center; margin-top: 8px; border-radius: 8px; }
    .sl-dd > .sl-nav-link { margin-top: 0; flex: 1; }
    .sl-caret { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 0; border-radius: 8px; background: transparent; color: var(--sl-muted); cursor: pointer; }
    .sl-caret:hover { color: #ffffff; background: var(--sl-hover); }
    .sl-caret svg { width: 16px; height: 16px; }
    .sl-caret[aria-expanded="true"] svg { transform: rotate(180deg); }
    .sl-panel { display: none; width: 100%; margin: 4px 0 4px 16px; padding-left: 8px; border-left: 2px solid var(--sl-line); }
    .sl-panel.sl-show { display: block; }
    .sl-item { display: block; padding: 7px 12px; border-radius: 6px; text-decoration: none; color: var(--sl-muted); font-size: 14px; line-height: 20px; }
    .sl-item:hover { color: #ffffff; background: var(--sl-hover); }
    .sl-item-title { font-weight: 600; }
    .sl-sub { display: block; font-size: 12.5px; opacity: 0.8; }
    .sl-item[aria-current="page"] .sl-item-title { color: #ffffff; }
    .sl-now { display: inline-block; margin-left: 8px; padding: 0 7px; border-radius: 999px; font-size: 11px; font-weight: 600; line-height: 18px; background: var(--sl-active); color: #ffffff; vertical-align: 1px; }
    .sl-panel-foot { margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--sl-line); }
    .sl-all { font-weight: 600; color: var(--sl-text); }
    .sl-loading { padding: 7px 12px; font-size: 13px; opacity: 0.8; }
    .sl-header a:focus-visible, .sl-header button:focus-visible, .sl-footer a:focus-visible { outline: 2px solid var(--sl-mark); outline-offset: 2px; }
    @media (min-width: 1024px) {
      .sl-bar { flex-direction: row; align-items: center; justify-content: space-between; }
      .sl-mobile { display: none; }
      .sl-menu, .sl-menu.sl-open { display: flex; flex-direction: row; align-items: center; justify-content: flex-end; gap: 16px; padding-bottom: 0; max-height: none; overflow: visible; }
      .sl-nav-link { margin-top: 0; }
      .sl-menu .sl-icon-btn { display: inline-flex; }

      /* Desktop dropdowns: the link and its arrow form one pill; the list is a card below it */
      .sl-dd { position: relative; flex-wrap: nowrap; margin-top: 0; }
      .sl-dd > .sl-nav-link { flex: none; padding-right: 4px; }
      .sl-dd.sl-current { background: var(--sl-active); }
      .sl-dd.sl-current > .sl-nav-link { background: transparent; }
      .sl-dd:hover:not(.sl-current) { background: var(--sl-hover); }
      .sl-dd:hover > .sl-nav-link, .sl-dd:hover > .sl-caret { background: transparent; }
      .sl-caret { width: 26px; height: 36px; margin-right: 2px; }
      .sl-panel { position: absolute; top: calc(100% + 12px); left: 0; z-index: 30; width: max-content; min-width: 240px; max-width: 340px;
        margin: 0; padding: 6px; border: 1px solid var(--sl-panel-line); border-radius: 10px;
        background: var(--sl-panel); box-shadow: 0 14px 32px rgba(15, 23, 42, 0.20); }
      .sl-panel.sl-right { left: auto; right: 0; }
      .sl-panel::before { content: ""; position: absolute; left: 0; right: 0; top: -14px; height: 14px; }
      .sl-item { color: var(--sl-panel-text); }
      .sl-item:hover { color: var(--sl-panel-text); background: var(--sl-panel-hover); }
      .sl-sub { color: var(--sl-panel-muted); opacity: 1; }
      .sl-item[aria-current="page"] .sl-item-title { color: var(--sl-panel-accent); }
      .sl-now { background: var(--sl-panel-hover); color: var(--sl-panel-accent); }
      .sl-panel-foot { border-top-color: var(--sl-panel-line); }
      .sl-all { color: var(--sl-panel-accent); }
      .sl-loading { color: var(--sl-panel-muted); }
    }
    @media (min-width: 1024px) and (max-width: 1100px) {
      .sl-menu, .sl-menu.sl-open { gap: 4px; }
      .sl-nav-link { padding: 8px 10px; }
      .sl-dd > .sl-nav-link { padding-right: 2px; }
      .sl-caret { width: 22px; }
    }

    .sl-footer { background: var(--sl-band); color: var(--sl-muted); font-size: 14px; line-height: 1.6; }
    .sl-footer a { color: var(--sl-muted); text-decoration: none; }
    .sl-footer a:hover { color: var(--sl-text); }
    .sl-strip { background: var(--sl-band-2); }
    .sl-strip-row { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 24px; padding-top: 14px; padding-bottom: 14px; }
    .sl-today { display: inline-flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px; }
    .sl-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sl-muted); }
    .sl-footer .sl-today-title { font-size: 16px; font-weight: 600; color: var(--sl-text); }
    .sl-count { font-size: 13px; font-variant-numeric: tabular-nums; }
    .sl-cols { display: grid; gap: 32px; padding-top: 40px; padding-bottom: 40px; }
    @media (min-width: 640px) { .sl-cols { grid-template-columns: 1fr 1fr; } .sl-about { grid-column: span 2; } }
    @media (min-width: 1024px) { .sl-cols { grid-template-columns: 2fr 1fr 1fr; } .sl-about { grid-column: auto; } }
    .sl-about { display: grid; gap: 6px; align-content: start; min-width: 0; }
    .sl-footer .sl-fname { font-size: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sl-text); }
    .sl-pos { color: var(--sl-text); margin-bottom: 8px; }
    .sl-line { display: flex; gap: 10px; align-items: baseline; }
    .sl-line i { width: 14px; flex: none; text-align: center; opacity: 0.75; }
    .sl-h { margin: 0 0 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sl-text); }
    .sl-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    .sl-icons { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-top: 20px; font-size: 16px; }
    .sl-base { border-top: 1px solid var(--sl-line); font-size: 12.5px; }
    .sl-base-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 24px; padding-top: 14px; padding-bottom: 14px; }
    .sl-visitors { display: inline-flex; align-items: center; gap: 8px; }
    .sl-footer .site-counter { width: 44px; border-radius: 3px; }
  `;
  const style = document.createElement('style');
  style.textContent = LAYOUT_CSS;
  document.head.appendChild(style);

  function currentSection() {
    const here = location.href.split(/[?#]/)[0].replace(/index\.html$/, '');
    let best = NAV_LINKS[0];
    for (const link of NAV_LINKS) {
      if (link.path && here.startsWith(ROOT + link.path)) best = link;
    }
    return here === ROOT || best.path ? best : null;
  }

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const HERE = location.href.split(/[?#]/)[0].replace(/index\.html$/, '');
  const CHEVRON = '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>';

  // The menu entry whose path is the longest match for this page gets aria-current.
  function itemsHtml(items) {
    let best = null;
    items.forEach(it => { if (HERE.startsWith(ROOT + it.path) && (!best || it.path.length > best.path.length)) best = it; });
    return items.map(it =>
      `<a class="sl-item" href="${ROOT}${it.path}"${it === best ? ' aria-current="page"' : ''}>` +
      `<span class="sl-item-title">${esc(it.title)}</span>${it.now ? '<span class="sl-now">Now</span>' : ''}` +
      `${it.sub ? `<span class="sl-sub">${esc(it.sub)}</span>` : ''}</a>`
    ).join('');
  }

  function panelHtml(link) {
    const id = 'sl-dd-' + link.menu;
    const list = link.menu === 'misc'
      ? itemsHtml(MISC_MENU.map(([title, path]) => ({ title, path })))
      : '<div class="sl-loading">Loading courses…</div>';
    const all = link.menu === 'misc' ? 'All of Miscellaneous' : 'All courses';
    return `<div class="sl-panel${link.menu === 'misc' ? ' sl-right' : ''}" id="${id}">` +
      `<div class="sl-panel-list">${list}</div>` +
      `<div class="sl-panel-foot"><a class="sl-item sl-all" href="${ROOT}${link.path}">${all} →</a></div></div>`;
  }

  // Teaching courses are read once per page, the first time they are needed.
  let coursesRequest = null;
  function fillTeaching(header) {
    const box = header.querySelector('#sl-dd-teaching .sl-panel-list');
    if (!box) return;
    if (!coursesRequest) {
      coursesRequest = fetch(ROOT + 'teaching/courses-data.json')
        .then(r => (r.ok ? r.json() : null)).catch(() => null);
    }
    coursesRequest.then(data => {
      const all = data && Array.isArray(data.courses) ? data.courses : [];
      const courses = all.filter(c => c.status === 'ongoing').concat(all.filter(c => c.status !== 'ongoing'));
      box.innerHTML = courses.length ? itemsHtml(courses.map(c => ({
        title: c.title,
        path: 'teaching/' + (c.url || ''),
        sub: [c.code, c.semester].filter(Boolean).join(' · '),
        now: c.status === 'ongoing',
      }))) : '';
    });
  }

  // <site-header active="none"> turns the highlight off (used on the 404 page);
  // <site-header active="CV"> forces a menu item to be highlighted.
  function headerHtml(activeLabel) {
    const active = activeLabel
      ? NAV_LINKS.find(link => link.label === activeLabel) || null
      : currentSection();
    const links = NAV_LINKS.map(link => {
      const a = `<a class="sl-nav-link" href="${ROOT}${link.path}"${link === active ? ' aria-current="page"' : ''}>${link.label}</a>`;
      if (!link.menu) return a;
      return `<div class="sl-dd${link === active ? ' sl-current' : ''}" data-menu="${link.menu}">${a}` +
        `<button type="button" class="sl-caret" aria-expanded="false" aria-controls="sl-dd-${link.menu}" aria-label="Show ${link.label} pages">${CHEVRON}</button>` +
        `${panelHtml(link)}</div>`;
    }).join('');

    return `
    <header class="sl-header">
      <div class="sl-inner sl-bar">
        <div class="sl-brand-row">
          <a href="${ROOT}" class="sl-brand">Sachchidanand Prasad</a>
          <div class="sl-mobile">
            ${themeButton('')}
            <button type="button" class="sl-icon-btn sl-burger site-menu-button" aria-label="Toggle navigation menu" aria-expanded="false">
              <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path class="site-menu-open" fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"></path>
                <path class="site-menu-close" style="display:none" fill-rule="evenodd" clip-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
              </svg>
            </button>
          </div>
        </div>
        <nav class="sl-menu site-menu" aria-label="Primary">
          ${links}
          ${themeButton('')}
        </nav>
      </div>
    </header>`;
  }

  // Footer columns. Edit the text and links here.
  const FOOTER_ABOUT = {
    position: 'Assistant Professor, Department of Mathematics, IIIT Delhi',
    email: 'sachchidanand@iiitd.ac.in',
    phone: '011-26907554',
    phoneLink: 'tel:+911126907554',
    address: 'B-301, R&amp;D Block, IIIT Delhi, Okhla Phase III, New Delhi 110020',
  };
  const FOOTER_EXPLORE = [
    ['Research', 'research/'], ['Teaching', 'teaching/'], ['CV', 'resume/'],
    ['Publications', 'publications/'], ['Daily problems', 'miscellaneous/daily-problems/'], ['Contact', 'contact/'],
  ];
  const FOOTER_PROFILES = [
    ['Google Scholar', 'https://scholar.google.com/citations?user=2XaM18gAAAAJ'],
    ['ORCID', 'https://orcid.org/0000-0002-2943-3163'],
    ['arXiv', 'https://arxiv.org/a/prasad_s_4.html'],
    ['MathSciNet', 'https://mathscinet.ams.org/mathscinet/2006/mathscinet/search/author.html?mrauthid=1563509'],
  ];

  // Daily problems: one every day since 1 January 2023; the topic is fixed by the weekday.
  const DAILY_START = Date.UTC(2023, 0, 1);
  const DAILY_TOPICS = ['Linear algebra', 'Real analysis', 'Complex analysis', 'Abstract algebra',
    'Topology', 'Differential equations', 'Miscellaneous'];
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function footerHtml() {
    const explore = FOOTER_EXPLORE.map(([label, path]) =>
      `<li><a href="${ROOT}${path}">${label}</a></li>`).join('');
    const profiles = FOOTER_PROFILES.map(([label, url]) =>
      `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join('');
    const icons = SOCIAL_LINKS.map(([label, url, icon]) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}"><i class="${icon}"></i></a>`
    ).join('');
    const updated = new Date(document.lastModified);
    const updatedText = isNaN(updated) ? '' : updated.toISOString().slice(0, 10);
    const now = new Date();
    const day = now.getDay();
    const count = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - DAILY_START) / 86400000) + 1;

    return `
    <footer class="site-footer foot sl-footer mt-auto">
      <div class="sl-strip">
        <div class="sl-inner sl-strip-row">
          <a class="sl-today" href="${ROOT}miscellaneous/daily-problems/#problem-of-the-day">
            <span class="sl-eyebrow">Today's problem</span>
            <span class="sl-today-title">${WEEKDAYS[day]} · ${DAILY_TOPICS[day]} <span aria-hidden="true">→</span></span>
          </a>
          <span class="sl-count">${count.toLocaleString('en-US')} problems, one a day since 1 January 2023</span>
        </div>
      </div>
      <div class="sl-inner sl-cols">
        <div class="sl-about">
          <a href="${ROOT}" class="sl-fname">Sachchidanand Prasad</a>
          <p class="sl-pos">${FOOTER_ABOUT.position}</p>
          <p class="sl-line"><i class="fa-solid fa-envelope" aria-hidden="true"></i><a href="mailto:${FOOTER_ABOUT.email}">${FOOTER_ABOUT.email}</a></p>
          <p class="sl-line"><i class="fa-solid fa-phone" aria-hidden="true"></i><span>Office: <a href="${FOOTER_ABOUT.phoneLink}">${FOOTER_ABOUT.phone}</a></span></p>
          <p class="sl-line"><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>${FOOTER_ABOUT.address}</span></p>
        </div>
        <div>
          <h3 class="sl-h">Explore</h3>
          <ul class="sl-list">${explore}</ul>
        </div>
        <div>
          <h3 class="sl-h">Academic profiles</h3>
          <ul class="sl-list">${profiles}</ul>
          <div class="sl-icons">${icons}</div>
        </div>
      </div>
      <div class="sl-base">
        <div class="sl-inner sl-base-row">
          <p>&copy; <span id="year">${now.getFullYear()}</span> Sachchidanand Prasad &middot; Last updated: <span id="updated">${updatedText}</span></p>
          <p class="sl-visitors">
            <span>Visitors</span>
            <img src="${VISITOR_COUNTER}" alt="Hit Counter by Digits" class="site-counter inline" />
            <span>counter by <a href="https://www.digits.net/" target="_blank" rel="noopener noreferrer">Digits.Net</a></span>
          </p>
        </div>
      </div>
    </footer>`;
  }

  customElements.define('site-header', class extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = '1';
      this.innerHTML = headerHtml(this.getAttribute('active'));
      this.querySelectorAll('.site-theme-button').forEach(btn => btn.addEventListener('click', () => {
        const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(next);
        try {
          // Same as the device setting: forget the choice and follow the device again
          if (next === systemTheme()) localStorage.removeItem(THEME_KEY);
          else localStorage.setItem(THEME_KEY, next);
        } catch (e) { /* not saved, still switches */ }
      }));
      const button = this.querySelector('.site-menu-button');
      const menu = this.querySelector('.site-menu');
      button.addEventListener('click', () => {
        const open = !menu.classList.contains('sl-open');
        menu.classList.toggle('sl-open', open);
        button.setAttribute('aria-expanded', String(open));
        this.querySelector('.site-menu-open').style.display = open ? 'none' : '';
        this.querySelector('.site-menu-close').style.display = open ? '' : 'none';
      });

      // Dropdowns: the arrow opens the list; the label still goes to the section page.
      const groups = [...this.querySelectorAll('.sl-dd')];
      const setOpen = (g, open) => {
        g.querySelector('.sl-panel').classList.toggle('sl-show', open);
        g.querySelector('.sl-caret').setAttribute('aria-expanded', String(open));
      };
      const closeAll = except => groups.forEach(g => { if (g !== except) setOpen(g, false); });
      const desktop = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : { matches: true };
      groups.forEach(g => {
        const caret = g.querySelector('.sl-caret');
        caret.addEventListener('click', () => {
          const open = caret.getAttribute('aria-expanded') !== 'true';
          closeAll(g);
          setOpen(g, open);
          if (open && g.dataset.menu === 'teaching') fillTeaching(this);
        });
        caret.addEventListener('pointerenter', () => { if (g.dataset.menu === 'teaching') fillTeaching(this); }, { once: true });
        // With a mouse on a wide screen the list also opens on hover, and closes
        // shortly after the pointer leaves (so moving down to the list is easy).
        let closeTimer = null;
        g.addEventListener('pointerenter', e => {
          if (e.pointerType !== 'mouse' || !desktop.matches) return;
          clearTimeout(closeTimer);
          closeAll(g);
          setOpen(g, true);
          if (g.dataset.menu === 'teaching') fillTeaching(this);
        });
        g.addEventListener('pointerleave', e => {
          if (e.pointerType !== 'mouse' || !desktop.matches) return;
          clearTimeout(closeTimer);
          closeTimer = setTimeout(() => setOpen(g, false), 250);
        });
        g.addEventListener('keydown', e => {
          if (e.key === 'Escape' && caret.getAttribute('aria-expanded') === 'true') { setOpen(g, false); caret.focus(); }
        });
        g.addEventListener('focusout', e => {
          if (desktop.matches && !g.contains(e.relatedTarget)) setOpen(g, false);
        });
      });
      document.addEventListener('click', e => {
        if (!(e.target.closest && e.target.closest('.sl-dd'))) closeAll();
      });
    }
  });

  customElements.define('site-footer', class extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = '1';
      this.innerHTML = footerHtml();
    }
  });
})();
