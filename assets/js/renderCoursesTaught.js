/*
 * "Courses taught" list for the CV, built from teaching/courses-data.json,
 * the same file that drives the Teaching page. Add a course there and it
 * appears in both places.
 */
(function () {
  const ROOT = (document.currentScript ? document.currentScript.src : '/assets/js/renderCoursesTaught.js')
    .replace(/assets\/js\/renderCoursesTaught\.js(\?.*)?$/, '');

  function esc(text) {
    return String(text || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  window.renderCoursesTaught = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    fetch(ROOT + 'teaching/courses-data.json')
      .then(r => { if (!r.ok) throw new Error('courses-data.json: ' + r.status); return r.json(); })
      .then(data => {
        const rows = (data.courses || []).map(c => {
          // Only show real course codes (e.g. "MTH 100"), not category labels
          const code = /^[A-Z]{2,4}\s?\d{3}/.test(c.code || '') ? ` <span class="text-gray-500 font-normal">(${esc(c.code)})</span>` : '';
          const title = c.url
            ? `<a href="${esc(ROOT + 'teaching/' + c.url)}" class="text-indigo-600 hover:text-indigo-800">${esc(c.title)}</a>`
            : esc(c.title);
          const ongoing = c.status === 'ongoing'
            ? ' <span class="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">ongoing</span>'
            : '';
          return `<li class="border-l-4 border-indigo-500 pl-4">
              <p class="text-gray-800 font-medium">${title}${code}${ongoing}</p>
              <p class="text-gray-600 text-sm">${esc(c.location)} · ${esc(c.semester)}</p>
            </li>`;
        });
        container.innerHTML = `<ul class="space-y-3">${rows.join('')}</ul>`;
      })
      .catch(err => { console.error(err); container.textContent = 'Could not load the course list.'; });
  };
})();
