// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9-91ZVsGmS2PVLh2x_cV85w6-cUilXWY",
    authDomain: "journal-list-ea59a.firebaseapp.com",
    projectId: "journal-list-ea59a",
    storageBucket: "journal-list-ea59a.firebasestorage.app",
    messagingSenderId: "28898274318",
    appId: "1:28898274318:web:be4dc991ef744806a2a05f",
    measurementId: "G-NQBEKS47ZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global variables
let journals = [];
let filteredJournals = [];
let editingId = null;
let currentUser = null;
let currentPage = 1;
let journalsPerPage = 6;
let currentSearchTerm = '';
let currentSortBy = 'name';
let currentSortOrder = 'asc';

// Authentication functions
async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;
        showMessage('Login successful!', 'success');
        showMainApp();
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. ';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += 'User not found.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Incorrect password.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/too-many-requests':
                errorMessage += 'Too many failed attempts. Please try again later.';
                break;
            default:
                errorMessage += error.message;
        }
        showMessage(errorMessage, 'error');
    }
}

async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        showLoginForm();
        showMessage('Logged out successfully!', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Logout failed', 'error');
    }
}

// UI Control functions
function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'block'; // Change from 'flex' to 'block'
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function showMainApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    loadJournals();
}

// Search and filter functions
function filterJournals() {
    if (!currentSearchTerm.trim()) {
        filteredJournals = [...journals];
    } else {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredJournals = journals.filter(journal =>
            journal.name.toLowerCase().includes(searchLower) ||
            (journal.subjects && journal.subjects.some(subject =>
                subject.toLowerCase().includes(searchLower)
            )) ||
            (journal.MCQ && journal.MCQ.toLowerCase().includes(searchLower)) ||
            (journal.frequency && journal.frequency.toLowerCase().includes(searchLower))
        );
    }

    // Sort filtered results
    sortJournals();

    // Reset to first page when filtering
    currentPage = 1;
    displayJournals();
    updatePagination();
}

