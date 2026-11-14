/*
 * course-template.js: draws every course page from that course's course-data.json.
 *
 * You should never need to edit this file. To change a course, edit its
 * course-data.json; see teaching/HOW-TO-EDIT-COURSES.md for every field with examples.
 *
 * Every block is optional: a block only appears if course-data.json has it.
 */

// ---------------------------------------------------------------------------
// Defaults for the material sections. A course only lists its items, e.g.
//   "sections": { "quizzes": { "items": [ { "number": 1, "title": "...", "date": "...", "file": "quiz/quiz-01.pdf", "solution": null } ] } }
// and gets the title, icon, colour and button labels below. Any of these can be
// overridden per course by adding the same key inside that section.
// ---------------------------------------------------------------------------
const SECTION_TYPES = {
  lectures:      { title: 'Lecture Notes',            icon: 'fa-book-open',        color: '#2563eb', prefix: 'Lecture',     fileLabel: 'Notes',      lockedLabel: 'Coming soon' },
  homeworks:     { title: 'Homework and Assignments', icon: 'fa-pen-to-square',    color: '#16a34a', prefix: 'Homework',    fileLabel: 'Homework' },
  assignments:   { title: 'Assignments',              icon: 'fa-file-pen',         color: '#0d9488', prefix: 'Assignment',  fileLabel: 'Assignment' },
  tutorials:     { title: 'Tutorials',                icon: 'fa-users',            color: '#0891b2', prefix: 'Tutorial',    fileLabel: 'Tutorial' },
  practice:      { title: 'Practice Problems',        icon: 'fa-dumbbell',         color: '#ea580c', prefix: 'Problem Set', fileLabel: 'Problems' },
  quizzes:       { title: 'Quizzes',                  icon: 'fa-circle-question',  color: '#ca8a04', prefix: 'Quiz',        fileLabel: 'Quiz' },
  presentations: { title: 'Student Presentations',    icon: 'fa-chalkboard-user',  color: '#9333ea', prefix: '',            fileLabel: 'Slides' },
  exams:         { title: 'Examinations',             icon: 'fa-file-lines',       color: '#dc2626', prefix: '',            fileLabel: 'Exam' },
};
const SECTION_ORDER = ['lectures', 'homeworks', 'assignments', 'tutorials', 'practice', 'quizzes', 'presentations', 'exams'];
const DEFAULT_SECTION = { title: 'Materials', icon: 'fa-folder-open', color: '#475569', prefix: '', fileLabel: 'Open' };

// Colours of the grading tiles; any other component name is grey.
const GRADING_COLORS = {
  'Assignments': '#16a34a', 'Homework': '#16a34a', 'Quizzes': '#ca8a04', 'Presentation': '#2563eb', 'Presentations': '#2563eb',
  'Midterm': '#ea580c', 'Mid Sem': '#ea580c', 'Mid-Semester': '#ea580c', 'End Sem': '#dc2626', 'End-Semester': '#dc2626',
  'Projects': '#9333ea', 'Project': '#9333ea', 'Tutorials': '#0891b2', 'Test': '#7c3aed',
};

// Older files used Tailwind colour names; map them to hex.
const NAMED_COLORS = { blue: '#2563eb', green: '#16a34a', yellow: '#ca8a04', red: '#dc2626', orange: '#ea580c', purple: '#9333ea', teal: '#0d9488', gray: '#475569', indigo: '#4f46e5' };
const hex = c => (c && c[0] === '#') ? c : (NAMED_COLORS[c] || c || '#475569');

// ---------------------------------------------------------------------------

