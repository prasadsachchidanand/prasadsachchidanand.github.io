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

// Render navigation bar
function renderNavbar() {
  return `
    <div class="fixed inset-x-0 left-0 right-0 w-full text-gray-700 bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800 z-10">
      <div x-data="{ open: false }"
        class="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div class="p-4 flex flex-row items-center justify-between">
          <a href="../../"
            class="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">
            Sachchidanand Prasad
          </a>
          <button class="md:hidden rounded-lg focus:outline-none focus:shadow-outline" @click="open = !open">
            <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
              <path x-show="!open" fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                clip-rule="evenodd"></path>
              <path x-show="open" fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <nav :class="{'flex': open, 'hidden': !open}"
          class="flex-col flex-grow pb-4 md:pb-0 hidden md:flex md:justify-end md:flex-row">
          <a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            href="../../">Home</a>
          <a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            href="../../research/">Research</a>
          <a class="px-4 py-2 mt-2 text-sm font-semibold bg-gray-200 text-gray-900 rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            href="../../teaching/">Teaching</a>
          <a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            href="../../resume/">CV</a>
          <a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            href="../../publications/">Publications</a>
          <a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            href="../../miscellaneous/">Miscellaneous</a>
          <a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            href="../../contact/">Contact</a>
        </nav>
      </div>
    </div>
  `;
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
  return `
        ${renderGradingBreakdown(data.grading)}
        ${renderResourceCards(data.sections)}
        ${renderReferences(data.references)}
        ${renderDynamicSections(data.sections)}
        ${renderBackButton()}
      </div>
    </section>
  `;
}

// Render grading breakdown with single stacked bar
function renderGradingBreakdown(grading) {
  const colors = {
    'Assignments': 'green',
    'Quizzes': 'yellow',
    'Presentation': 'blue',
    'End Sem': 'red',
    'Midterm': 'orange',
    'Projects': 'purple'
  };
  
  // Create the stacked bar segments with labels inside
  const barSegments = Object.entries(grading).map(([name, percentage]) => {
    const color = colors[name] || 'gray';
    return `
      <div class="bg-${color}-500 flex flex-col items-center justify-center text-white py-4 px-2 border-r border-${color}-600 last:border-r-0"
           style="width: ${percentage}%">
        <div class="font-bold text-sm sm:text-base whitespace-nowrap">${name}</div>
        <div class="text-lg sm:text-xl font-bold">${percentage}%</div>
      </div>
    `;
  }).join('');
  
  return `
    <div class="bg-white rounded-xl shadow-lg p-6 mb-10 card-hover">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i class="fas fa-chart-pie text-purple-600 mr-3"></i>
        Grading Breakdown
      </h2>
      
      <!-- Single Stacked Bar -->
      <div class="flex w-full h-20 sm:h-24 rounded-lg overflow-hidden shadow-lg">
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
      const prefix = field.prefix || '';
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
            <i class="fas fa-download mr-1"></i> ${field.label}
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

// Render footer
function renderFooter() {
  // Generate the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  
  return `
    <footer class="foot mt-auto border-t border-gray-200">
      <div class="container px-4 py-4 mx-auto flex items-center sm:flex-row flex-col">
        <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © ${currentYear} Sachchidanand
        </p>
        <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          Last updated: ${currentDate}
        </p>
        <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <a class="text-gray-500 hover:text-blue-500" href="https://www.facebook.com/sachchidanand.prasad/" target="_blank">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
          <a class="ml-3 text-gray-500 hover:text-red-500" href="https://www.instagram.com/sachchidanand1729/" target="_blank">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a class="ml-3 text-gray-500 hover:text-blue-500" href="https://twitter.com/speinstene26" target="_blank">
            <i class="fa-brands fa-twitter"></i>
          </a>
          <a class="ml-3 text-gray-500 hover:text-purple-700" href="https://github.com/prasadsachchidanand" target="_blank">
            <i class="fa-brands fa-github"></i>
          </a>
          <a class="ml-3 text-gray-500 hover:text-green-500" href="https://www.researchgate.net/profile/Sachchidanand-Prasad-2" target="_blank">
            <i class="ai ai-researchgate ai-lg"></i>
          </a>
          <a class="ml-3 text-gray-500 hover:text-gray-900" href="https://nitrkl.academia.edu/SachchidanandPrasad" target="_blank">
            <i class="ai ai-academia"></i>
          </a>
        </span>
      </div>
      <hr class="py-1 w-1/4 m-auto">
      <div class="items-center">
        <p class="text-center">
          <span class="text-gray-500 text-sm mr-1">No of visitors: </span>
          <img src="https://counter.digits.net/?counter={ecc0f233-f3f7-d324-95c8-cc741ed787df}&COUNTER_TEMPLATE1&background=EDF2F7&foreground=8D8D8D"
            alt="Hit Counter by Digits" border="0" class="w-11 inline" />
          <span class="text-gray-500 text-sm ml-1">Counter provided by <a href="https://www.digits.net/" class="text-gray-400 hover:text-gray-500" target="_blank">Digits.Net</a></span>
        </p>
      </div>
    </footer>
  `;
}

// Initialize toggle functionality
function initializeToggles(data) {
  window.toggleSection = function(sectionId) {
    const sections = Object.keys(data.sections);
    
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (id !== sectionId) {
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