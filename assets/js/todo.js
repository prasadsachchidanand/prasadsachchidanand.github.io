// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC7g-8bO66651JhxwKSFdXlOlRxhi_gIT8",
    authDomain: "todo-list-6be67.firebaseapp.com",
    projectId: "todo-list-6be67",
    storageBucket: "todo-list-6be67.appspot.com",
    messagingSenderId: "724697395910",
    appId: "1:724697395910:web:299626b7bd43f696595dc7",
    measurementId: "G-QX4MDTVMM4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// DOM elements
const loginForm = document.getElementById('login-form');
const userInfo = document.getElementById('user-info');
const userEmail = document.getElementById('user-email');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks-list');
const filterButtons = document.querySelectorAll('[id^="filter-"]');
const taskCategory = document.getElementById('task-category');
const timeLocationSection = document.getElementById('time-location-section');
// Add these new DOM elements for visibility control
const taskFormContainer = document.getElementById('task-form-container');
const tasksContainer = document.getElementById('tasks-container');
// Add references to the email and password fields
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

let currentUser = null;
let currentFilter = 'all';
let allTasks = []; // Store all tasks in memory for client-side filtering

// Function to handle login
function handleLogin() {
    const email = emailField.value;
    const password = passwordField.value;
    
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            alert(`Login Error: ${error.message}`);
        });
}

// Function to handle registration
function handleRegistration() {
    const email = emailField.value;
    const password = passwordField.value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .catch(error => {
            alert(`Registration Error: ${error.message}`);
        });
}

// Add event listeners for Enter key in login fields
emailField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin();
    }
});

passwordField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin();
    }
});

// Show/hide time and location fields based on category
taskCategory.addEventListener('change', function() {
    const category = this.value;
    const showTimeLocation = category === 'meeting' || category === 'class';
    timeLocationSection.style.display = showTimeLocation ? 'grid' : 'none';
});

// Initialize time/location visibility on page load
timeLocationSection.style.display = 'none';

// Authentication event listener
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        // Show user info and task management elements
        loginForm.classList.add('hidden');
        userInfo.classList.remove('hidden');
        taskFormContainer.classList.remove('hidden');
        userEmail.textContent = user.email;
        loadAllTasks();
    } else {
        currentUser = null;
        // Hide user info and task management elements
        loginForm.classList.remove('hidden');
        userInfo.classList.add('hidden');
        taskFormContainer.classList.add('hidden');
        tasksList.innerHTML = '<div class="text-center text-gray-500">Login to see your tasks</div>';
    }
});

// Login functionality
loginBtn.addEventListener('click', handleLogin);

// Register functionality
registerBtn.addEventListener('click', handleRegistration);

// Logout functionality
logoutBtn.addEventListener('click', () => {
    // Clear the email and password fields before logging out
    emailField.value = '';
    passwordField.value = '';
    auth.signOut();
});

// Add task functionality
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const category = document.getElementById('task-category').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').checked;
    
    // Get time and location fields
    const time = document.getElementById('task-time').value;
    const location = document.getElementById('task-location').value;
    
    // Add task to Firestore
    db.collection('users').doc(currentUser.uid).collection('tasks').add({
        title,
        description,
        category,
        dueDate,
        priority,
        time: time || null,  // Store time if provided
        location: location || null,  // Store location if provided
        completed: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        taskForm.reset();
        // Reset time/location visibility
        timeLocationSection.style.display = 'none';
        loadAllTasks(); // Reload all tasks after adding a new one
    })
    .catch(error => {
        alert(`Error adding task: ${error.message}`);
    });
});

// Format time for display (12-hour format)
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert to 12-hour format
    
    return `${hour12}:${minutes} ${period}`;
}

// Load ALL tasks from Firestore - No filtering or complex ordering at DB level
function loadAllTasks() {
    if (!currentUser) return;
    
    tasksList.innerHTML = '<div class="text-center text-gray-500">Loading tasks...</div>';
    
    // Just get all tasks with a simple orderBy to avoid index issues
    db.collection('users').doc(currentUser.uid).collection('tasks')
        .orderBy('createdAt', 'desc')
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                tasksList.innerHTML = '<div class="text-center text-gray-500">No tasks found</div>';
                return;
            }
            
            // Store all tasks in memory
            allTasks = [];
            snapshot.forEach(doc => {
                allTasks.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Now filter and display tasks based on current filter
            displayFilteredTasks();
        })
        .catch(error => {
            tasksList.innerHTML = `<div class="text-center text-red-500">Error loading tasks: ${error.message}</div>`;
            console.error("Firestore error:", error);
        });
}

