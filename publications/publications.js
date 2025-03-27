const firebaseConfig = {
  apiKey: "AIzaSyACGMnModEH-dUeFRzA_rnnAL-zoccdw90",
  authDomain: "add-publication.firebaseapp.com",
  projectId: "add-publication",
  storageBucket: "add-publication.appspot.com",
  messagingSenderId: "449539950324",
  appId: "1:449539950324:web:74e4f3584e68502a2d00a1"
};

let allPublications = [];

async function loadPublications() {
  try {
    // Dynamically import Firebase
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js');
    const { getFirestore, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Load from Firestore
    const querySnapshot = await getDocs(collection(db, "publications"));
    const firebaseData = { publications: {} };
    
    querySnapshot.forEach((doc) => {
      firebaseData.publications[doc.id] = doc.data().items;
    });
    
    window.publicationsData = firebaseData.publications;
    allPublications = [
      ...(firebaseData.publications.preprints || []),
      ...(firebaseData.publications.accepted || []),
      ...(firebaseData.publications.thesis || []),
      ...(firebaseData.publications.notes || [])
    ];
    
    return true;
  } catch (error) {
    console.error("Firebase load failed:", error);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  window.scrollTo(0, 0);
  history.scrollRestoration = 'manual';

  const success = await loadPublications();
  
  if (!success) {
    document.getElementById('publications-container').innerHTML = `
      <div class="text-red-600 p-4 bg-red-50 rounded-lg">
        Error loading publications. Please refresh the page.
      </div>
    `;
    return;
  }

  // Initialize components
  renderPublications(window.publicationsData);
  initModals();
  initSearch();
  initTagFilter();
  initPagination();
});

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const resultsCount = document.getElementById('searchResultsCount');
  
  if (!searchInput) return;

  // Store original publication elements for resetting
  const originalSections = {
    preprints: document.querySelector('#preprints-section .publications-list').innerHTML,
    accepted: document.querySelector('#accepted-section .publications-list').innerHTML,
    thesis: document.querySelector('#thesis-section .publications-list').innerHTML,
    notes: document.querySelector('#notes-section .publications-list').innerHTML
  };

  searchInput.addEventListener('input', debounce(handleSearch, 300));
  clearSearch.addEventListener('click', resetSearch);

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    clearSearch.classList.toggle('hidden', !query);
    
    if (!query) {
      resetSearch();
      return;
    }

    // Search through all publications
    let resultCount = 0;
    
    // Process each category
    Object.keys(window.publicationsData).forEach(category => {
      const section = document.querySelector(`#${category}-section`);
      const list = section.querySelector('.publications-list');
      let hasMatches = false;
      
      // Hide the entire section if it has no publications
      if (!window.publicationsData[category] || window.publicationsData[category].length === 0) {
        section.style.display = 'none';
        return;
      }
      
      // Clear current content
      list.innerHTML = '';
      
      // Filter and render matching publications
      window.publicationsData[category].forEach(pub => {
        const searchText = `${pub.title} ${pub.authors || ''} ${pub.abstract || ''}`.toLowerCase();
        if (searchText.includes(query)) {
          const pubElement = createPublicationElement(category, pub);
          
          // Highlight matching text in title and authors
          highlightText(pubElement, query);
          
          list.appendChild(pubElement);
          hasMatches = true;
          resultCount++;
        }
      });
      
      // Show/hide section based on matches
      section.style.display = hasMatches ? '' : 'none';
      
      // Show/hide section header if no matches
      const header = section.querySelector('h3');
      if (header) {
        header.style.display = hasMatches ? '' : 'none';
      }
    });
    
    updateResultsCount(resultCount);
    resetPagination();
  }

  function highlightText(element, query) {
    // Highlight in title
    const title = element.querySelector('h4');
    if (title) {
      title.innerHTML = title.textContent.replace(
        new RegExp(query, 'gi'),
        match => `<span class="highlight">${match}</span>`
      );
    }
    
    // Highlight in authors
    const authors = element.querySelector('.font-medium');
    if (authors) {
      authors.innerHTML = authors.textContent.replace(
        new RegExp(query, 'gi'),
        match => `<span class="highlight">${match}</span>`
      );
    }
  }

  function updateResultsCount(count) {
    const resultsCount = document.getElementById('searchResultsCount');
    if (!resultsCount) return;
    
    resultsCount.textContent = `${count} publication${count !== 1 ? 's' : ''} found`;
    resultsCount.classList.toggle('hidden', count === 0);
  }

  function resetSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const resultsCount = document.getElementById('searchResultsCount');
    
    if (!searchInput) return;
    
    searchInput.value = '';
    if (clearSearch) clearSearch.classList.add('hidden');
    if (resultsCount) resultsCount.classList.add('hidden');
    
    // Restore original sections
    Object.keys(originalSections).forEach(category => {
      const section = document.querySelector(`#${category}-section`);
      if (section) {
        section.style.display = '';
        const list = section.querySelector('.publications-list');
        if (list) list.innerHTML = originalSections[category];
        
        // Restore section header visibility
        const header = section.querySelector('h3');
        if (header) header.style.display = '';
      }
    });
  }
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function initTagFilter() {
  const tagButtons = document.querySelectorAll('.tag-filter');
  if (!tagButtons.length) return;

  tagButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.dataset.tag;
      filterByTag(tag);
      
      // Update active state
      tagButtons.forEach(btn => {
        btn.classList.toggle('bg-indigo-100', btn.dataset.tag === tag);
        btn.classList.toggle('bg-gray-100', btn.dataset.tag !== tag);
      });
    });
  });
}

