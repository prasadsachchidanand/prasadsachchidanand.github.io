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
 */
(function () {
  // Menu entries, in order. `path` is relative to the site root.
  const NAV_LINKS = [
    { label: 'Home', path: '' },
    { label: 'Research', path: 'research/' },
    { label: 'Teaching', path: 'teaching/' },
    { label: 'CV', path: 'resume/' },
    { label: 'Publications', path: 'publications/' },
    { label: 'Miscellaneous', path: 'miscellaneous/' },
    { label: 'Contact', path: 'contact/' },
  ];

  // Footer icons: [label, url, hover colour class, icon classes]
  const SOCIAL_LINKS = [
    ['Facebook', 'https://www.facebook.com/sachchidanand.prasad/', 'hover:text-blue-500', 'fa-brands fa-facebook-f'],
    ['Instagram', 'https://www.instagram.com/sachchidanand1729/', 'hover:text-red-500', 'fa-brands fa-instagram'],
    ['Twitter', 'https://twitter.com/speinstene26', 'hover:text-blue-500', 'fa-brands fa-twitter'],
    ['GitHub', 'https://github.com/prasadsachchidanand', 'hover:text-purple-700', 'fa-brands fa-github'],
    ['ResearchGate', 'https://www.researchgate.net/profile/Sachchidanand-Prasad-2', 'hover:text-green-500', 'ai ai-researchgate ai-lg'],
    ['Academia.edu', 'https://nitrkl.academia.edu/SachchidanandPrasad', 'hover:text-gray-900', 'ai ai-academia'],
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
    return `<button type="button" class="site-theme-button ${extra} items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 focus:outline-none" aria-label="Switch between light and dark mode" title="Light / dark mode">${MOON}${SUN}</button>`;
  }

  const VISITOR_COUNTER =
    'https://counter.digits.net/?counter={ecc0f233-f3f7-d324-95c8-cc741ed787df}&COUNTER_TEMPLATE1&background=FFFFFF&foreground=8D8D8D';

  // The site root is worked out from this script's own address, so links work
  // on GitHub Pages, on a local server and when a file is opened directly.
  const scriptSrc = document.currentScript ? document.currentScript.src : '/assets/js/site-layout.js';
  const ROOT = scriptSrc.replace(/assets\/js\/site-layout\.js(\?.*)?$/, '');

  function currentSection() {
    const here = location.href.split(/[?#]/)[0].replace(/index\.html$/, '');
    let best = NAV_LINKS[0];
    for (const link of NAV_LINKS) {
      if (link.path && here.startsWith(ROOT + link.path)) best = link;
    }
    return here === ROOT || best.path ? best : null;
  }

  // <site-header active="none"> turns the highlight off (used on the 404 page);
  // <site-header active="CV"> forces a menu item to be highlighted.
  function headerHtml(activeLabel) {
    const active = activeLabel
      ? NAV_LINKS.find(link => link.label === activeLabel) || null
      : currentSection();
    const linkBase = 'px-4 py-2 mt-2 text-sm font-semibold rounded-lg md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none';
    const links = NAV_LINKS.map((link, i) => {
      const isActive = link === active;
      return `<a class="${linkBase}${i ? ' md:ml-4' : ''} ${isActive ? 'bg-gray-200 text-gray-900' : 'bg-transparent'}"
            href="${ROOT}${link.path}"${isActive ? ' aria-current="page"' : ''}>${link.label}</a>`;
    }).join('\n          ');

    return `
    <header class="fixed left-0 right-0 w-full text-gray-700 bg-white z-10">
      <div class="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div class="p-4 flex flex-row items-center justify-between">
          <a href="${ROOT}" class="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg focus:outline-none">Sachchidanand Prasad</a>
          <div class="flex items-center gap-2 md:hidden">
          ${themeButton('inline-flex')}
          <button type="button" class="site-menu-button md:hidden rounded-lg focus:outline-none" aria-label="Toggle navigation menu" aria-expanded="false">
            <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6" aria-hidden="true">
              <path class="site-menu-open" fill-rule="evenodd" clip-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"></path>
              <path class="site-menu-close hidden" fill-rule="evenodd" clip-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
            </svg>
          </button>
          </div>
        </div>
        <nav class="site-menu flex-col flex-grow pb-4 md:pb-0 hidden md:flex md:justify-end md:flex-row" aria-label="Primary">
          ${links}
          ${themeButton('hidden md:inline-flex md:ml-4')}
        </nav>
      </div>
    </header>`;
  }

  // Footer columns. Edit the text and links here.
  const FOOTER_ABOUT = {
    position: 'Assistant Professor, Department of Mathematics, IIIT Delhi',
    interests: 'Differential geometry · differential topology · algebraic topology',
    email: 'sachchidanand@iiitd.ac.in',
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

  function footerHtml() {
    const linkClass = 'text-gray-600 hover:text-gray-900';
    const heading = text => `<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900">${text}</h3>`;
    const explore = FOOTER_EXPLORE.map(([label, path]) =>
      `<li><a class="${linkClass}" href="${ROOT}${path}">${label}</a></li>`).join('');
    const profiles = FOOTER_PROFILES.map(([label, url]) =>
      `<li><a class="${linkClass}" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join('');
    const icons = SOCIAL_LINKS.map(([label, url, hover, icon]) =>
      `<a class="text-gray-500 ${hover}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}"><i class="${icon}"></i></a>`
    ).join('');
    const updated = new Date(document.lastModified);
    const updatedText = isNaN(updated) ? '' : updated.toISOString().slice(0, 10);

    return `
    <footer class="site-footer foot mt-auto bg-white border-t border-gray-200 text-sm text-gray-600">
      <div class="container mx-auto px-5 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2 min-w-0">
          <a href="${ROOT}" class="text-base font-semibold tracking-widest uppercase text-gray-900">Sachchidanand Prasad</a>
          <p class="mt-2 text-gray-700">${FOOTER_ABOUT.position}</p>
          <p class="mt-1 text-gray-500">${FOOTER_ABOUT.interests}</p>
          <p class="mt-4"><i class="fa-solid fa-envelope w-5 text-gray-400" aria-hidden="true"></i><a class="${linkClass}" href="mailto:${FOOTER_ABOUT.email}">${FOOTER_ABOUT.email}</a></p>
          <p class="mt-1 text-gray-500"><i class="fa-solid fa-location-dot w-5 text-gray-400" aria-hidden="true"></i>${FOOTER_ABOUT.address}</p>
        </div>
        <div>
          ${heading('Explore')}
          <ul class="space-y-2">${explore}</ul>
        </div>
        <div>
          ${heading('Academic profiles')}
          <ul class="space-y-2">${profiles}</ul>
          <div class="mt-5 flex flex-wrap items-center gap-4 text-base">${icons}</div>
        </div>
      </div>
      <div class="border-t border-gray-200">
        <div class="container mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; <span id="year">${new Date().getFullYear()}</span> Sachchidanand Prasad &middot; Last updated: <span id="updated">${updatedText}</span></p>
          <p class="flex items-center gap-2">
            <span>Visitors</span>
            <img src="${VISITOR_COUNTER}" alt="Hit Counter by Digits" class="site-counter w-11 inline" />
            <span>counter by <a href="https://www.digits.net/" class="hover:text-gray-700" target="_blank" rel="noopener noreferrer">Digits.Net</a></span>
          </p>
        </div>
      </div>
    </footer>`;
  }

  // The tags themselves take no space; their contents sit in the page layout
  // exactly as the old hand-written header and footer did.
  const style = document.createElement('style');
  style.textContent = 'site-header, site-footer { display: contents; }'
    + ' html.dark .theme-icon-moon, html:not(.dark) .theme-icon-sun { display: none; }';
  document.head.appendChild(style);

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
        const open = menu.classList.contains('hidden');
        menu.classList.toggle('hidden', !open);
        menu.classList.toggle('flex', open);
        button.setAttribute('aria-expanded', String(open));
        this.querySelector('.site-menu-open').classList.toggle('hidden', open);
        this.querySelector('.site-menu-close').classList.toggle('hidden', !open);
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
