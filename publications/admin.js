import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getFirestore, collection, doc, setDoc, getDocs, deleteDoc 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { 
  getAuth, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyACGMnModEH-dUeFRzA_rnnAL-zoccdw90",
  authDomain: "add-publication.firebaseapp.com",
  projectId: "add-publication",
  storageBucket: "add-publication.appspot.com",
  messagingSenderId: "449539950324",
  appId: "1:449539950324:web:74e4f3584e68502a2d00a1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const publicationList = document.getElementById('publicationList');
const publicationForm = document.getElementById('publicationForm');
const formContainer = document.getElementById('formContainer');
const formTitle = document.getElementById('formTitle');
const addNewBtn = document.getElementById('addNewBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addLinkBtn = document.getElementById('addLinkBtn');
const linkFields = document.getElementById('linkFields');
const logoutBtn = document.getElementById('logoutBtn');
const statusMessage = document.getElementById('statusMessage');

// Global variables
let publicationsData = {};
let currentUser = null;
let sortableInstances = {};

// Initialize
checkAuth();

// Authentication
function checkAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    } else {
      currentUser = user;
      loadPublications();
      document.body.style.display = 'block';
    }
  });
}

// Firestore Operations
async function loadPublications() {
  try {
    showStatus("Loading publications...", "blue");
    
    const querySnapshot = await getDocs(collection(db, "publications"));
    publicationsData = {};
    
    querySnapshot.forEach((doc) => {
      publicationsData[doc.id] = doc.data().items;
    });
    
    renderPublicationList();
    showStatus("Publications loaded", "green");
  } catch (error) {
    showStatus("Error loading: " + error.message, "red");
  }
}

async function savePublication(pubData) {
  try {
    showStatus("Saving publication...", "blue");
    
    const pubType = pubData.type;
    const pubId = pubData.id;
    
    if (!publicationsData[pubType]) {
      publicationsData[pubType] = [];
    }
    
    const existingIndex = publicationsData[pubType].findIndex(p => p.id === pubId);
    if (existingIndex >= 0) {
      publicationsData[pubType][existingIndex] = pubData;
    } else {
      publicationsData[pubType].push(pubData);
    }
    
    await setDoc(doc(db, "publications", pubType), {
      items: publicationsData[pubType]
    });
    
    showStatus("Publication saved successfully!", "green");
    return true;
  } catch (error) {
    showStatus("Error saving: " + error.message, "red");
    return false;
  }
}

async function deletePublication(pubId, pubType) {
  if (!confirm("Are you sure you want to delete this publication?")) return;
  
  try {
    showStatus("Deleting publication...", "blue");
    
    publicationsData[pubType] = publicationsData[pubType].filter(
      p => p.id !== pubId
    );
    
    await setDoc(doc(db, "publications", pubType), {
      items: publicationsData[pubType]
    });
    
    showStatus("Publication deleted", "green");
    renderPublicationList();
  } catch (error) {
    showStatus("Error deleting: " + error.message, "red");
  }
}

