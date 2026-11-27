/*
 * Lays out the retreat page from data.js (window.RETREAT): the header, the programme day by day,
 * the talks with their abstracts, the institutions and participants, and the venue.
 * During the retreat the current session is marked (India time).
 */
(function () {
  const R = window.RETREAT;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // links to other sites (people, institutions, slides) open in a new tab
  const link = (text, url) => (url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>` : esc(text));

  // ---------------------------------------------------------------- dates and times (IST)
  const asDate = iso => new Date(`${iso}T12:00:00Z`);
  const fmt = (iso, opts) => asDate(iso).toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });
  function dateRange(a, b) {
    const A = asDate(a), B = asDate(b);
    if (A.getUTCFullYear() !== B.getUTCFullYear()) return `${fmt(a, { day: 'numeric', month: 'long', year: 'numeric' })} – ${fmt(b, { day: 'numeric', month: 'long', year: 'numeric' })}`;
    if (A.getUTCMonth() !== B.getUTCMonth()) return `${fmt(a, { day: 'numeric', month: 'long' })} – ${fmt(b, { day: 'numeric', month: 'long', year: 'numeric' })}`;
    return `${fmt(a, { day: 'numeric' })}–${fmt(b, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  const minutes = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  function nowIST() {
    const p = {};
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(x => { p[x.type] = x.value; });
    return { date: `${p.year}-${p.month}-${p.day}`, min: Number(p.hour) * 60 + Number(p.minute) };
  }
  const daysBetween = (a, b) => Math.round((asDate(b) - asDate(a)) / 86400000);

  // every item gets its end (the next item's start, or an hour) and every talk a number
  let talkNo = 0;
  R.days.forEach((day, d) => {
    day.items.forEach((it, k) => {
      it.from = minutes(it.start);
      const next = day.items[k + 1];
      it.to = it.end ? minutes(it.end) : next ? minutes(next.start) : it.from + 60;
      it.day = d;
      if (it.type === 'talk') it.id = `talk-${++talkNo}`;
    });
  });
  const talks = R.days.flatMap(day => day.items.filter(it => it.type === 'talk'));
  const announced = talks.filter(t => t.speaker || t.title);

  // ---------------------------------------------------------------- header
  function header() {
    const range = dateRange(R.start, R.end);
    document.title = `${R.title} · ${R.place}, ${range}`;
    $('rt-brand').textContent = R.shortTitle || R.title;
    $('rt-kicker').textContent = `${range} · ${R.place}`;
    $('rt-title').textContent = R.title;
    $('rt-tagline').textContent = R.tagline;
    const facts = [
      `${R.days.length} days`,
      `${talks.length} talks`,
      `${R.institutions.length} institutions`,
      'By invitation',
    ];
    $('rt-facts').innerHTML = facts.map(f => `<li>${esc(f)}</li>`).join('');
    $('rt-art').innerHTML = poincareDisk();
    status();
  }

  // before, during or after the retreat
  function status() {
    const now = nowIST();
    let text;
    if (now.date < R.start) {
      const n = daysBetween(now.date, R.start);
      text = n === 1 ? 'Starts tomorrow' : `Starts in ${n} days`;
    } else if (now.date <= R.end) text = 'Happening now';
    else text = `Held ${dateRange(R.start, R.end)}`;
    $('rt-status').textContent = text;
    $('rt-status').dataset.live = String(now.date >= R.start && now.date <= R.end);
  }

  // geodesics in the Poincaré disk: arcs of circles meeting the boundary at right angles
  function poincareDisk() {
    const arcs = [];
    const family = (n, step, off, cls) => {
      for (let k = 0; k < n; k++) {
        const a = (2 * Math.PI * k) / n + off, d = (2 * Math.PI * step) / n, b = a + d;
        const r = Math.tan(d / 2);
        const p = t => `${Math.cos(t).toFixed(4)} ${Math.sin(t).toFixed(4)}`;
        arcs.push(`<path class="${cls}" d="M ${p(a)} A ${r.toFixed(4)} ${r.toFixed(4)} 0 0 0 ${p(b)}"/>`);
      }
    };
    family(24, 7, 0.13, 'g1');
    family(12, 5, 0.13 + Math.PI / 24, 'g2');
    family(36, 3, 0.05, 'g3');
    return `<svg viewBox="-1.04 -1.04 2.08 2.08" role="img" aria-label="Geodesics in the Poincaré disk"><circle class="rim" cx="0" cy="0" r="1"/>${arcs.join('')}</svg>`;
  }

  // ---------------------------------------------------------------- about
  function about() {
    $('rt-about').innerHTML = R.about.map(p => `<p>${esc(p)}</p>`).join('') +
      `<p class="rt-note">${esc(R.invitation)} ${esc(R.talkFormat)}</p>`;
  }

  // ---------------------------------------------------------------- programme
  const KIND = { talk: 'Talk', discussion: 'Discussion', meal: 'Meal', break: 'Break', other: '' };
  function slot(it) {
    const time = `<div class="rt-time"><time>${esc(it.start)}</time><span>${it.end ? `–${esc(it.end)}` : ''}</span></div>`;
    let body;
    if (it.type === 'talk') {
      const title = it.title ? `<a href="#${it.id}">${esc(it.title)}</a>` : '<span class="rt-tba">Title to be announced</span>';
      const who = it.speaker ? `${esc(it.speaker)}${it.institution ? ` <span class="rt-inst">${esc(it.institution)}</span>` : ''}` : '<span class="rt-tba">Speaker to be announced</span>';
      body = `<p class="rt-kind">${it.student ? 'PhD student talk' : 'Talk'}</p><p class="rt-what">${title}</p><p class="rt-who">${who}</p>`;
    } else {
      body = `<p class="rt-what">${esc(it.title || KIND[it.type])}</p>${it.note ? `<p class="rt-who">${esc(it.note)}</p>` : ''}`;
    }
    return `<li class="rt-slot rt-s-${esc(it.type)}" data-day="${esc(R.days[it.day].date)}" data-from="${it.from}" data-to="${it.to}">${time}<div class="rt-body">${body}<span class="rt-now-badge">Now</span></div></li>`;
  }
  function programme() {
    $('rt-glance').innerHTML = R.days.map((day, d) => `
      <a class="rt-glance-day" href="#day-${d + 1}">
        <span class="rt-glance-n">Day ${d + 1}</span>
        <span class="rt-glance-date">${esc(fmt(day.date, { weekday: 'short', day: 'numeric', month: 'short' }))}</span>
        <span class="rt-glance-sum">${esc(day.summary)}</span>
      </a>`).join('');
    $('rt-days').innerHTML = R.days.map((day, d) => `
      <section class="rt-day" id="day-${d + 1}" aria-labelledby="day-${d + 1}-h">
        <h3 id="day-${d + 1}-h"><span>Day ${d + 1}</span> ${esc(fmt(day.date, { weekday: 'long', day: 'numeric', month: 'long' }))}</h3>
        <ol class="rt-slots">${day.items.map(slot).join('')}</ol>
      </section>`).join('');
    $('rt-format').textContent = `${R.talkFormat} All times are India time (IST).`;
  }
  function markNow() {
    const now = nowIST();
    document.querySelectorAll('.rt-slot').forEach(li => {
      const on = li.dataset.day === now.date && now.min >= Number(li.dataset.from) && now.min < Number(li.dataset.to);
      li.classList.toggle('is-now', on);
    });
    status();
  }

  // ---------------------------------------------------------------- talks
  function talkCards() {
    if (!announced.length) {
      const students = talks.filter(t => t.student).length;
      $('rt-talks').innerHTML = `<p class="rt-empty">Speakers, titles and abstracts will appear here as they are confirmed. There are ${talks.length} talks${students ? `, ${students} of them by PhD students` : ''}; see the programme above for the times.</p>`;
      return;
    }
    $('rt-talks').innerHTML = announced.map(t => `
      <article class="rt-talk-card" id="${t.id}">
        <p class="rt-talk-when">${esc(fmt(R.days[t.day].date, { weekday: 'long', day: 'numeric', month: 'long' }))} · ${esc(t.start)}–${esc(hhmm(t.to))}${t.student ? ' · PhD student talk' : ''}</p>
        <h3>${t.title ? esc(t.title) : '<span class="rt-tba">Title to be announced</span>'}</h3>
        <p class="rt-talk-who">${t.speaker ? link(t.speaker, t.url) : '<span class="rt-tba">Speaker to be announced</span>'}${t.institution ? ` <span class="rt-inst">${esc(t.institution)}</span>` : ''}</p>
        ${t.abstract ? `<div class="rt-abstract">${String(t.abstract).split(/\n\s*\n/).map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
        ${t.slides ? `<p><a class="rt-button" href="${esc(t.slides)}" target="_blank" rel="noopener">Slides</a></p>` : ''}
      </article>`).join('');
  }

  // ---------------------------------------------------------------- institutions and participants
  function participants() {
    $('rt-institutions').innerHTML = R.institutions.map(inst => {
      const people = R.participants.filter(p => p.institution === inst.name);
      return `
        <article class="rt-inst-card">
          <h3>${link(inst.name, inst.url)}${inst.host ? ' <span class="rt-host">Host</span>' : ''}</h3>
          <p class="rt-inst-full">${esc(inst.full)}</p>
          ${people.length ? `<ul class="rt-people">${people.map(p => `<li>${link(p.name, p.url)}${p.student ? ' <span class="rt-inst">PhD student</span>' : ''}</li>`).join('')}</ul>` : ''}
        </article>`;
    }).join('');
    $('rt-participants-note').textContent = R.participants.length ? `${R.participants.length} participants.` : 'The list of participants will appear here.';
  }

  // ---------------------------------------------------------------- venue, organisers and support
  // the room for the talks, and the room reserved for open discussions (either may be undecided)
  function rooms(v) {
    const parts = [];
    if (v.room) parts.push(`Talks are in <strong>${esc(v.room)}</strong>.`);
    parts.push(`A room is reserved for open discussions throughout the retreat${v.discussionRoom ? `: <strong>${esc(v.discussionRoom)}</strong>` : ''}.`);
    const pending = [!v.room && 'the room for the talks', !v.discussionRoom && 'the discussion room'].filter(Boolean);
    if (pending.length) parts.push(`${pending.join(' and ').replace(/^t/, 'T')} will be announced here.`);
    return parts.join(' ');
  }
  function venue() {
    const v = R.venue;
    $('rt-venue').innerHTML = `
      <p class="rt-venue-name">${esc(v.name)}</p>
      <p>${esc(v.address)}</p>
      <p>${rooms(v)}</p>
      ${v.map ? `<p><a class="rt-button" href="${esc(v.map)}" target="_blank" rel="noopener">Open in Google Maps</a></p>` : ''}`;
    $('rt-organisers').innerHTML = R.organisers.map(o => `<li>${link(o.name, o.url)} <span class="rt-inst">${esc(o.institution)}</span>${o.email ? `<br><a href="mailto:${esc(o.email)}">${esc(o.email)}</a>` : ''}</li>`).join('');
    $('rt-funding').textContent = R.funding;
    $('rt-foot').innerHTML = `${esc(R.title)} · ${esc(R.place)} · ${esc(dateRange(R.start, R.end))}`;
  }

  // ---------------------------------------------------------------- maths in titles and abstracts
  function maths() {
    const text = talks.map(t => `${t.title || ''} ${t.abstract || ''}`).join(' ');
    if (!/\$|\\\(|\\\[/.test(text)) return;
    window.MathJax = { tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] } };
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    s.async = true;
    document.head.appendChild(s);
  }

  // ---------------------------------------------------------------- light / dark (the same setting as the rest of the site)
  function themeButton() {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    $('rt-theme').addEventListener('click', () => {
      const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try {
        if (next === (media.matches ? 'dark' : 'light')) localStorage.removeItem('theme');
        else localStorage.setItem('theme', next);
      } catch (e) { /* private mode: only this visit */ }
    });
    media.addEventListener('change', e => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
      if (!saved) document.documentElement.classList.toggle('dark', e.matches);
    });
  }

  header();
  about();
  programme();
  talkCards();
  participants();
  venue();
  maths();
  themeButton();
  markNow();
  setInterval(markNow, 60000);
})();