function sortJournals() {
    filteredJournals.sort((a, b) => {
        let aValue = a[currentSortBy] || '';
        let bValue = b[currentSortBy] || '';

        // Handle MCQ as number
        if (currentSortBy === 'MCQ') {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
        } else {
            aValue = aValue.toString().toLowerCase();
            bValue = bValue.toString().toLowerCase();
        }

        if (currentSortOrder === 'asc') {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
    });
}

// Pagination functions
function updatePagination() {
    const totalPages = Math.ceil(filteredJournals.length / journalsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '<div class="flex justify-center items-center space-x-2 mt-6">';

    // Previous button
    paginationHTML += `
<button onclick="changePage(${currentPage - 1})" 
    ${currentPage === 1 ? 'disabled' : ''} 
    class="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
Previous
</button>
`;

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)" class="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">1</button>`;
        if (startPage > 2) {
            paginationHTML += '<span class="px-2 text-gray-500">...</span>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
<button onclick="changePage(${i})" 
        class="px-3 py-2 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'} rounded">
    ${i}
</button>
`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="px-2 text-gray-500">...</span>';
        }
        paginationHTML += `<button onclick="changePage(${totalPages})" class="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">${totalPages}</button>`;
    }

    // Next button
    paginationHTML += `
<button onclick="changePage(${currentPage + 1})" 
    ${currentPage === totalPages ? 'disabled' : ''} 
    class="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
Next
</button>
`;

    paginationHTML += '</div>';

    // Add results info
    const start = (currentPage - 1) * journalsPerPage + 1;
    const end = Math.min(currentPage * journalsPerPage, filteredJournals.length);
    paginationHTML += `
<div class="text-center text-gray-600 mt-4">
Showing ${start}-${end} of ${filteredJournals.length} journals
</div>
`;

    paginationContainer.innerHTML = paginationHTML;
}

window.changePage = function (page) {
    const totalPages = Math.ceil(filteredJournals.length / journalsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayJournals();
        updatePagination();

        // Scroll to top of journals container
        document.getElementById('journalsContainer').scrollIntoView({ behavior: 'smooth' });
    }
};

window.changePageSize = function () {
    const select = document.getElementById('pageSize');
    journalsPerPage = parseInt(select.value);
    currentPage = 1;
    displayJournals();
    updatePagination();
};

// Parse copied data from MathSciNet
function parseCopiedData(data) {
    try {
        // Remove quotes and split by comma, handling quoted strings
        const parts = data.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!parts || parts.length < 6) {
            throw new Error('Invalid data format');
        }

        return {
            name: parts[0].replace(/"/g, ''),
            MCQ: parts[1].replace(/"/g, ''),
            frequency: parts[2].replace(/"/g, ''),
            subjects: parts.slice(3, -2).map(s => s.replace(/"/g, '')),
            mathSciNetUrl: parts[parts.length - 2].replace(/"/g, ''),
            journalUrl: parts[parts.length - 1].replace(/"/g, '')
        };
    } catch (error) {
        console.error('Error parsing data:', error);
        return null;
    }
}

// Add or update journal
async function saveJournal() {
    const name = document.getElementById('journalName').value.trim();
    const MCQ = document.getElementById('MCQ').value.trim();
    const frequency = document.getElementById('frequency').value.trim();
    const subjects = document.getElementById('subjects').value.trim();
    const mathSciNetUrl = document.getElementById('mathSciNetUrl').value.trim();
    const journalUrl = document.getElementById('journalUrl').value.trim();

    if (!name || !mathSciNetUrl) {
        showMessage('Journal name and MathSciNet URL are required', 'error');
        return;
    }

    const journalData = {
        name,
        MCQ,
        frequency,
        subjects: subjects.split(',').map(s => s.trim()).filter(s => s),
        mathSciNetUrl,
        journalUrl,
        editors: editingId ? journals.find(j => j.id === editingId)?.editors || [] : [],
        createdAt: editingId ? journals.find(j => j.id === editingId)?.createdAt : new Date(),
        userId: currentUser.uid
    };

    try {
        if (editingId) {
            await updateDoc(doc(db, 'journals', editingId), journalData);
            editingId = null;
            document.getElementById('saveBtn').textContent = 'Add Journal';
            document.getElementById('cancelBtn').style.display = 'none';
        } else {
            await addDoc(collection(db, 'journals'), journalData);
        }

        clearForm();
        loadJournals();
        showMessage('Journal saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving journal:', error);
        showMessage('Error saving journal', 'error');
    }
}

// Load journals from Firebase
async function loadJournals() {
    if (!currentUser) return;

    try {
        const q = query(collection(db, 'journals'), orderBy('name'));
        const querySnapshot = await getDocs(q);
        journals = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Only load journals for the current user
            if (data.userId === currentUser.uid) {
                journals.push({ id: doc.id, ...data });
            }
        });

        // Apply current filters and display
        filterJournals();
    } catch (error) {
        console.error('Error loading journals:', error);
        showMessage('Error loading journals', 'error');
    }
}

// Display journals with pagination
function displayJournals() {
    const container = document.getElementById('journalsContainer');
    container.innerHTML = '';

    if (filteredJournals.length === 0) {
        if (currentSearchTerm) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No journals found matching your search</p>';
        } else {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No journals added yet</p>';
        }
        return;
    }

    // Calculate pagination
    const startIndex = (currentPage - 1) * journalsPerPage;
    const endIndex = startIndex + journalsPerPage;
    const journalsToShow = filteredJournals.slice(startIndex, endIndex);

    journalsToShow.forEach(journal => {
        const journalDiv = document.createElement('div');
        journalDiv.className = 'bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow';

        journalDiv.innerHTML = `
<div class="flex justify-between items-start mb-4">
    <h3 class="text-xl font-bold text-gray-800">${journal.name}</h3>
    <div class="flex space-x-2">
        <button onclick="manageEditors('${journal.id}')" class="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Editors</button>
        <button onclick="editJournal('${journal.id}')" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
        <button onclick="deleteJournal('${journal.id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
    </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
        <span class="font-semibold text-gray-700">MCQ:</span>
        <span class="text-gray-600">${journal.MCQ || 'N/A'}</span>
    </div>
    <div>
        <span class="font-semibold text-gray-700">Frequency:</span>
        <span class="text-gray-600">${journal.frequency || 'N/A'}</span>
    </div>
</div>

${journal.subjects && journal.subjects.length > 0 ? `
    <div class="mb-4">
        <span class="font-semibold text-gray-700">Subjects:</span>
        <div class="flex flex-wrap gap-2 mt-2">
            ${journal.subjects.map(subject => `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${subject}</span>`).join('')}
        </div>
    </div>
` : ''}

${journal.editors && journal.editors.length > 0 ? `
    <div class="mb-4">
        <span class="font-semibold text-gray-700">Editors (${journal.editors.length}):</span>
        <div class="mt-2 space-y-1">
            ${journal.editors.slice(0, 3).map(editor => `
                <div class="flex items-center space-x-2">
                    <span class="text-gray-800">${editor.name}</span>
                    ${editor.mathSciNetUrl ? `<a href="${editor.mathSciNetUrl}" target="_blank" class="text-blue-600 hover:text-blue-800 text-xs underline">MathSciNet</a>` : ''}
                </div>
            `).join('')}
            ${journal.editors.length > 3 ? `<div class="text-gray-500 text-sm">and ${journal.editors.length - 3} more...</div>` : ''}
        </div>
    </div>
` : ''}

<div class="flex space-x-4">
    <a href="${journal.mathSciNetUrl}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">MathSciNet</a>
    ${journal.journalUrl ? `<a href="${journal.journalUrl}" target="_blank" class="text-green-600 hover:text-green-800 underline">Journal Website</a>` : ''}
</div>
`;

        container.appendChild(journalDiv);
    });
}

// Search and sort handlers
window.handleSearch = function () {
    const searchInput = document.getElementById('searchInput');
    currentSearchTerm = searchInput.value;
    filterJournals();
};

window.handleSort = function () {
    const sortSelect = document.getElementById('sortSelect');
    const [sortBy, sortOrder] = sortSelect.value.split('-');
    currentSortBy = sortBy;
    currentSortOrder = sortOrder;
    filterJournals();
};

window.clearSearch = function () {
    document.getElementById('searchInput').value = '';
    currentSearchTerm = '';
    filterJournals();
};

// Edit journal
window.editJournal = function (id) {
    const journal = journals.find(j => j.id === id);
    if (!journal) return;

    document.getElementById('journalName').value = journal.name;
    document.getElementById('MCQ').value = journal.MCQ || '';
    document.getElementById('frequency').value = journal.frequency || '';
    document.getElementById('subjects').value = journal.subjects ? journal.subjects.join(', ') : '';
    document.getElementById('mathSciNetUrl').value = journal.mathSciNetUrl;
    document.getElementById('journalUrl').value = journal.journalUrl || '';

    editingId = id;
    document.getElementById('saveBtn').textContent = 'Update Journal';
    document.getElementById('cancelBtn').style.display = 'inline-block';

    // Scroll to form
    document.getElementById('addForm').scrollIntoView({ behavior: 'smooth' });
};

// Delete journal
window.deleteJournal = async function (id) {
    if (!confirm('Are you sure you want to delete this journal?')) return;

    try {
        await deleteDoc(doc(db, 'journals', id));
        loadJournals();
        showMessage('Journal deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting journal:', error);
        showMessage('Error deleting journal', 'error');
    }
};

// Cancel editing
window.cancelEdit = function () {
    editingId = null;
    document.getElementById('saveBtn').textContent = 'Add Journal';
    document.getElementById('cancelBtn').style.display = 'none';
    clearForm();
};

// Manage editors
window.manageEditors = function (journalId) {
    const journal = journals.find(j => j.id === journalId);
    if (!journal) return;

    showEditorsModal(journal);
};

// Show editors modal
function showEditorsModal(journal) {
    const modal = document.getElementById('editorsModal');
    const modalTitle = document.getElementById('modalTitle');
    const editorsContainer = document.getElementById('editorsContainer');

    modalTitle.textContent = `Editors - ${journal.name}`;

    // Clear and populate editors
    editorsContainer.innerHTML = '';

    if (journal.editors && journal.editors.length > 0) {
        journal.editors.forEach((editor, index) => {
            addEditorRow(editor, index);
        });
    } else {
        addEditorRow({ name: '', mathSciNetUrl: '' }, 0);
    }

    // Store current journal ID for saving
    modal.dataset.journalId = journal.id;
    modal.style.display = 'block';
}

// Add editor row
function addEditorRow(editor, index) {
    const editorsContainer = document.getElementById('editorsContainer');
    const editorDiv = document.createElement('div');
    editorDiv.className = 'flex space-x-2 mb-3';
    editorDiv.innerHTML = `
<input type="text" 
    placeholder="Editor Name" 
    value="${editor.name || ''}"
    class="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent editor-name">
<input type="url" 
    placeholder="MathSciNet URL (optional)" 
    value="${editor.mathSciNetUrl || ''}"
    class="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent editor-url">
<button type="button" 
    onclick="removeEditorRow(this)" 
    class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">Remove</button>
`;
    editorsContainer.appendChild(editorDiv);
}

// Remove editor row
window.removeEditorRow = function (button) {
    const editorDiv = button.parentElement;
    editorDiv.remove();

    // Ensure at least one row exists
    const editorsContainer = document.getElementById('editorsContainer');
    if (editorsContainer.children.length === 0) {
        addEditorRow({ name: '', mathSciNetUrl: '' }, 0);
    }
};

// Add new editor row
window.addEditorRow = function () {
    const editorsContainer = document.getElementById('editorsContainer');
    const index = editorsContainer.children.length;
    addEditorRow({ name: '', mathSciNetUrl: '' }, index);
};

// Save editors
window.saveEditors = async function () {
    const modal = document.getElementById('editorsModal');
    const journalId = modal.dataset.journalId;
    const editorsContainer = document.getElementById('editorsContainer');

    const editors = [];
    const editorRows = editorsContainer.children;

    for (let row of editorRows) {
        const nameInput = row.querySelector('.editor-name');
        const urlInput = row.querySelector('.editor-url');

        const name = nameInput.value.trim();
        const mathSciNetUrl = urlInput.value.trim();

        if (name) {
            editors.push({
                name,
                mathSciNetUrl: mathSciNetUrl || null
            });
        }
    }

    try {
        await updateDoc(doc(db, 'journals', journalId), {
            editors: editors
        });

        loadJournals();
        closeEditorsModal();
        showMessage('Editors updated successfully!', 'success');
    } catch (error) {
        console.error('Error saving editors:', error);
        showMessage('Error saving editors', 'error');
    }
};

// Close editors modal
window.closeEditorsModal = function () {
    document.getElementById('editorsModal').style.display = 'none';
};

// Clear form
function clearForm() {
    document.getElementById('journalForm').reset();
    document.getElementById('copiedData').value = '';
}

// Parse and fill form from copied data
window.parseData = function () {
    const copiedData = document.getElementById('copiedData').value.trim();
    if (!copiedData) {
        showMessage('Please paste the copied data first', 'error');
        return;
    }

    const parsed = parseCopiedData(copiedData);
    if (!parsed) {
        showMessage('Invalid data format. Please check the copied data.', 'error');
        return;
    }

    document.getElementById('journalName').value = parsed.name;
    document.getElementById('MCQ').value = parsed.MCQ;
    document.getElementById('frequency').value = parsed.frequency;
    document.getElementById('subjects').value = parsed.subjects.join(', ');
    document.getElementById('mathSciNetUrl').value = parsed.mathSciNetUrl;
    document.getElementById('journalUrl').value = parsed.journalUrl;

    showMessage('Data parsed successfully!', 'success');
};

// Show message
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `p-4 rounded mb-4 ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Global window functions
window.handleLogin = function () {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        showMessage('Please enter both email and password', 'error');
        return;
    }

    login(email, password);
};

window.handleLogout = function () {
    logout();
};

// Event listeners
window.addEventListener('DOMContentLoaded', function () {
    // Set up auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            showMainApp();
        } else {
            currentUser = null;
            showLoginForm();
        }
    });

    // Login form event listeners
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    document.getElementById('loginBtn').addEventListener('click', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    document.getElementById('loginPassword').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    });

    // Main app event listeners
    document.getElementById('saveBtn').addEventListener('click', saveJournal);
    document.getElementById('parseBtn').addEventListener('click', parseData);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }

    // Page size functionality
    const pageSizeSelect = document.getElementById('pageSize');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', changePageSize);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('editorsModal');
        if (event.target === modal) {
            closeEditorsModal();
        }
    });
});