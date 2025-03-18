// Data storage
let students = [
    { id: 1, name: 'Student1', rate: 20 },
    { id: 2, name: 'Student2', rate: 25 },
    { id: 3, name: 'Student3', rate: 25 }
];

let sessions = [];
let nextStudentId = 4;
let nextSessionId = 1;

// Password management
const DEFAULT_PASSWORD = "tutor123"; // Default password
let currentPassword = DEFAULT_PASSWORD;
let isLoggedIn = false;

// Initialize password on app load
function initializePassword() {
    const savedPassword = localStorage.getItem('tutoring_password');
    if (savedPassword) {
        currentPassword = savedPassword;
    } else {
        localStorage.setItem('tutoring_password', currentPassword);
    }
}

// Login function
function login() {
    const enteredPassword = document.getElementById('passwordInput').value;

    if (enteredPassword === currentPassword) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        document.getElementById('passwordInput').value = '';
        document.getElementById('loginError').textContent = '';
        isLoggedIn = true;
        loadData();
    } else {
        document.getElementById('loginError').textContent = 'Incorrect password. Please try again.';
    }
}

// Logout function
function logout() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('appContainer').style.display = 'none';
    isLoggedIn = false;
    closeSettings();
}

// Change password
function changePassword() {
    const currentPasswordInput = document.getElementById('currentPassword').value;
    const newPasswordInput = document.getElementById('newPassword').value;
    const confirmPasswordInput = document.getElementById('confirmPassword').value;

    // Validate inputs
    if (currentPasswordInput !== currentPassword) {
        alert('Current password is incorrect');
        return;
    }

    if (newPasswordInput === '') {
        alert('New password cannot be empty');
        return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
        alert('New passwords do not match');
        return;
    }

    // Update the password
    currentPassword = newPasswordInput;
    localStorage.setItem('tutoring_password', currentPassword);

    // Clear fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';

    alert('Password updated successfully');
    closeSettings();
}

// Initialize password on app load
initializePassword();

// Settings modal functions
function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// Export data
function exportData() {
    const data = {
        students: students,
        sessions: sessions,
        nextStudentId: nextStudentId,
        nextSessionId: nextSessionId
    };
    
    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tuition_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.students && data.sessions && data.nextStudentId && data.nextSessionId) {
                students = data.students;
                sessions = data.sessions;
                nextStudentId = data.nextStudentId;
                nextSessionId = data.nextSessionId;
                
                saveData();
                updateStudentDropdown();
                renderStudents();
                renderSessions();
                renderSummary();
                
                alert('Data imported successfully');
            } else {
                alert('Invalid data format');
            }
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Check for saved data
function loadData() {
    const savedStudents = localStorage.getItem('tutoring_students');
    const savedSessions = localStorage.getItem('tutoring_sessions');
    const savedNextStudentId = localStorage.getItem('tutoring_nextStudentId');
    const savedNextSessionId = localStorage.getItem('tutoring_nextSessionId');
    
    if (savedStudents) students = JSON.parse(savedStudents);
    if (savedSessions) sessions = JSON.parse(savedSessions);
    if (savedNextStudentId) nextStudentId = parseInt(savedNextStudentId);
    if (savedNextSessionId) nextSessionId = parseInt(savedNextSessionId);
    
    updateStudentDropdown();
    renderStudents();
    renderSessions();
    renderSummary();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('tutoring_students', JSON.stringify(students));
    localStorage.setItem('tutoring_sessions', JSON.stringify(sessions));
    localStorage.setItem('tutoring_nextStudentId', nextStudentId);
    localStorage.setItem('tutoring_nextSessionId', nextSessionId);
}

// Update student dropdown in sessions tab
function updateStudentDropdown() {
    const dropdown = document.getElementById('sessionStudent');
    dropdown.innerHTML = '<option value="">Select Student</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        dropdown.appendChild(option);
    });
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const contents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.add('hidden');
    }
    
    // Deactivate all tabs
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('bg-green-500', 'text-white');
        tabs[i].classList.add('bg-gray-200');
    }
    
    // Show the selected tab content
    document.getElementById(tabName).classList.remove('hidden');
    
    // Find and activate the tab button
    const tabElements = document.getElementsByClassName('tab');
    for (let i = 0; i < tabElements.length; i++) {
        if (tabElements[i].innerHTML.toLowerCase().includes(tabName)) {
            tabElements[i].classList.remove('bg-gray-200');
            tabElements[i].classList.add('bg-green-500', 'text-white');
            break;
        }
    }
}

// Add a new student
function addStudent() {
    const nameInput = document.getElementById('studentName');
    const rateInput = document.getElementById('hourlyRate');
    
    const name = nameInput.value.trim();
    const rate = parseFloat(rateInput.value);
    
    if (!name) {
        alert('Please enter a student name');
        return;
    }
    
    if (isNaN(rate) || rate <= 0) {
        alert('Please enter a valid hourly rate');
        return;
    }
    
    const newStudent = {
        id: nextStudentId++,
        name: name,
        rate: rate
    };
    
    students.push(newStudent);
    
    // Clear inputs
    nameInput.value = '';
    rateInput.value = '25';
    
    renderStudents();
    updateStudentDropdown();
    saveData();
}