function renderCoursePage(data) {
  ensureCourseCss();
  const title = data.courseCode ? `${data.courseCode} - ${data.courseTitle}` : data.courseTitle;
  document.getElementById('page-title').textContent = `${title} - Sachchidanand Prasad`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', `${title}, ${data.semester || ''}. Course page by Sachchidanand Prasad.`);

  const sections = collectSections(data.sections);
  document.getElementById('app').innerHTML = `
    <site-header></site-header>
    <section class="py-24 text-gray-600 body-font">
      <div class="container mx-auto px-4 sm:px-6">
        ${renderHero(data, title)}
        ${renderClassroom(data.classroom)}
        ${renderAbout(data.about)}
        ${renderDocuments(data.documents)}
        ${renderWeeklyPlan(data.weeklyPlan)}
        ${renderPeople(data.people)}
        ${renderGrading(data.grading)}
        ${renderGradingDetails(data.gradingNotes, data.gradeScale)}
        ${renderPolicies(data.policies)}
        ${sections.length ? renderSectionCards(sections) : (data.nothingPostedText ? `<div class="cp-card cp-muted">${data.nothingPostedText}</div>` : '')}
        ${renderReferences(data.references, data.referencesTitle)}
        <div class="cp-sections">${sections.map(renderSection).join('')}</div>
        <div class="cp-back"><a href="../" class="cp-back-btn"><i class="fas fa-arrow-left"></i> Back to all courses</a></div>
      </div>
    </section>
    <site-footer></site-footer>`;

  window.toggleSection = function (key) {
    sections.forEach(s => {
      const el = document.getElementById('sec-' + s.key);
      if (el && s.key !== key) el.hidden = true;
    });
    const target = document.getElementById('sec-' + key);
    target.hidden = !target.hidden;
    document.querySelectorAll('.cp-res').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.key === key && !target.hidden)));
    if (!target.hidden) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };
  if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
}

// Sections with at least one item, in the standard order, defaults filled in.
function collectSections(raw) {
  if (!raw) return [];
  const keys = Object.keys(raw).sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a), ib = SECTION_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return keys.filter(k => raw[k] && raw[k].items && raw[k].items.length).map(k => {
    const base = SECTION_TYPES[k] || DEFAULT_SECTION;
    const own = raw[k];
    return {
      key: k,
      title: own.title || base.title,
      icon: own.icon || base.icon,
      color: hex(own.color || base.color),
      prefix: own.prefix !== undefined ? own.prefix : base.prefix,
      fileLabel: own.fileLabel || base.fileLabel,
      lockedLabel: own.lockedLabel || base.lockedLabel || 'Coming soon',
      solutionLabel: own.solutionLabel || 'Solution',
      items: own.items,
    };
  });
}

// ---------------------------------------------------------------------------
// Blocks
// ---------------------------------------------------------------------------

function renderHero(data, title) {
  const pills = (data.schedule || []).map(s =>
    `<div class="flex items-center justify-center bg-white/10 rounded-full px-3 sm:px-4 py-2"><i class="fas fa-clock mr-2 text-blue-200 flex-shrink-0"></i><span>${s.day} • ${s.time}</span></div>`).join('');
  const place = data.location
    ? `<div class="flex items-center justify-center bg-white/10 rounded-full px-3 sm:px-4 py-2"><i class="fas fa-map-marker-alt mr-2 text-blue-200 flex-shrink-0"></i><span class="text-center">${data.location}</span></div>`
    : '';
  return `
    <div class="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden mb-10">
      <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      <div class="relative flex flex-col items-center text-center justify-center px-4 sm:px-6 py-10 sm:py-14">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight" style="color:#fff">${title}</h1>
        ${data.semester ? `<p class="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 opacity-90">${data.semester}</p>` : ''}
        <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 text-sm sm:text-base lg:text-lg w-full max-w-3xl">${pills}${place}</div>
      </div>
    </div>`;
}

function renderClassroom(c) {
  if (!c) return '';
  const button = c.url
    ? `<a class="cp-btn" href="${c.url}" target="_blank" rel="noopener noreferrer"><i class="fas fa-arrow-up-right-from-square"></i> Open Google Classroom</a>`
    : '';
  return `
    <div class="cp-card cp-classroom">
      <div>
        <h2 class="cp-h"><i class="fas fa-chalkboard"></i>${c.title || 'Course materials are on Google Classroom'}</h2>
        <p>${c.text || ''}</p>
      </div>
      ${button}
    </div>`;
}