function filterByTag(tag) {
  if (tag === 'all') {
    renderPublications(window.publicationsData);
    return;
  }

  const filteredData = {
    preprints: window.publicationsData.preprints?.filter(pub => pub.tags?.includes(tag)) || [],
    accepted: window.publicationsData.accepted?.filter(pub => pub.tags?.includes(tag)) || [],
    thesis: window.publicationsData.thesis?.filter(pub => pub.tags?.includes(tag)) || [],
    notes: window.publicationsData.notes?.filter(pub => pub.tags?.includes(tag)) || []
  };

  renderPublications(filteredData);
}

function initPagination() {
  // Wait for DOM to be ready
  setTimeout(() => {
    document.querySelectorAll('[id$="-section"]').forEach(section => {
      const container = section.querySelector('.publications-list');
      if (!container) return;
      
      const items = container.children;
      if (items.length <= 5) return;
      
      const pagination = section.querySelector('.pagination-section');
      if (!pagination) return;
      
      pagination.classList.remove('hidden');
      setupSectionPagination(section);
    });
  }, 50);
}

function setupSectionPagination(section) {
  const container = section.querySelector('.publications-list');
  const items = container.children;
  const pagination = section.querySelector('.pagination-section');
  
  let currentPage = 1;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Create page numbers
  const numbersContainer = pagination.querySelector('.pagination-numbers');
  numbersContainer.innerHTML = '';
  
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `h-10 w-10 flex items-center justify-center rounded-lg border transition-all duration-200 ${
      i === 1 
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
    }`;
    pageBtn.textContent = i;
    numbersContainer.appendChild(pageBtn);
  }

  // Update visibility function with scroll behavior
  const updateVisibility = (shouldScroll = true) => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    
    Array.from(items).forEach((item, idx) => {
      item.classList.toggle('hidden', idx < startIdx || idx >= endIdx);
    });
    
    // Update active page style
    numbersContainer.querySelectorAll('button').forEach((btn, idx) => {
      btn.className = `h-10 w-10 flex items-center justify-center rounded-lg border transition-all duration-200 ${
        idx + 1 === currentPage
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
      }`;
    });
    
    // Update button states
    pagination.querySelector('.pagination-prev').disabled = currentPage === 1;
    pagination.querySelector('.pagination-next').disabled = currentPage === totalPages;
    
    // Scroll to section top when paginating (not on initial load)
    if (shouldScroll) {
      setTimeout(() => {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 10);
    }
  };

  // Event listeners with scroll
  pagination.querySelector('.pagination-prev').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      updateVisibility();
    }
  });
  
  pagination.querySelector('.pagination-next').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      updateVisibility();
    }
  });
  
  numbersContainer.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = parseInt(btn.textContent);
      updateVisibility();
    });
  });
  
  // Initial update without scroll
  updateVisibility(false);
}

function resetPagination() {
  document.querySelectorAll('.pagination-section').forEach(section => {
    section.classList.add('hidden');
  });
  initPagination();
}

function renderPublications(publications) {
  const sections = {
    preprints: document.querySelector('#preprints-section .publications-list'),
    accepted: document.querySelector('#accepted-section .publications-list'),
    thesis: document.querySelector('#thesis-section .publications-list'),
    notes: document.querySelector('#notes-section .publications-list')
  };

  // Clear existing content (if any)
  Object.values(sections).forEach(section => {
    if (section) section.innerHTML = '';
  });

  // Render each category
  renderCategory('preprints', publications.preprints, sections.preprints);
  renderCategory('accepted', publications.accepted, sections.accepted);
  renderCategory('thesis', publications.thesis, sections.thesis);
  renderCategory('notes', publications.notes, sections.notes);
}