// UI Rendering
function renderPublicationList() {
  publicationList.innerHTML = '';
  
  if (!publicationsData || Object.keys(publicationsData).length === 0) {
    publicationList.innerHTML = '<p class="text-gray-500">No publications found</p>';
    return;
  }
  
  // Destroy existing Sortable instances
  Object.values(sortableInstances).forEach(instance => instance.destroy());
  sortableInstances = {};
  
  Object.entries(publicationsData).forEach(([type, pubs]) => {
    if (!pubs || pubs.length === 0) return;
    
    const typeContainer = document.createElement('div');
    typeContainer.className = 'publication-type-container mb-6';
    
    const typeHeader = document.createElement('h3');
    typeHeader.className = 'text-lg text-sky-600 font-bold mb-2';
    typeHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeContainer.appendChild(typeHeader);
    
    const pubListContainer = document.createElement('div');
    pubListContainer.className = 'publication-list space-y-2';
    pubListContainer.id = `pub-list-${type}`;
    
    pubs.forEach((pub, index) => {
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

      const pubElement = document.createElement('div');
      pubElement.className = 'publication-item bg-white p-4 rounded-lg border border-gray-200 cursor-move';
      pubElement.dataset.id = pub.id;
      
      // Create a span for the title to preserve MathJax delimiters
      const titleSpan = document.createElement('span');
      titleSpan.innerHTML = pub.title || '';
      
      pubElement.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium"></h3>
            <p class="text-sm text-gray-600">${authors || ''}</p>
            <p class="text-xs text-gray-500 mt-1">${pub.year || ''} ${pub.journal ? '• ' + pub.journal : ''}</p>
          </div>
          <div class="flex items-center space-x-2">
            ${image ? `<img src="${image}" alt="Publication logo" class="h-8 mr-2">` : ''}
            <button class="edit-btn px-3 py-1 text-sm bg-gray-200 rounded-md" 
                    data-id="${pub.id}" data-type="${type}">Edit</button>
            <button class="delete-btn px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md" 
                    data-id="${pub.id}" data-type="${type}">Delete</button>
          </div>
        </div>
      `;
      
      // Append the title span separately to preserve MathJax delimiters
      pubElement.querySelector('h3').appendChild(titleSpan);
      pubListContainer.appendChild(pubElement);
    });
    
    typeContainer.appendChild(pubListContainer);
    publicationList.appendChild(typeContainer);
    
    // Initialize Sortable for this publication type
    sortableInstances[type] = new Sortable(pubListContainer, {
      animation: 150,
      handle: '.publication-item',
      onEnd: async function() {
        await updatePublicationOrder(type);
      }
    });
  });
  
  // Add event listeners
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
  
  // Trigger MathJax typesetting after rendering
  if (window.MathJax) {
    MathJax.typesetPromise().catch(err => console.log('MathJax typeset error:', err));
  }
}

async function updatePublicationOrder(pubType) {
  try {
    const pubList = document.getElementById(`pub-list-${pubType}`);
    const newOrder = Array.from(pubList.children).map(el => el.dataset.id);
    
    // Reorder the publications array
    publicationsData[pubType].sort((a, b) => {
      return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
    });
    
    // Save to Firestore
    await setDoc(doc(db, "publications", pubType), {
      items: publicationsData[pubType]
    });
    
    showStatus("Publication order updated", "green");
  } catch (error) {
    console.error("Error updating order:", error);
    showStatus("Error updating order: " + error.message, "red");
    // Re-render to reset if there was an error
    renderPublicationList();
  }
}

// Form Handling
function showForm() {   
    formContainer.classList.remove('hidden');
    document.getElementById('formScrollTarget').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
}

function hideForm() {
  formContainer.classList.add('hidden');
  publicationForm.reset();
  linkFields.innerHTML = '';
  document.getElementById('publicationId').value = '';
}

function addLinkField(name = '', url = '') {
  const linkId = Date.now();
  const linkField = document.createElement('div');
  linkField.className = 'flex space-x-2 items-center';
  linkField.innerHTML = `
    <input type="text" placeholder="Link name" value="${name}" 
           class="link-name flex-1 rounded-md border-gray-300 shadow-sm">
    <input type="text" placeholder="URL" value="${url}" 
           class="link-url flex-1 rounded-md border-gray-300 shadow-sm">
    <button type="button" class="remove-link px-2 text-red-600 hover:text-red-800">
      ×
    </button>
  `;
  linkFields.appendChild(linkField);
  
  linkField.querySelector('.remove-link').addEventListener('click', () => {
    linkField.remove();
  });
}

// Event Handlers
function handleSubmit(e) {
  e.preventDefault();
  
  const formData = {
    id: document.getElementById('publicationId').value || `pub-${Date.now()}`,
    type: document.getElementById('pubType').value,
    title: document.getElementById('pubTitle').value,
    authors: document.getElementById('pubAuthors').value,
    year: document.getElementById('pubYear').value,
    journal: document.getElementById('pubJournal').value,
    arxivYear: document.getElementById('pubArxivYear').value,
    acceptYear: document.getElementById('pubAcceptYear').value,
    pubYear: document.getElementById('pubPubYear').value,
    volume: document.getElementById('pubVolume').value,
    issue: document.getElementById('pubIssue').value,
    pages: document.getElementById('pubPages').value,
    doi: document.getElementById('pubDoi').value,
    tags: document.getElementById('pubTags').value.split(',').map(tag => tag.trim()),
    abstract: document.getElementById('pubAbstract').value,
    links: {},
    image: document.getElementById('pubImage').value || '../assets/img/default.svg',
    bibtex: document.getElementById('pubBibtex').value
  };
  
  // Process links
  document.querySelectorAll('#linkFields > div').forEach(linkField => {
    const name = linkField.querySelector('.link-name').value;
    const url = linkField.querySelector('.link-url').value;
    if (name && url) {
      formData.links[name] = url;
    }
  });
  
  savePublication(formData).then(success => {
    if (success) {
      renderPublicationList();
      hideForm();
    }
  });
}

function handleEdit(e) {
  const pubId = e.target.dataset.id;
  const pubType = e.target.dataset.type;
  const publication = publicationsData[pubType].find(p => p.id === pubId);
  
  if (!publication) return;
  
  // Parse authors and image if they're in JSON format
  let authors = publication.authors;
  let image = publication.image;
  
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

  // Fill form
  document.getElementById('pubType').value = pubType;
  document.getElementById('pubTitle').value = publication.title;
  document.getElementById('pubAuthors').value = authors || '';
  document.getElementById('pubJournal').value = publication.journal || '';
  document.getElementById('pubTags').value = publication.tags?.join(', ') || '';
  document.getElementById('pubAbstract').value = publication.abstract || '';
  document.getElementById('publicationId').value = publication.id;
  document.getElementById('pubImage').value = image || '';
  document.getElementById('pubBibtex').value = publication.bibtex || '';
  document.getElementById('pubArxivYear').value = publication.arxivYear || '';
  document.getElementById('pubAcceptYear').value = publication.acceptYear || '';
  document.getElementById('pubPubYear').value = publication.pubYear || '';
  document.getElementById('pubVolume').value = publication.volume || '';
  document.getElementById('pubIssue').value = publication.issue || '';
  document.getElementById('pubPages').value = publication.pages || '';
  document.getElementById('pubDoi').value = publication.doi || '';
  
  // Clear and rebuild link fields
  linkFields.innerHTML = '';
  if (publication.links) {
    Object.entries(publication.links).forEach(([name, url]) => {
      addLinkField(name, url);
    });
  }
  
  formTitle.textContent = 'Edit Publication';
  showForm();
}

function handleDelete(e) {
  const pubId = e.target.dataset.id;
  const pubType = e.target.dataset.type;
  deletePublication(pubId, pubType);
}

function showStatus(message, color = "blue") {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800"
  };
  
  statusMessage.className = `${colors[color]} p-3 rounded mb-4`;
  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden");
  
  setTimeout(() => {
    statusMessage.classList.add("hidden");
  }, 5000);
}

// Event Listeners
addNewBtn.addEventListener('click', () => {
  formTitle.textContent = 'Add New Publication';
  showForm();
});

cancelBtn.addEventListener('click', hideForm);

addLinkBtn.addEventListener('click', () => {
  addLinkField();
});

publicationForm.addEventListener('submit', handleSubmit);

logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});