function renderAbout(about) {
  if (!about) return '';
  const link = about.link
    ? `<a class="cp-more" href="${about.link.url}" target="_blank" rel="noopener noreferrer">${about.link.label} <i class="fas fa-arrow-up-right-from-square"></i></a>`
    : '';
  return `
    <div class="cp-card">
      <h2 class="cp-h"><i class="fas fa-book"></i>About the course</h2>
      <p class="cp-about">${about.text}</p>
      ${link}
    </div>`;
}

function renderDocuments(docs) {
  if (!docs || !docs.length) return '';
  return `
    <div class="cp-card">
      <h2 class="cp-h"><i class="fas fa-file-pdf"></i>Course documents</h2>
      <div class="cp-docs">${docs.map(d => `
        <a class="cp-doc" href="${d.file}" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-file-pdf cp-doc-icon"></i>
          <span><span class="cp-doc-title">${d.title}</span>${d.description ? `<span class="cp-doc-desc">${d.description}</span>` : ''}</span>
        </a>`).join('')}
      </div>
    </div>`;
}

function renderWeeklyPlan(plan) {
  if (!plan || !plan.units || !plan.units.length) return '';
  const units = plan.units.map(u => {
    const nums = u.weeks.map(w => w[0]);
    const span = nums.length > 1 ? `Weeks ${nums[0]}–${nums[nums.length - 1]}` : `Week ${nums[0]}`;
    return `
      <div class="cp-unit">
        <div class="cp-unit-head"><span class="cp-unit-title">${u.title}</span><span class="cp-unit-meta">${span}${u.reading ? ` · ${u.reading}` : ''}</span></div>
        <ol class="cp-weeks">${u.weeks.map(([n, topic]) => `<li><span class="cp-week">Week ${n}</span><span>${topic}</span></li>`).join('')}</ol>
      </div>`;
  }).join('');
  return `
    <div class="cp-card">
      <h2 class="cp-h"><i class="fas fa-calendar-week"></i>Weekly plan</h2>
      ${plan.note ? `<p class="cp-note">${plan.note}</p>` : ''}
      <div class="cp-units">${units}</div>
    </div>`;
}

function renderPeople(people) {
  if (!people || !people.length) return '';
  return `<div class="cp-people">${people.map(p => `
    <div class="cp-card">
      <span class="cp-role">${p.role}</span>
      <span class="cp-name">${p.name}</span>
      ${p.office ? `<span class="cp-line"><i class="fas fa-location-dot"></i>${p.office}</span>` : ''}
      ${p.email ? `<span class="cp-line"><i class="fas fa-envelope"></i><a href="mailto:${p.email}">${p.email}</a></span>` : ''}
      ${p.hours && p.hours.length ? `<div class="cp-hours"><div class="cp-hours-h">Office hours</div><ul>${p.hours.map(h => `<li>${h}</li>`).join('')}</ul></div>` : ''}
    </div>`).join('')}</div>`;
}

// Grading tiles (the Matrix Groups style): one tinted tile per component.
function renderGrading(grading) {
  if (!grading || !Object.keys(grading).length) return '';
  const tiles = Object.entries(grading).map(([name, pct]) =>
    `<div class="cp-tile" style="--t:${GRADING_COLORS[name] || '#64748b'}"><b>${pct}%</b><span>${name}</span></div>`).join('');
  return `
    <div class="cp-card">
      <h2 class="cp-h"><i class="fas fa-chart-pie"></i>Grading breakdown</h2>
      <div class="cp-tiles">${tiles}</div>
    </div>`;
}

function renderGradingDetails(notes, scale) {
  if ((!notes || !notes.length) && (!scale || !scale.length)) return '';
  return `
    <div class="cp-card">
      <h2 class="cp-h"><i class="fas fa-list-check"></i>Assessment and grades</h2>
      ${notes && notes.length ? `<ul class="cp-notes">${notes.map(n => `<li><span>${n}</span></li>`).join('')}</ul>` : ''}
      ${scale && scale.length ? `<div class="cp-label">Grade from total marks (out of 100)</div>
        <div class="cp-scale">${scale.map(s => `<div><b>${s.grade}</b><span>${s.range}</span></div>`).join('')}</div>` : ''}
    </div>`;
}

