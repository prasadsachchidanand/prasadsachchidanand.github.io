// course-template.js - Fully Dynamic Course Template

function renderCoursePage(data) {
  // Set page title
  document.getElementById('page-title').textContent = 
    `${data.courseCode} - ${data.courseTitle} - Sachchidanand Prasad`;
  
  // Get the app container
  const app = document.getElementById('app');
  
  // Build the complete page
  app.innerHTML = `
    ${renderNavbar()}
    ${renderCourseHeader(data)}
    ${renderMainContent(data)}
    ${renderFooter()}
  `;
  
  // Initialize toggle functionality
  initializeToggles(data);
}

// Shared site menu (defined in assets/js/site-layout.js)
function renderNavbar() {
  return '<site-header></site-header>';
}

// Render course header with gradient
function renderCourseHeader(data) {
  const scheduleHTML = data.schedule.map(s => `
    <div class="flex items-center justify-center bg-white/10 rounded-full px-3 sm:px-4 py-2">
      <i class="fas fa-clock mr-2 text-blue-200 flex-shrink-0"></i>
      <span>${s.day} • ${s.time}</span>
    </div>
  `).join('');
  
  return `
    <section class="py-24 text-gray-600 body-font">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden mb-10 min-h-[280px] sm:min-h-[320px] md:h-[300px]">
          <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div class="relative flex flex-col items-center text-center justify-center h-full px-4 sm:px-6 py-8 sm:py-0">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              ${data.courseCode} - ${data.courseTitle}
            </h1>
            <p class="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 opacity-90">${data.semester}</p>
            <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-sm sm:text-base lg:text-lg w-full max-w-2xl">
              ${scheduleHTML}
              <div class="flex items-center justify-center bg-white/10 rounded-full px-3 sm:px-4 py-2">
                <i class="fas fa-map-marker-alt mr-2 text-blue-200 flex-shrink-0"></i>
                <span class="text-center sm:whitespace-nowrap">${data.location}</span>
              </div>
            </div>
          </div>
        </div>
  `;
}

// Render main content
function renderMainContent(data) {
  // A section (lectures, homework, ...) only appears once it has at least one item
  const postedSections = Object.fromEntries(
    Object.entries(data.sections || {}).filter(([, section]) => section.items && section.items.length)
  );

  return `
        ${renderGradingBreakdown(data.grading)}
        ${Object.keys(postedSections).length ? renderResourceCards(postedSections) : renderNothingPosted()}
        ${renderReferences(data.references)}
        ${renderDynamicSections(postedSections)}
        ${renderBackButton()}
      </div>
    </section>
  `;
}

// Shown in place of the resource cards before any material is posted
function renderNothingPosted() {
  return `
    <div class="bg-white rounded-xl shadow-lg p-6 mb-12 text-center text-gray-600">
      <i class="fas fa-book-open text-2xl text-blue-600 block mb-3"></i>
      <p>Lecture notes, homework and quizzes will be posted here during the semester.</p>
    </div>
  `;
}

// Render grading breakdown with responsive design
function renderGradingBreakdown(grading) {
  if (!grading || !Object.keys(grading).length) return '';

  const colors = {
    'Assignments': 'green',
    'Quizzes': 'yellow',
    'Presentation': 'blue',
    'End Sem': 'red',
    'Midterm': 'orange',
    'Projects': 'purple'
  };
  
  // Create mobile-friendly individual cards for small screens
  const mobileCards = Object.entries(grading).map(([name, percentage]) => {
    const color = colors[name] || 'gray';
    return `
      <div class="bg-${color}-500 flex items-center justify-between text-white py-3 px-4 rounded-lg shadow">
        <span class="font-bold text-sm">${name}</span>
        <span class="text-xl font-bold">${percentage}%</span>
      </div>
    `;
  }).join('');
  
  // Create the stacked bar segments for desktop
  const barSegments = Object.entries(grading).map(([name, percentage]) => {
    const color = colors[name] || 'gray';
    return `
      <div class="bg-${color}-500 flex flex-col items-center justify-center text-white py-4 px-2 border-r border-${color}-600 last:border-r-0"
           style="width: ${percentage}%">
        <div class="font-bold text-xs lg:text-sm xl:text-base truncate w-full text-center px-1">${name}</div>
        <div class="text-base lg:text-lg xl:text-xl font-bold">${percentage}%</div>
      </div>
    `;
  }).join('');
  
  return `
    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-10 card-hover">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
        <i class="fas fa-chart-pie text-purple-600 mr-2 sm:mr-3"></i>
        Grading Breakdown
      </h2>
      
      <!-- Mobile View: Individual Cards (visible on small screens only) -->
      <div class="md:hidden grid grid-cols-1 gap-3">
        ${mobileCards}
      </div>
      
      <!-- Desktop View: Single Stacked Bar (hidden on small screens) -->
      <div class="hidden md:flex w-full h-24 rounded-lg overflow-hidden shadow-lg">
        ${barSegments}
      </div>
    </div>
  `;
}