// Render students table
function renderStudents() {
    const tbody = document.getElementById('studentsBody');
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        row.appendChild(nameCell);
        
        const rateCell = document.createElement('td');
        rateCell.textContent = `£${student.rate.toFixed(2)}`;
        row.appendChild(rateCell);
        
        const actionsCell = document.createElement('td');
        actionsCell.className = 'flex space-x-2';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-200';
        editBtn.onclick = () => editStudent(student.id);
        actionsCell.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-200';
        deleteBtn.onclick = () => deleteStudent(student.id);
        actionsCell.appendChild(deleteBtn);
        
        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    const newName = prompt('Enter new name for student:', student.name);
    if (!newName || newName.trim() === '') return;
    
    const newRate = prompt('Enter new hourly rate (GBP):', student.rate);
    const parsedRate = parseFloat(newRate);
    
    if (isNaN(parsedRate) || parsedRate <= 0) {
        alert('Please enter a valid hourly rate');
        return;
    }
    
    student.name = newName.trim();
    student.rate = parsedRate;
    
    renderStudents();
    renderSessions();
    renderSummary();
    updateStudentDropdown();
    saveData();
}

// Delete student
function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student? All associated sessions will be deleted as well.')) {
        return;
    }
    
    students = students.filter(s => s.id !== id);
    sessions = sessions.filter(s => s.studentId !== id);
    
    renderStudents();
    renderSessions();
    renderSummary();
    updateStudentDropdown();
    saveData();
}

// Add a new session
function addSession() {
    const studentSelect = document.getElementById('sessionStudent');
    const dateInput = document.getElementById('sessionDate');
    const durationInput = document.getElementById('sessionDuration');
    const completedInput = document.getElementById('sessionCompleted');
    
    const studentId = parseInt(studentSelect.value);
    const date = dateInput.value;
    const duration = parseFloat(durationInput.value);
    const completed = completedInput.checked;
    
    if (!studentId) {
        alert('Please select a student');
        return;
    }
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    if (isNaN(duration) || duration <= 0) {
        alert('Please enter a valid duration');
        return;
    }
    
    const student = students.find(s => s.id === studentId);
    if (!student) {
        alert('Selected student not found');
        return;
    }
    
    const newSession = {
        id: nextSessionId++,
        studentId: studentId,
        date: date,
        duration: duration,
        completed: completed,
        amount: completed ? (student.rate * duration) : 0
    };
    
    sessions.push(newSession);
    
    // Set default values
    dateInput.value = '';
    durationInput.value = '1';
    completedInput.checked = true;
    
    renderSessions();
    renderSummary();
    saveData();
}

