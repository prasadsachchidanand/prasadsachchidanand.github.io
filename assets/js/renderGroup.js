/*
 * Research group, built from data/group.json.
 *
 *   renderGroup('group-container')        cards with photos (Research page)
 *   renderGroupList('supervision-list')   plain list (CV page)
 *
 * To add or change people, edit data/group.json only.
 * Photos go in assets/img/group/ (square images look best, e.g. 400 x 400).
 */
(function () {
  const ROOT = (document.currentScript ? document.currentScript.src : '/assets/js/renderGroup.js')
    .replace(/assets\/js\/renderGroup\.js(\?.*)?$/, '');
  const PLACEHOLDER = ROOT + 'assets/img/group/placeholder.svg';

  let dataPromise = null;
  function loadGroup() {
    dataPromise = dataPromise || fetch(ROOT + 'data/group.json').then(r => {
      if (!r.ok) throw new Error('group.json: ' + r.status);
      return r.json();
    });
    return dataPromise;
  }

  function esc(text) {
    return String(text || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function photoUrl(person) {
    const p = (person.photo || '').trim();
    if (!p) return PLACEHOLDER;
    return /^(https?:)?\/\/|^\//.test(p) ? p : ROOT + 'assets/img/group/' + p;
  }

  function nameHtml(person, extraClass = '') {
    const name = esc(person.name);
    if (!person.webpage) return name;
    return `<a href="${esc(person.webpage)}" target="_blank" rel="noopener noreferrer"
      class="${extraClass} hover:text-indigo-600 underline decoration-indigo-200 underline-offset-4">${name}</a>`;
  }

  function cvButton(person, small) {
    if (!person.cv) return '';
    return `<a href="${esc(person.cv)}" target="_blank" rel="noopener noreferrer"
      class="inline-flex items-center ${small ? 'mt-1 text-xs px-2.5 py-0.5' : 'mt-3 text-sm px-3 py-1'} rounded-full bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100">
      <i class="fa-solid fa-file-lines mr-1.5"></i>CV</a>`;
  }

  function photoImg(person, sizeClass) {
    return `<img src="${esc(photoUrl(person))}" alt="Photo of ${esc(person.name)}" loading="lazy"
      class="${sizeClass} rounded-full object-cover bg-indigo-100 ring-4 ring-white shadow"
      onerror="this.onerror=null;this.src='${PLACEHOLDER}'">`;
  }

  function currentCard(person) {
    return `
      <div class="bg-gray-50 rounded-xl p-5 text-center border border-gray-100 transition hover:shadow-md">
        ${photoImg(person, 'w-28 h-28 mx-auto')}
        <h4 class="mt-4 text-lg font-semibold text-gray-900">${nameHtml(person)}</h4>
        <p class="text-sm font-medium text-indigo-600">${esc(person.role)}</p>
        <p class="text-sm text-gray-500 mt-1"><i class="fa-regular fa-calendar mr-1"></i>Since ${esc(person.from)}</p>
        ${cvButton(person)}
      </div>`;
  }

  function pastCard(person) {
    const period = [person.from, person.to].filter(Boolean).map(esc).join(' – ');
    const role = person.role ? esc(person.role) + ' · ' : '';
    return `
      <div class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
        ${photoImg(person, 'w-16 h-16 flex-shrink-0')}
        <div class="min-w-0">
          <p class="font-semibold text-gray-900">${nameHtml(person)}</p>
          <p class="text-sm text-gray-500">${role}${period}</p>
          ${person.now ? `<p class="text-sm text-gray-700"><i class="fa-solid fa-arrow-right text-indigo-400 mr-1"></i>Now: ${esc(person.now)}</p>` : ''}
          ${cvButton(person, true)}
        </div>
      </div>`;
  }

  function heading(text) {
    return `<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-3 first:mt-0">${esc(text)}</h3>`;
  }

  window.renderGroup = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    loadGroup().then(data => {
      const current = data.current || [];
      const past = data.past || [];
      let html = '';
      if (current.length) {
        // Everyone in one grid (each card shows the role), grouped in the order roles first appear
        const roles = [...new Set(current.map(p => p.role))];
        const ordered = roles.flatMap(role => current.filter(p => p.role === role));
        html += heading('Current Members');
        html += `<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${ordered.map(currentCard).join('')}</div>`;
      }
      if (past.length) {
        html += heading('Past Members');
        html += `<div class="grid gap-4 md:grid-cols-2">${past.map(pastCard).join('')}</div>`;
      }
      container.innerHTML = html;
    }).catch(err => {
      console.error(err);
      const card = container.closest('.research-card');
      (card || container).hidden = true;
    });
  };

  window.renderGroupList = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    loadGroup().then(data => {
      const row = (p, past) => {
        const period = past ? [p.from, p.to].filter(Boolean).join(' – ') : `${p.from} – present`;
        return `<li class="border-l-4 border-indigo-500 pl-4">
            <p class="text-gray-800 font-medium">${nameHtml(p)}${p.role ? `, <span class="font-normal">${esc(p.role)}</span>` : ''}</p>
            <p class="text-gray-600 text-sm">${esc(period)}${past && p.now ? ` · now ${esc(p.now)}` : ''}</p>
          </li>`;
      };
      container.innerHTML = `<ul class="space-y-3">${(data.current || []).map(p => row(p, false)).join('')}${(data.past || []).map(p => row(p, true)).join('')}</ul>`;
    }).catch(err => { console.error(err); container.textContent = 'Could not load the group list.'; });
  };
})();