function renderCategory(type, items, container) {
  if (!items || !container) return;

  items.forEach(item => {
    const publicationElement = createPublicationElement(type, item);
    container.appendChild(publicationElement);
  });
}

function createPublicationElement(type, pub) {
  // Parse authors and image if they're in JSON format
  let authors = pub.authors;
  let image = pub.image;
  
  if (typeof authors === 'string' && authors.startsWith('[')) {
    try {
      authors = JSON.parse(authors).map(a => a.value).join(', ');
    } catch (e) {
      console.error("Error parsing authors:", e);
    }
  }
  
  if (typeof image === 'string' && image.startsWith('[')) {
    try {
      image = JSON.parse(image)[0].value;
    } catch (e) {
      console.error("Error parsing image path:", e);
    }
  }

  const element = document.createElement('div');
  element.className = 'bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg';
  element.innerHTML = `
    <div class="flex flex-col md:flex-row">
      <div class="md:w-48 flex-shrink-0 mb-6 md:mb-0 md:mr-8 flex items-start">
        <img src="${image || '../assets/img/default.svg'}" alt="${type}" class="w-36 h-auto object-contain">
      </div>
      <div class="flex-grow">
        <h4 class="text-xl font-semibold text-gray-900 mb-3"></h4>
        ${renderAuthors(pub, authors)}
        ${renderJournalInfo(pub)}
        ${renderYearInfo(pub)}
        
        <div class="flex flex-wrap gap-3 mt-4">
          ${renderButtons(type, pub)}
        </div>
      </div>
    </div>
  `;

  const titleElement = element.querySelector('h4');
  const titleSpan = document.createElement('span');
  titleSpan.innerHTML = pub.title || '';
  titleElement.appendChild(titleSpan);
  
  // Process MathJax if available
  if (window.MathJax) {
    MathJax.typesetPromise([titleElement]).catch(err => console.log('MathJax typeset error:', err));
  }
  return element;
}

function renderAuthors(pub, formattedAuthors) {
  if (!pub.authors && !pub.supervisor) return '';
  
  if (pub.type === 'thesis' && pub.supervisor) {
    return `
      <p class="mb-2">
        <span class="text-gray-600">Supervisor: </span>
        <span class="font-medium">Somnath Basu</span>
      </p>
      ${pub.defenseDate ? `
        <p class="mb-2">
          <span class="text-gray-600">Date of defense: </span>
          <span class="font-medium">${pub.defenseDate}</span>
        </p>
      ` : ''}
    `;
  }
  
  // For regular publications
  let authorsText = formattedAuthors || pub.authors || '';
  authorsText = authorsText.replace(
    /(Sachchidanand\s+Prasad|Prasad,\s*Sachchidanand)/gi,
    '<span class="font-bold text-indigo-700">$1</span>'
  );
  
  return `
    <p class="mb-2">
      <span class="text-gray-600">${pub.supervisor ? 'Supervisor' : 'Authors'}: </span>
      <span class="font-medium">${formattedAuthors || pub.supervisor}</span>
    </p>
  `;
}

function renderJournalInfo(pub) {
  if (!pub.journal) return '';
  return `
    <p class="mb-2">
      <span class="text-gray-600">Journal: </span>${pub.journal}
    </p>
  `;
}

function renderYearInfo(pub) {
  let info = '';
  
  if (pub.year) info += `<p class="text-gray-400 text-sm mb-1">Year: ${pub.year}</p>`;
  if (pub.arxivYear) info += `<p class="text-gray-400 text-sm mb-1">arXiv: ${pub.arxivYear}</p>`;
  if (pub.acceptYear) info += `<p class="text-gray-400 text-sm mb-1">Accepted: ${pub.acceptYear}</p>`;
  if (pub.pubYear) info += `<p class="text-gray-400 text-sm mb-1">Published: ${pub.pubYear}</p>`;
  
  if (pub.volume || pub.issue || pub.pages) {
    info += `<p class="text-gray-400 text-sm mb-1">`;
    if (pub.volume) info += `Vol. ${pub.volume}`;
    if (pub.issue) info += `, No. ${pub.issue}`;
    if (pub.pages) info += `, pp. ${pub.pages}`;
    info += `</p>`;
  }
  
  if (pub.doi) info += `<p class="text-gray-400 text-sm mb-1">doi.org/${pub.doi}</p>`;
  
  return info;
}