// Render sessions table
function renderSessions() {
    const tbody = document.getElementById('sessionsBody');
    tbody.innerHTML = '';
    
    // Sort sessions by date (newest first)
    const sortedSessions = [...sessions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    let totalAmount = 0;
    
    sortedSessions.forEach(session => {
        const student = students.find(s => s.id === session.studentId);
        if (!student) return;
        
        const row = document.createElement('tr');
        
        const studentCell = document.createElement('td');
        studentCell.textContent = student.name;
        row.appendChild(studentCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(session.date);
        row.appendChild(dateCell);
        
        const durationCell = document.createElement('td');
        durationCell.textContent = session.duration;
        row.appendChild(durationCell);
        
        const rateCell = document.createElement('td');
        rateCell.textContent = `£${student.rate.toFixed(2)}`;
        row.appendChild(rateCell);
        
        const completedCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = session.completed;
        checkbox.onchange = () => toggleSessionCompletion(session.id, checkbox.checked);
        completedCell.appendChild(checkbox);
        row.appendChild(completedCell);
        
        const amountCell = document.createElement('td');
        const amount = session.completed ? (student.rate * session.duration) : 0;
        amountCell.textContent = `£${amount.toFixed(2)}`;
        row.appendChild(amountCell);
        
        totalAmount += amount;
        
        const actionsCell = document.createElement('td');
        actionsCell.className = 'flex space-x-2';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-200';
        editBtn.onclick = () => editSession(session.id);
        actionsCell.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-200';
        deleteBtn.onclick = () => deleteSession(session.id);
        actionsCell.appendChild(deleteBtn);
        
        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });
    
    document.getElementById('totalAmount').textContent = `£${totalAmount.toFixed(2)}`;
}

// Toggle session completion status
function toggleSessionCompletion(id, completed) {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    
    session.completed = completed;
    
    renderSessions();
    renderSummary();
    saveData();
}

// Edit session
function editSession(id) {
const session = sessions.find(s => s.id === id);
if (!session) return;

const student = students.find(s => s.id === session.studentId);
if (!student) return;

// Create student options for dropdown
let studentOptions = '';
students.forEach(s => {
    const selected = s.id === session.studentId ? 'selected' : '';
    studentOptions += `<option value="${s.id}" ${selected}>${s.name}</option>`;
});

// Create edit form
const form = document.createElement('div');
form.innerHTML = `
    <h3 class="text-lg font-semibold text-gray-700 mb-4">Edit Session</h3>
    <div class="space-y-4">
        <div>
            <label for="editStudent" class="block text-sm font-medium text-gray-700">Student</label>
            <select id="editStudent" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                ${studentOptions}
            </select>
        </div>
        <div>
            <label for="editDate" class="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" id="editDate" value="${session.date}" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        <div>
            <label for="editDuration" class="block text-sm font-medium text-gray-700">Duration (hours)</label>
            <input type="number" id="editDuration" min="0.5" step="0.5" value="${session.duration}" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        <div class="flex items-center">
            <input type="checkbox" id="editCompleted" ${session.completed ? 'checked' : ''} class="mr-2">
            <label for="editCompleted" class="text-sm text-gray-700">Completed</label>
        </div>
        <div class="flex space-x-2">
            <button id="saveEdit" class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200">Save Changes</button>
            <button id="cancelEdit" class="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200">Cancel</button>
        </div>
    </div>
`;

// Show dialog
const sessionsTab = document.getElementById('sessions');
const oldForm = document.querySelector('.edit-form');
if (oldForm) oldForm.remove(); // Remove any existing edit form

form.className = 'bg-gray-50 p-4 rounded-lg mb-6 edit-form';
sessionsTab.appendChild(form); // Append the form to the sessions tab

// Add event listeners
document.getElementById('saveEdit').addEventListener('click', () => {
    const studentId = parseInt(document.getElementById('editStudent').value);
    const date = document.getElementById('editDate').value;
    const duration = parseFloat(document.getElementById('editDuration').value);
    const completed = document.getElementById('editCompleted').checked;

    if (!studentId || !date || isNaN(duration) || duration <= 0) {
        alert('Please fill in all fields correctly');
        return;
    }

    // Update session
    session.studentId = studentId;
    session.date = date;
    session.duration = duration;
    session.completed = completed;

    form.remove(); // Remove the edit form
    renderSessions(); // Re-render the sessions table
    renderSummary(); // Update the summary
    saveData(); // Save changes to localStorage
});

document.getElementById('cancelEdit').addEventListener('click', () => {
    form.remove(); // Remove the edit form
});
}

// Delete session
function deleteSession(id) {
    if (!confirm('Are you sure you want to delete this session?')) {
        return;
    }
    
    sessions = sessions.filter(s => s.id !== id);
    
    renderSessions();
    renderSummary();
    saveData();
}

// Render summary view
function renderSummary() {
    const tbody = document.getElementById('summaryBody');
    const summaryCards = document.getElementById('summaryCards');
    
    tbody.innerHTML = '';
    summaryCards.innerHTML = '';
    
    let totalHours = 0;
    let totalEarnings = 0;
    
    // Create summary by student
    students.forEach(student => {
        const studentSessions = sessions.filter(s => s.studentId === student.id && s.completed);
        
        const totalStudentHours = studentSessions.reduce((sum, session) => sum + session.duration, 0);
        const totalStudentEarnings = studentSessions.reduce((sum, session) => sum + (student.rate * session.duration), 0);
        
        totalHours += totalStudentHours;
        totalEarnings += totalStudentEarnings;
        
        // Add to summary table
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        row.appendChild(nameCell);
        
        const rateCell = document.createElement('td');
        rateCell.textContent = `£${student.rate.toFixed(2)}`;
        row.appendChild(rateCell);
        
        const hoursCell = document.createElement('td');
        hoursCell.textContent = totalStudentHours.toFixed(1);
        row.appendChild(hoursCell);
        
        const earningsCell = document.createElement('td');
        earningsCell.textContent = `£${totalStudentEarnings.toFixed(2)}`;
        row.appendChild(earningsCell);
        
        tbody.appendChild(row);
        
        // Create summary card
        const card = document.createElement('div');
        card.className = 'bg-green-50 p-4 rounded-lg';
        card.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-700">${student.name}</h3>
            <p class="text-sm text-gray-600"><strong>Rate:</strong> £${student.rate.toFixed(2)} per hour</p>
            <p class="text-sm text-gray-600"><strong>Total Hours:</strong> ${totalStudentHours.toFixed(1)}</p>
            <p class="text-sm text-gray-600"><strong>Total Earnings:</strong> £${totalStudentEarnings.toFixed(2)}</p>
        `;
        summaryCards.appendChild(card);
    });
    
    // Update totals
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    document.getElementById('totalEarnings').textContent = `£${totalEarnings.toFixed(2)}`;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Set today's date as default
function setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    document.getElementById('sessionDate').value = dateString;
}

// Initialize
window.onload = function() {
    loadData();
    setDefaultDate();
};