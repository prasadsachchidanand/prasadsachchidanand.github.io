// daily-index.js - extras for the daily-problems index page:
// the counts under the title, the "Random problem" button, the
// "Try it" link under today's problem, and the "Browse by topic" cards.
// Uses buildDailyDateURL() and getTodayDate() from daily-problem-loader.js.

(function () {
  const TOPICS = [
    { file: 'linear-algebra', tag: 'linear-algebra', name: 'Linear Algebra', day: 'Sundays', icon: 'V' },
    { file: 'real-analysis', tag: 'real-analysis', name: 'Real Analysis', day: 'Mondays', icon: 'ℝ' },
    { file: 'complex-analysis', tag: 'complex-analysis', name: 'Complex Analysis', day: 'Tuesdays', icon: 'ℂ' },
    { file: 'abstract-algebra', tag: 'abstract-algebra', name: 'Abstract Algebra', day: 'Wednesdays', icon: 'G' },
    { file: 'topology', tag: 'topology', name: 'Topology', day: 'Thursdays', icon: 'τ' },
    { file: 'differential-equations', tag: 'differential-equation', name: 'Differential Equations', day: 'Fridays', icon: '∂' },
    { file: 'miscellaneous', tag: 'miscellaneous', name: 'Miscellaneous', day: 'Saturdays', icon: '∗' },
  ];

  function solvedDates() {
    try {
      return JSON.parse(localStorage.getItem('solvedProblems') || '{}');
    } catch (e) {
      return {};
    }
  }

  function shortDate(dateString) {
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function monthYear(dateString) {
    const [y, m] = dateString.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }

  async function loadTopics() {
    const today = getTodayDate();
    return Promise.all(TOPICS.map(t =>
      fetch(`data/${t.file}.json`)
        .then(r => (r.ok ? r.json() : { problems: [] }))
        .catch(() => ({ problems: [] }))
        .then(data => ({
          ...t,
          // problems written in advance are not shown before their date
          dates: (data.problems || []).map(p => p.date).filter(d => d && d <= today).sort(),
        }))
    ));
  }

  function topicCard(t, solved) {
    const total = t.dates.length;
    const done = t.dates.filter(d => solved[d] === true).length;
    const pct = total ? Math.round((100 * done) / total) : 0;
    const latest = t.dates[t.dates.length - 1];
    return `
      <div class="flex flex-col p-5 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
        <div class="flex items-center gap-3">
          <span class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-semibold" aria-hidden="true">${t.icon}</span>
          <div class="min-w-0">
            <h3 class="font-semibold text-gray-900 leading-tight">${t.name}</h3>
            <p class="text-sm text-gray-500">${t.day}</p>
          </div>
        </div>
        <p class="mt-4 text-sm text-gray-700"><span class="font-semibold text-gray-900">${total}</span> problems${done ? ` &middot; <span class="text-emerald-700 font-medium">${done} solved</span>` : ''}</p>
        <div class="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden" title="${done} of ${total} marked as solved">
          <div class="h-full bg-emerald-500" style="width:${pct}%"></div>
        </div>
        <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
          ${latest ? `<a href="${buildDailyDateURL(latest)}" class="text-indigo-600 hover:text-indigo-800">Latest (${shortDate(latest)})</a>` : ''}
          <a href="tags/?tag=${t.tag}" class="text-gray-600 hover:text-gray-900">All problems</a>
        </div>
      </div>`;
  }

  async function init() {
    const topics = await loadTopics();
    const solved = solvedDates();
    const all = topics.flatMap(t => t.dates).sort();
    if (all.length === 0) return;

    // Counts under the title
    const solvedCount = all.filter(d => solved[d] === true).length;
    const stats = document.getElementById('dp-stats');
    if (stats) {
      stats.textContent = `${all.length} problems since ${monthYear(all[0])} · 7 topics` +
        (solvedCount ? ` · you have solved ${solvedCount}` : '');
    }

    // Link under today's problem: today's if there is one, otherwise the latest
    const today = getTodayDate();
    const open = document.getElementById('dp-open');
    if (open) open.href = buildDailyDateURL(all.includes(today) ? today : all[all.length - 1]);

    // Random problem, preferring ones not yet marked as solved
    const random = document.getElementById('dp-random');
    if (random) {
      random.addEventListener('click', () => {
        const unsolved = all.filter(d => solved[d] !== true);
        const pool = unsolved.length ? unsolved : all;
        window.location.href = buildDailyDateURL(pool[Math.floor(Math.random() * pool.length)]);
      });
    }

    // Topic cards
    const grid = document.getElementById('dp-topics');
    if (grid) grid.innerHTML = topics.map(t => topicCard(t, solved)).join('') + `
      <a href="../books/" class="flex flex-col p-5 bg-indigo-50 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors">
        <div class="flex items-center gap-3">
          <span class="flex-shrink-0 w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center" aria-hidden="true"><i class="fa-solid fa-book"></i></span>
          <h3 class="font-semibold text-gray-900 leading-tight">Book solutions</h3>
        </div>
        <p class="mt-4 text-sm text-gray-700">Exercises from Hoffman &amp; Kunze, Bartle &amp; Sherbert, Brown &amp; Churchill, Munkres, Rudin and Herstein, arranged by chapter.</p>
        <span class="mt-auto pt-4 text-sm font-medium text-indigo-600">Open the bookshelf &rarr;</span>
      </a>`;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