function renderPolicies(policies) {
  if (!policies || !policies.length) return '';
  return `
    <div class="cp-card">
      <h2 class="cp-h"><i class="fas fa-circle-info"></i>Course policies</h2>
      <div class="cp-policies">${policies.map(p => `<div><div class="cp-policy-t">${p.title}</div><p>${p.text}</p></div>`).join('')}</div>
    </div>`;
}

// One card per material section; clicking opens its list further down.
function renderSectionCards(sections) {
  return `<div class="cp-res-grid">${sections.map(s => `
    <button type="button" class="cp-res" data-key="${s.key}" aria-expanded="false" aria-controls="sec-${s.key}" onclick="toggleSection('${s.key}')" style="--c:${s.color}">
      <span class="cp-res-icon"><i class="fas ${s.icon}"></i></span>
      <span class="cp-res-title">${s.title}</span>
      <span class="cp-res-count">${s.items.length} ${s.items.length === 1 ? 'item' : 'items'}</span>
    </button>`).join('')}</div>`;
}

function renderSection(s) {
  return `
    <div id="sec-${s.key}" class="cp-card cp-section" hidden style="--c:${s.color}">
      <h3 class="cp-h"><i class="fas ${s.icon}" style="color:${s.color}"></i>${s.title}</h3>
      <div class="cp-items">${s.items.map(it => renderItem(it, s)).join('')}</div>
    </div>`;
}

// An item: heading, short text, date, and buttons. Recognised keys:
//   number, title, description, heading, date, deadline, file, fileLabel, solution, links
function renderItem(item, s) {
  const numbered = s.prefix && item.number !== undefined && item.number !== null && item.number !== '';
  const heading = item.heading || (numbered ? `${s.prefix} ${item.number}` : (item.title || ''));
  const detail = numbered ? (item.title || item.description || '') : (item.heading ? item.title || item.description || '' : item.description || '');
  const when = item.date || item.deadline || '';

  const buttons = [];
  if ('file' in item) {
    buttons.push(item.file
      ? `<a class="cp-sbtn" href="${item.file}" target="_blank" rel="noopener noreferrer"><i class="fas fa-download"></i> ${item.fileLabel || s.fileLabel}</a>`
      : `<span class="cp-sbtn cp-locked"><i class="fas fa-lock"></i> ${s.lockedLabel}</span>`);
  }
  if ('solution' in item) {
    buttons.push(item.solution
      ? `<a class="cp-sbtn cp-sbtn-alt" href="${item.solution}" target="_blank" rel="noopener noreferrer"><i class="fas fa-download"></i> ${s.solutionLabel}</a>`
      : `<span class="cp-sbtn cp-locked"><i class="fas fa-lock"></i> ${s.solutionLabel}</span>`);
  }
  (item.links || []).forEach(l => buttons.push(
    `<a class="cp-sbtn cp-sbtn-alt" href="${l.url}" target="_blank" rel="noopener noreferrer"><i class="fas fa-arrow-up-right-from-square"></i> ${l.label}</a>`));

  return `
    <div class="cp-item">
      <div class="cp-item-main">
        <div class="cp-item-h">${heading}</div>
        ${detail ? `<div class="cp-item-d">${detail}</div>` : ''}
        ${when ? `<div class="cp-item-when"><i class="fas fa-calendar-alt"></i>${when}</div>` : ''}
      </div>
      ${buttons.length ? `<div class="cp-item-btns">${buttons.join('')}</div>` : ''}
    </div>`;
}

function renderReferences(refs, title) {
  if (!refs || !refs.length) return '';
  const items = refs.map(r => {
    const t = r.link ? `<a href="${r.link}" target="_blank" rel="noopener noreferrer"><em>${r.title}</em></a>` : `<em>${r.title}</em>`;
    return `<li>${r.author ? `${r.author}, ` : ''}${t}${r.publisher ? ` (${r.publisher})` : ''}${r.note ? `. ${r.note}` : ''}</li>`;
  }).join('');
  return `
    <div class="cp-card">
      <h2 class="cp-h"><i class="fas fa-bookmark"></i>${title || 'References'}</h2>
      <ul class="cp-refs">${items}</ul>
    </div>`;
}