function renderButtons(type, pub) {
  let buttons = '';
  
  // Abstract button
  if (pub.abstract) {
    buttons += `
      <button class="abstract-button bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
              data-paper="${pub.id}">
        Abstract
      </button>
    `;
  }
  
  // BibTeX button
  if (pub.bibtex) {
    buttons += `
      <button class="bib-button bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
              data-paper="${pub.id}">
        BibTeX
      </button>
    `;
  }
  
  // Links
  if (pub.links) {
    for (const [text, url] of Object.entries(pub.links)) {
      buttons += `
        <a href="${url}" target="_blank" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
          ${text}
        </a>
      `;
    }
  }
  
  // DOI
  if (pub.doi) {
    buttons += `
      <a href="https://doi.org/${pub.doi}" target="_blank" 
         class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
        Journal
      </a>
    `;
  }

  return buttons;
}

function initModals() {
  // Modal elements
  const abstractModal = document.getElementById('abstractModal');
  const bibModal = document.getElementById('bibModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const bibContent = document.getElementById('bibContent');
  const closeAbstractModal = document.getElementById('closeAbstractModal');
  const closeBibModal = document.getElementById('closeBibModal');
  const copyBibButton = document.getElementById('copyBib');

  let currentBibtex = '';
  let copyFeedbackTimeout = null;

  // Event delegation for buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('abstract-button')) {
      handleAbstractClick(e.target);
    } else if (e.target.classList.contains('bib-button')) {
      handleBibClick(e.target);
    }
  });

  const handleAbstractClick = (button) => {
    const pub = findPublicationById(button.dataset.paper);
    if (!pub?.abstract) return;
    
    modalTitle.textContent = 'Abstract';
    modalContent.innerHTML = `<p class="text-gray-700 leading-relaxed">${pub.abstract}</p>`;
    abstractModal.classList.remove('hidden');
    
    if (typeof MathJax !== 'undefined') {
      MathJax.typesetPromise([modalContent]).catch(console.error);
    }
  };

  const handleBibClick = (button) => {
    const pub = findPublicationById(button.dataset.paper);
    if (!pub?.bibtex) return;
    
    currentBibtex = pub.bibtex;
    bibContent.textContent = currentBibtex;
    bibModal.classList.remove('hidden');
    resetCopyButton();
  };

  // Modal close handlers
  const closeModals = () => {
    abstractModal.classList.add('hidden');
    bibModal.classList.add('hidden');
    if (copyFeedbackTimeout) clearTimeout(copyFeedbackTimeout);
  };

  [closeAbstractModal, closeBibModal].forEach(btn => {
    btn.addEventListener('click', closeModals);
  });

  window.addEventListener('click', (e) => {
    if (e.target === abstractModal || e.target === bibModal) {
      closeModals();
    }
  });

  // Copy functionality
  copyBibButton.addEventListener('click', async () => {
    if (!currentBibtex) return;
    
    try {
      await navigator.clipboard.writeText(currentBibtex);
      showCopyFeedback(true);
    } catch (err) {
      console.error('Clipboard API error:', err);
      attemptLegacyCopy();
    }
  });

  const attemptLegacyCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = currentBibtex;
    textarea.style.position = 'fixed';  // Prevent scrolling
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const success = document.execCommand('copy');
      showCopyFeedback(success);
    } catch (err) {
      console.error('Legacy copy failed:', err);
      showCopyFeedback(false);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  // Feedback functions
  const resetCopyButton = () => {
    copyBibButton.innerHTML = 'Copy BibTeX';
    copyBibButton.className = 'px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors';
    copyBibButton.disabled = false;
  };

  const showCopyFeedback = (success) => {
    copyBibButton.innerHTML = success ? '✓ Copied!' : '✗ Failed to copy';
    copyBibButton.className = `px-4 py-2 rounded transition-colors ${
      success ? 'bg-green-600' : 'bg-red-600'
    } text-white`;
    copyBibButton.disabled = true;
    
    if (copyFeedbackTimeout) clearTimeout(copyFeedbackTimeout);
    copyFeedbackTimeout = setTimeout(resetCopyButton, 2000);
  };

  // Keyboard handling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModals();
  });
}


function findPublicationById(id) {
  if (!window.publicationsData) return null;
  
  // Search through all publication categories
  const allPublications = [
    ...(window.publicationsData.preprints || []),
    ...(window.publicationsData.accepted || []),
    ...(window.publicationsData.thesis || []),
    ...(window.publicationsData.notes || [])
  ];
  
  return allPublications.find(pub => pub.id === id);
}

function showCopyFeedback(button, success) {
  const originalText = button.textContent;
  const originalClass = 'bg-indigo-600 hover:bg-indigo-700';
  const newClass = success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';
  
  button.textContent = success ? 'Copied!' : 'Failed to copy';
  button.classList.remove(originalClass);
  button.classList.add(newClass);
  
  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove(newClass);
    button.classList.add(originalClass);
  }, 2000);
}