// Render resource cards dynamically
function renderResourceCards(sections) {
  const cardsHTML = Object.entries(sections).map(([key, section]) => {
    const color = section.color;
    return `
      <div class="bg-white rounded-xl shadow-lg p-6 card-hover">
        <div class="text-center mb-4">
          <div class="w-16 h-16 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="${section.cardIcon} text-2xl text-${color}-600"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800">${section.title}</h3>
        </div>
        <button onclick="toggleSection('${key}')"
          class="w-full bg-${color}-600 text-white py-3 px-4 rounded-lg hover:bg-${color}-700 transition duration-300 font-semibold">
          View ${section.title}
        </button>
      </div>
    `;
  }).join('');
  
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      ${cardsHTML}
    </div>
  `;
}

// Render references with optional links
function renderReferences(references) {
  if (!references || !references.length) return '';

  const referencesHTML = references.map(ref => {
    const titleHTML = ref.link 
      ? `<a href="${ref.link}" target="_blank" class="text-purple-600 hover:text-purple-800 hover:underline">${ref.title}</a>`
      : `${ref.title}`;
    
    return `
      <li class="flex items-start">
        <span class="text-purple-600 mr-2">•</span>
        <span>${ref.author} - <em>${titleHTML}</em> (${ref.publisher})</span>
      </li>
    `;
  }).join('');
  
  return `
    <div class="bg-white rounded-2xl shadow-xl p-8 mb-12 relative card-hover transition-all duration-300 hover:shadow-2xl" style="z-index: 1;">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50 pointer-events-none"></div>
      <div class="relative z-10">
        <div class="flex items-center mb-6">
          <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mr-4 transform transition duration-300 hover:scale-110">
            <i class="fas fa-bookmark text-2xl text-purple-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 tracking-tight">References</h3>
        </div>
        <div>
          <h4 class="font-semibold text-lg text-gray-800 mb-4 border-b border-purple-200 pb-2">Textbooks</h4>
          <ul class="space-y-3 text-gray-600">
            ${referencesHTML}
          </ul>
        </div>
      </div>
    </div>
  `;
}

// Render all sections dynamically
function renderDynamicSections(sections) {
  const sectionsHTML = Object.entries(sections).map(([key, section]) => {
    return renderSection(key, section);
  }).join('');
  
  return `<div class="space-y-8">${sectionsHTML}</div>`;
}

// Render a single section dynamically
function renderSection(key, section) {
  const itemsHTML = section.items.map(item => renderItem(item, section.fields)).join('');
  
  return `
    <div id="${key}" class="hidden bg-white rounded-xl shadow-lg p-8">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i class="fas ${section.icon} text-${section.color}-600 mr-3"></i>
        ${section.title}
      </h3>
      <div class="space-y-4">
        ${itemsHTML}
      </div>
    </div>
  `;
}

// Render a single item based on field definitions
function renderItem(item, fields) {
  let headerHTML = '';
  let contentHTML = '';
  let buttonsHTML = '';
  
  fields.forEach(field => {
    const value = item[field.name];
    
    if (field.type === 'heading' || (field.prefix && field.name === 'number')) {
      // Main heading
      const prefix = item.prefix || field.prefix || '';
      const displayValue = field.name === 'number' ? `${prefix} ${value}` : value;
      const titlePart = item.title ? `: ${item.title}` : '';
      headerHTML = `<h4 class="font-semibold text-lg text-gray-800">${displayValue}${titlePart}</h4>`;
    } else if (field.type === 'text') {
      // Regular text content
      if (value) {
        contentHTML += `<p class="text-gray-600 text-sm">${value}</p>`;
      }
    } else if (field.type === 'badge') {
      // Badge with icon (for dates, deadlines, etc.)
      if (value) {
        const prefix = field.prefix ? field.prefix + ' ' : '';
        contentHTML += `
          <div class="flex items-center mt-2">
            <i class="fas ${field.icon} text-${field.iconColor}-500 mr-2"></i>
            <span class="text-${field.iconColor}-600 font-medium">${prefix}${value}</span>
          </div>
        `;
      }
    } else if (field.type === 'button') {
      // Action buttons (download, view, etc.)
      if (value) {
        buttonsHTML += `
          <a href="${value}" target="_blank"
            class="bg-${field.buttonColor}-600 text-white px-4 py-2 rounded-lg hover:bg-${field.buttonColor}-700 transition duration-300 text-sm">
            <i class="fas fa-download mr-1"></i> ${item.buttonLabel || field.label}
          </a>
        `;
      } else if (field.optional) {
        // Show locked button if optional and not available
        buttonsHTML += `
          <span class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
            <i class="fas fa-lock mr-1"></i> ${field.lockedText || field.label}
          </span>
        `;
      }
    }
  });
  
  return `
    <div class="border rounded-lg p-6 hover:shadow-md transition duration-300">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          ${headerHTML}
          ${contentHTML}
        </div>
        ${buttonsHTML ? `<div class="flex space-x-3 mt-4 md:mt-0">${buttonsHTML}</div>` : ''}
      </div>
    </div>
  `;
}

// Render back button
function renderBackButton() {
  return `
    <div class="text-center mt-12">
      <a href="../"
        class="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-full hover:from-green-600 hover:to-green-700 transition duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        <i class="fas fa-arrow-left mr-2"></i>
        Back to all Courses
      </a>
    </div>
  `;
}

// Shared site footer (defined in assets/js/site-layout.js)
function renderFooter() {
  return '<site-footer></site-footer>';
}

// Initialize toggle functionality
function initializeToggles(data) {
  window.toggleSection = function(sectionId) {
    const sections = Object.keys(data.sections);
    
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element && id !== sectionId) {
        element.classList.add('hidden');
      }
    });

    const targetSection = document.getElementById(sectionId);
    targetSection.classList.toggle('hidden');

    if (!targetSection.classList.contains('hidden')) {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };
}