// Display tasks based on current filter
function displayFilteredTasks() {
    // Clear tasks list
    tasksList.innerHTML = '';
    
    // Filter tasks based on current category filter
    let filteredTasks = allTasks;
    if (currentFilter !== 'all') {
        filteredTasks = allTasks.filter(task => task.category === currentFilter);
    }
    
    // Check if we have tasks after filtering
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `<div class="text-center text-gray-500">No ${currentFilter !== 'all' ? currentFilter : ''} tasks found</div>`;
        return;
    }
    
    // Sort tasks: priority first, then by date/time for meetings/classes, then creation date
    filteredTasks.sort((a, b) => {
        // First by completion status
        if (!a.completed && b.completed) return -1;
        if (a.completed && !b.completed) return 1;
        
        // Then by priority (high to low)
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        
        // For meetings and classes with time/date info, sort by that
        if ((a.category === 'meeting' || a.category === 'class') && 
            (b.category === 'meeting' || b.category === 'class')) {
            // If both have due dates, compare them
            if (a.dueDate && b.dueDate) {
                const dateCompare = a.dueDate.localeCompare(b.dueDate);
                if (dateCompare !== 0) return dateCompare;
                
                // If same date and both have times, compare times
                if (a.time && b.time) {
                    return a.time.localeCompare(b.time);
                }
            }
        }
        
        // If priority is the same, sort by createdAt (new to old)
        if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
    });
    
    // Render tasks
    filteredTasks.forEach(task => {
        // Create task element
        const taskElement = document.createElement('div');
        taskElement.className = `border rounded p-4 ${task.completed ? 'completed' : ''} ${task.priority ? 'border-l-4 border-l-red-500' : ''}`;
        
        // Get category color
        let categoryColor;
        switch(task.category) {
            case 'research': categoryColor = 'bg-blue-100 text-blue-800'; break;
            case 'teaching': categoryColor = 'bg-green-100 text-green-800'; break;
            case 'writing': categoryColor = 'bg-yellow-100 text-yellow-800'; break;
            case 'proof': categoryColor = 'bg-purple-100 text-purple-800'; break;
            case 'meeting': categoryColor = 'bg-red-100 text-red-800'; break;
            case 'class': categoryColor = 'bg-pink-100 text-pink-800'; break;
            default: categoryColor = 'bg-gray-100 text-gray-800';
        }
        
        // Create schedule info for meetings and classes
        let scheduleInfo = '';
        if ((task.category === 'meeting' || task.category === 'class') && (task.time || task.location)) {
            scheduleInfo = `<div class="mt-2 text-sm">`;
            if (task.time) {
                scheduleInfo += `<span class="inline-flex items-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${formatTime(task.time)}
                </span>`;
            }
            if (task.location) {
                scheduleInfo += `<span class="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ${task.location}
                </span>`;
            }
            scheduleInfo += `</div>`;
        }
        
        taskElement.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="text-lg font-medium ${task.completed ? 'line-through opacity-70' : ''}">${task.title}</h3>
                    <div class="flex flex-wrap items-center gap-2 mt-1">
                        <span class="${categoryColor} text-xs px-2 py-1 rounded">${task.category}</span>
                        ${task.dueDate ? `<span class="text-xs text-gray-600">Due: ${task.dueDate}</span>` : ''}
                    </div>
                    ${scheduleInfo}
                </div>
                <div class="flex gap-2">
                    <button class="toggle-btn text-green-600 hover:text-green-800" data-id="${task.id}">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-800" data-id="${task.id}">Delete</button>
                </div>
            </div>
            <div class="task-description math-content">${task.description}</div>
        `;
        
        tasksList.appendChild(taskElement);
    });
    
    // Process MathJax after adding tasks - important!
    if (window.MathJax) {
        // Use typeset promise to ensure math is rendered correctly
        MathJax.typesetPromise([tasksList]).catch(err => {
            console.error('MathJax typesetting failed:', err);
        });
    }
    
    // Add event listeners for toggle and delete buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', toggleTask);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}

// Toggle task completion
function toggleTask(e) {
    const taskId = e.target.dataset.id;
    const taskRef = db.collection('users').doc(currentUser.uid).collection('tasks').doc(taskId);
    
    taskRef.get().then(doc => {
        if (doc.exists) {
            const currentStatus = doc.data().completed;
            return taskRef.update({
                completed: !currentStatus
            });
        }
    })
    .then(() => {
        loadAllTasks(); // Reload all tasks after toggling
    })
    .catch(error => {
        alert(`Error updating task: ${error.message}`);
    });
}

// Delete task
function deleteTask(e) {
    if (confirm('Are you sure you want to delete this task?')) {
        const taskId = e.target.dataset.id;
        
        db.collection('users').doc(currentUser.uid).collection('tasks').doc(taskId).delete()
            .then(() => {
                loadAllTasks(); // Reload all tasks after deleting
            })
            .catch(error => {
                alert(`Error deleting task: ${error.message}`);
            });
    }
}

// Filter tasks - Now completely client-side
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state visually
        filterButtons.forEach(btn => btn.classList.remove('filter-active'));
        button.classList.add('filter-active');
        
        // Set filter
        currentFilter = button.id.replace('filter-', '');
        
        // No need to reload from database - just filter and display from memory
        displayFilteredTasks();
    });
});