// ---------------------------------------------------------------------------
// Styles (light and dark)
// ---------------------------------------------------------------------------
function ensureCourseCss() {
  if (document.getElementById('cp-css')) return;
  const style = document.createElement('style');
  style.id = 'cp-css';
  style.textContent = `
  .cp-card { background:#fff; border-radius:.75rem; box-shadow:0 10px 15px -3px rgba(0,0,0,.08),0 4px 6px -4px rgba(0,0,0,.06); padding:1.5rem; margin-bottom:2rem; color:#4b5563; }
  .cp-muted { text-align:center; }
  .cp-h { margin:0 0 1rem; font-size:1.35rem; font-weight:700; color:#1f2937; display:flex; align-items:center; gap:.6rem; }
  .cp-h i { color:#4f46e5; }
  .cp-note { margin:-.25rem 0 1.25rem; font-size:.95rem; color:#6b7280; }
  .cp-label { font-size:.8rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#6b7280; margin-bottom:.6rem; }
  .cp-classroom { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem 2rem; background:#eef2ff; border:1px solid #c7d2fe; box-shadow:none; }
  .cp-classroom .cp-h { margin-bottom:.4rem; color:#312e81; }
  .cp-classroom > div { flex:1 1 320px; }
  .cp-classroom p { margin:0; line-height:1.6; color:#3730a3; }
  .cp-btn { display:inline-flex; align-items:center; gap:.5rem; padding:.7rem 1.2rem; border-radius:.6rem; background:#4f46e5; color:#fff !important; font-weight:600; text-decoration:none; white-space:nowrap; }
  .cp-btn:hover { background:#4338ca; }
  .cp-about { margin:0; line-height:1.7; }
  .cp-more { display:inline-flex; align-items:center; gap:.4rem; margin-top:.9rem; font-weight:600; color:#4338ca; }
  .cp-more i { font-size:.75rem; }
  .cp-docs { display:grid; gap:.75rem; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); }
  .cp-doc { display:flex; gap:.85rem; align-items:center; padding:1rem 1.1rem; border:1px solid #e5e7eb; border-radius:.6rem; text-decoration:none; color:inherit; transition:border-color .15s, box-shadow .15s; }
  .cp-doc:hover { border-color:#6366f1; box-shadow:0 4px 14px rgba(15,23,42,.08); }
  .cp-doc-icon { font-size:1.6rem; color:#dc2626; }
  .cp-doc-title { display:block; font-weight:600; color:#1f2937; }
  .cp-doc-desc { display:block; font-size:.9rem; color:#6b7280; }
  .cp-units { display:grid; gap:1.25rem; }
  .cp-unit { border:1px solid #e5e7eb; border-radius:.6rem; overflow:hidden; }
  .cp-unit-head { display:flex; flex-wrap:wrap; align-items:baseline; justify-content:space-between; gap:.25rem 1rem; padding:.7rem 1rem; background:#f5f6ff; border-bottom:1px solid #e5e7eb; }
  .cp-unit-title { font-weight:700; color:#1f2937; }
  .cp-unit-meta { font-size:.85rem; color:#6b7280; }
  .cp-weeks { list-style:none; margin:0; padding:0; }
  .cp-weeks li { display:grid; grid-template-columns:5.5rem minmax(0,1fr); gap:1rem; padding:.65rem 1rem; line-height:1.55; }
  .cp-weeks li + li { border-top:1px solid #f0f1f5; }
  .cp-week { font-size:.85rem; font-weight:700; color:#4f46e5; font-variant-numeric:tabular-nums; padding-top:.1rem; }
  .cp-people { display:grid; gap:1.5rem; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); margin-bottom:2rem; }
  .cp-people .cp-card { margin:0; display:grid; gap:.35rem; align-content:start; }
  .cp-role { font-size:.75rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#4f46e5; }
  .cp-name { font-size:1.15rem; font-weight:700; color:#1f2937; }
  .cp-line { display:flex; gap:.6rem; align-items:baseline; }
  .cp-line i { width:1rem; text-align:center; color:#9ca3af; }
  .cp-line a { color:#4338ca; }
  .cp-hours { margin:.5rem 0 0; padding-top:.6rem; border-top:1px solid #e5e7eb; }
  .cp-hours-h { font-size:.8rem; font-weight:600; color:#6b7280; margin-bottom:.25rem; }
  .cp-hours ul { list-style:none; margin:0; padding:0; display:grid; gap:.15rem; font-variant-numeric:tabular-nums; }
  .cp-tiles { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); }
  .cp-tile { display:flex; flex-direction:column; align-items:center; gap:.2rem; padding:1rem .75rem; border-radius:.6rem; text-align:center;
    background:linear-gradient(135deg, color-mix(in srgb, var(--t) 7%, #fff), color-mix(in srgb, var(--t) 16%, #fff)); }
  .cp-tile b { font-size:1.6rem; line-height:1.2; color:color-mix(in srgb, var(--t) 72%, #000); font-variant-numeric:tabular-nums; }
  .cp-tile span { font-size:.9rem; font-weight:500; color:color-mix(in srgb, var(--t) 80%, #000); }
  .cp-notes { list-style:none; margin:0 0 1.25rem; padding:0; display:grid; gap:.4rem; }
  .cp-notes li { display:flex; gap:.6rem; }
  .cp-notes li::before { content:""; flex:none; width:.4rem; height:.4rem; margin-top:.55rem; border-radius:50%; background:#4f46e5; }
  .cp-scale { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:.5rem; }
  .cp-scale div { border:1px solid #e5e7eb; border-radius:.5rem; padding:.5rem .7rem; display:flex; align-items:baseline; justify-content:space-between; gap:.5rem; }
  .cp-scale b { font-size:1.1rem; color:#1f2937; }
  .cp-scale span { font-size:.85rem; color:#6b7280; font-variant-numeric:tabular-nums; }
  .cp-policies { display:grid; gap:1rem; }
  .cp-policy-t { font-weight:600; color:#1f2937; }
  .cp-policies p { margin:.15rem 0 0; line-height:1.6; }
  .cp-res-grid { display:grid; gap:1.25rem; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); margin-bottom:2rem; }
  .cp-res { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.5rem 1rem; border:2px solid transparent; border-radius:.75rem; background:#fff; cursor:pointer;
    box-shadow:0 10px 15px -3px rgba(0,0,0,.08),0 4px 6px -4px rgba(0,0,0,.06); font:inherit; color:inherit; transition:transform .15s, border-color .15s; }
  .cp-res:hover { transform:translateY(-2px); border-color:color-mix(in srgb, var(--c) 45%, transparent); }
  .cp-res[aria-expanded="true"] { border-color:var(--c); }
  .cp-res:focus-visible { outline:2px solid var(--c); outline-offset:2px; }
  .cp-res-icon { width:3.5rem; height:3.5rem; border-radius:50%; display:grid; place-items:center; font-size:1.4rem; color:var(--c); background:color-mix(in srgb, var(--c) 12%, #fff); }
  .cp-res-title { font-size:1.1rem; font-weight:700; color:#1f2937; }
  .cp-res-count { font-size:.85rem; color:#6b7280; }
  .cp-sections { display:grid; gap:2rem; }
  .cp-sections .cp-card { margin:0; scroll-margin-top:5rem; }
  .cp-items { display:grid; gap:.85rem; }
  .cp-item { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:.75rem 1.5rem; padding:1rem 1.25rem; border:1px solid #e5e7eb; border-radius:.6rem; }
  .cp-item-main { min-width:0; flex:1 1 260px; }
  .cp-item-h { font-weight:600; font-size:1.05rem; color:#1f2937; }
  .cp-item-d { margin-top:.15rem; font-size:.95rem; color:#4b5563; }
  .cp-item-when { margin-top:.4rem; display:flex; align-items:center; gap:.5rem; font-size:.9rem; font-weight:500; color:var(--c); }
  .cp-item-btns { display:flex; flex-wrap:wrap; gap:.6rem; }
  .cp-sbtn { display:inline-flex; align-items:center; gap:.4rem; padding:.5rem .9rem; border-radius:.5rem; font-size:.9rem; font-weight:600; text-decoration:none; background:var(--c); color:#fff !important; white-space:nowrap; }
  .cp-sbtn:hover { filter:brightness(.92); }
  .cp-sbtn-alt { background:color-mix(in srgb, var(--c) 12%, #fff); color:color-mix(in srgb, var(--c) 80%, #000) !important; }
  .cp-locked { background:#e5e7eb; color:#6b7280 !important; cursor:not-allowed; }
  .cp-refs { margin:0; padding-left:1.2rem; display:grid; gap:.6rem; line-height:1.6; list-style:disc; }
  .cp-refs li::marker { color:#7c3aed; }
  .cp-refs a { color:#4338ca; }
  .cp-back { text-align:center; margin-top:3rem; }
  .cp-back-btn { display:inline-flex; align-items:center; gap:.5rem; padding:.75rem 1.75rem; border-radius:999px; background:#16a34a; color:#fff !important; font-weight:600; text-decoration:none; }
  .cp-back-btn:hover { background:#15803d; }
  @media (min-width:768px) { .cp-scale { grid-template-columns:repeat(4, minmax(0,1fr)); } }
  @media (max-width:480px) { .cp-weeks li { grid-template-columns:1fr; gap:.1rem; } }
  @media (prefers-reduced-motion:reduce) { .cp-res, .cp-doc { transition:none; } }

  html.dark .cp-card, html.dark .cp-res { background:#1e293b; color:#cbd5e1; box-shadow:none; border-color:#334155; }
  html.dark .cp-card { border:1px solid #334155; }
  html.dark .cp-h, html.dark .cp-name, html.dark .cp-scale b, html.dark .cp-policy-t, html.dark .cp-unit-title,
  html.dark .cp-res-title, html.dark .cp-item-h, html.dark .cp-doc-title { color:#f1f5f9; }
  html.dark .cp-h i, html.dark .cp-role, html.dark .cp-week, html.dark .cp-more, html.dark .cp-line a, html.dark .cp-refs a { color:#a5b4fc; }
  html.dark .cp-classroom { background:#1e1b4b; border-color:#3730a3; }
  html.dark .cp-classroom .cp-h, html.dark .cp-classroom p { color:#e0e7ff; }
  html.dark .cp-unit, html.dark .cp-hours, html.dark .cp-scale div, html.dark .cp-item, html.dark .cp-doc { border-color:#334155; }
  html.dark .cp-unit-head { background:#172033; border-color:#334155; }
  html.dark .cp-weeks li + li { border-color:#273449; }
  html.dark .cp-note, html.dark .cp-unit-meta, html.dark .cp-label, html.dark .cp-res-count, html.dark .cp-doc-desc, html.dark .cp-item-d { color:#94a3b8; }
  html.dark .cp-notes li::before { background:#a5b4fc; }
  html.dark .cp-tile { background:color-mix(in srgb, var(--t) 18%, #1e293b); }
  html.dark .cp-tile b, html.dark .cp-tile span { color:color-mix(in srgb, var(--t) 45%, #fff); }
  html.dark .cp-res-icon { background:color-mix(in srgb, var(--c) 22%, #1e293b); color:color-mix(in srgb, var(--c) 55%, #fff); }
  html.dark .cp-item-when { color:color-mix(in srgb, var(--c) 55%, #fff); }
  html.dark .cp-sbtn-alt { background:color-mix(in srgb, var(--c) 22%, #1e293b); color:color-mix(in srgb, var(--c) 45%, #fff) !important; }
  html.dark .cp-locked { background:#334155; color:#94a3b8 !important; }
  `;
  document.head.appendChild(style);
}

// Load this folder's course-data.json and draw the page (called by every course's index.html).
function loadCoursePage() {
  fetch('course-data.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(renderCoursePage)
    .catch(err => {
      console.error('Error loading course data:', err);
      document.getElementById('app').innerHTML =
        '<site-header></site-header><div class="container mx-auto px-4 py-24 text-center"><p>This course page could not be loaded. Please refresh, or check course-data.json for a typo (a missing comma or quote).</p></div><site-footer></site-footer>';
    });
}
