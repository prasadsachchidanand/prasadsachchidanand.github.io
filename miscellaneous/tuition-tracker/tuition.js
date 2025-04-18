// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJpjyDWfrQXTrEkSqiYEMcUDqWfSiB1kQ",
    authDomain: "tution-tracker-63b0b.firebaseapp.com",
    projectId: "tution-tracker-63b0b",
    storageBucket: "tution-tracker-63b0b.firebasestorage.app",
    messagingSenderId: "218652921741",
    appId: "1:218652921741:web:90acec01c355a930e837c4",
    measurementId: "G-30CJ5BKPEG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Initialize Firebase Authentication
const db = firebase.firestore(); // Initialize Firestore

// Data storage
let students = [];
let sessions = [];
let nextStudentId = 1;
let nextSessionId = 1;
let payments = [];
let nextPaymentId = 1;

// Password management
let isLoggedIn = false;

// Login function
function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const loginError = document.getElementById('loginError');

    if (!email || !password) {
        loginError.textContent = 'Please enter both email and password.';
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            loginError.textContent = ''; // Clear any previous error
        })
        .catch((error) => {
            console.error('Login error:', error.code, error.message); // Log for debugging
            if (error.code === 'auth/invalid-credential') {
                loginError.textContent = 'Incorrect email or password. Please try again.';
            } else if (error.code === 'auth/user-not-found') {
                loginError.textContent = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                loginError.textContent = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/too-many-requests') {
                loginError.textContent = 'Too many failed attempts. Please try again later.';
            } else {
                loginError.textContent = 'An error occurred. Please try again.';
            }
        });
}

// Logout function
function logout() {
    auth.signOut()
        .then(() => {
            document.getElementById('loginScreen').style.display = 'block';
            document.getElementById('appContainer').style.display = 'none';
            isLoggedIn = false;
            closeSettings();
        })
        .catch((error) => {
            console.error("Error logging out: ", error);
        });
}

function signUp() {
    const submitButton = document.querySelector('#signUpForm button');
    submitButton.disabled = true;
    submitButton.textContent = 'Signing Up...';

    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;

    if (email === '' || password === '' || confirmPassword === '') {
        alert('Please fill in all fields.');
        submitButton.disabled = false;
        submitButton.textContent = 'Sign Up';
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Account created successfully. Please log in.');
            closeSignUpModal();
            document.getElementById('loginScreen').style.display = 'block';
        })
        .catch((error) => { /* error handling */ })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Up';
        });
}

function closeActiveModal() {
    const modals = [
        'forgotPasswordModal',
        'signUpModal',
        'settingsModal'
    ];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

// Add Escape key listener
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeActiveModal();
    }
});

function closeForgotPasswordModal() {
    closeActiveModal();
}

function closeSignUpModal() {
    closeActiveModal();
}

function closeSettings() {
    closeActiveModal();
}

// Change password
function changePassword() {
    // console.log('Starting password change...');

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const user = firebase.auth().currentUser;
    // console.log('Current user:', user ? user.email : 'No user found');

    if (!user) {
        alert('No user is signed in.');
        // console.log('Error: No signed-in user.');
        return;
    }

    if (!currentPassword) {
        alert('Please enter your current password.');
        // console.log('Error: Current password empty.');
        return;
    }

    if (!newPassword) {
        alert('New password cannot be empty.');
        // console.log('Error: New password empty.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        // console.log('Error: Passwords do not match.');
        return;
    }

    const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    // console.log('Attempting re-authentication with:', user.email);

    user.reauthenticateWithCredential(credential)
        .then(() => {
            // console.log('Re-authentication successful. Updating password...');
            return user.updatePassword(newPassword);
        })
        .then(() => {
            console.log('Password updated successfully in Firebase Auth.');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            closeSettings();
            alert('Password updated successfully. Please log in again.');
            auth.signOut().then(() => {
                document.getElementById('appContainer').style.display = 'none';
                document.getElementById('loginScreen').style.display = 'block';
                document.getElementById('loginError').textContent = 'Password updated! Log in with your new password.';
            });
        })
        .then(() => {
            // Ensure UI updates after sign-out
            document.getElementById('appContainer').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'block';
        })
        .catch((error) => {
            // console.error('Error during password change:', error.code, error.message);
            if (error.code === 'auth/wrong-password') {
                alert('Current password is incorrect.');
            } else if (error.code === 'auth/too-many-requests') {
                alert('Too many attempts. Please try again later.');
            } else {
                alert('Error updating password: ' + error.message);
            }
        });
}

// Open Forgot Password Modal
function openForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'flex';
}

// Close Forgot Password Modal
function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
}

// Reset Password Function
function resetPassword() {
    const email = document.getElementById('forgotPasswordEmail').value;

    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            // Generic message that works for both cases
            alert('If an account exists with this email, a password reset link has been sent. Check your inbox.');
            closeForgotPasswordModal();
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Settings modal functions
function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'none';
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Open Sign-Up Modal
function openSignUpModal() {
    document.getElementById('signUpModal').style.display = 'flex';
    document.getElementById('signUpEmail').focus();
    document.getElementById('signUpEmail').value = '';
    document.getElementById('signUpPassword').value = '';
    document.getElementById('signUpConfirmPassword').value = '';
}

// Close Sign-Up Modal
function closeSignUpModal() {
    const modal = document.getElementById('signUpModal');
    modal.style.display = 'none';
    document.getElementById('signUpEmail').value = '';
    document.getElementById('signUpPassword').value = '';
    document.getElementById('signUpConfirmPassword').value = '';
}

// Export data
function exportData() {
    const data = {
        students: students,
        sessions: sessions,
        payments: payments,
        nextStudentId: nextStudentId,
        nextSessionId: nextSessionId,
        nextPaymentId: nextPaymentId
    };

    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

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
                payments = data.payments || [];
                nextStudentId = data.nextStudentId;
                nextSessionId = data.nextSessionId;
                nextPaymentId = data.nextPaymentId || 1;

                saveData();
                updateStudentDropdown();
                renderStudents();
                renderSessions();
                renderPayments();
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

// Load data from Firestore
function loadData() {
    const user = auth.currentUser;
    if (!user) return;

    db.collection("users").doc(user.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                students = data.students || [];
                sessions = data.sessions || [];
                payments = data.payments || []; // Add this line
                nextStudentId = data.nextStudentId || 1;
                nextSessionId = data.nextSessionId || 1;
                nextPaymentId = data.nextPaymentId || 1; // Add this line

                updateStudentDropdown();
                renderStudents();
                renderSessions();
                renderPayments(); // Add this line
                renderSummary();
            } else {
                // console.log("No data found in Firestore");
            }
        })
        .catch((error) => console.error("Error loading data: ", error));
}

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        // console.log('User signed in:', user.email);
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        document.getElementById('settingsModal').style.display = 'none'; // Ensure modal is hidden
        isLoggedIn = true;
        loadData();
    } else {
        // User is signed out
        // console.log('User signed out.');
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'block';
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('settingsModal').style.display = 'none'; // Ensure modal is hidden
        isLoggedIn = false;
    }
});

window.onload = function() {
    document.getElementById('loadingScreen').style.display = 'flex';
};

// Save data to Firestore
function saveData() {
    const user = auth.currentUser;
    if (!user) return;

    db.collection("users").doc(user.uid).set({
            students: students,
            sessions: sessions,
            payments: payments, // Add this line
            nextStudentId: nextStudentId,
            nextSessionId: nextSessionId,
            nextPaymentId: nextPaymentId // Add this line
        })
        .then(() => console.log("Data saved to Firestore"))
        .catch((error) => console.error("Error saving data: ", error));
}

// payment function
function addPayment() {
    const studentSelect = document.getElementById('paymentStudent');
    const amountInput = document.getElementById('paymentAmount');
    const dateInput = document.getElementById('paymentDate');
    const notesInput = document.getElementById('paymentNotes');

    const studentId = parseInt(studentSelect.value);
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const notes = notesInput.value.trim();

    if (!studentId) {
        alert('Please select a student');
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (!date) {
        alert('Please select a date');
        return;
    }

    const newPayment = {
        id: nextPaymentId++,
        studentId: studentId,
        amount: amount,
        date: date,
        notes: notes
    };

    payments.push(newPayment);

    // Clear form
    amountInput.value = '';
    notesInput.value = '';

    renderPayments();
    renderSummary();
    saveData();
}

// Render payments table
function renderPayments() {
    const tbody = document.getElementById('paymentsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    // Sort payments by date (newest first)
    const sortedPayments = [...payments].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    let totalPayments = 0;

    sortedPayments.forEach(payment => {
        const student = students.find(s => s.id === payment.studentId);
        if (!student) return;

        const row = document.createElement('tr');

        const studentCell = document.createElement('td');
        studentCell.textContent = student.name;
        row.appendChild(studentCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(payment.date);
        row.appendChild(dateCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = `£${payment.amount.toFixed(2)}`;
        row.appendChild(amountCell);

        const notesCell = document.createElement('td');
        notesCell.textContent = payment.notes;
        row.appendChild(notesCell);

        totalPayments += payment.amount;

        const actionsCell = document.createElement('td');
        actionsCell.className = 'flex space-x-2';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-200';
        editBtn.onclick = () => editPayment(payment.id);
        actionsCell.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-200';
        deleteBtn.onclick = () => deletePayment(payment.id);
        actionsCell.appendChild(deleteBtn);

        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });

    document.getElementById('totalPayments').textContent = `£${totalPayments.toFixed(2)}`;
}

// Edit payment
function editPayment(id) {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    // Create student options for dropdown
    let studentOptions = '';
    students.forEach(s => {
        const selected = s.id === payment.studentId ? 'selected' : '';
        studentOptions += `<option value="${s.id}" ${selected}>${s.name}</option>`;
    });

    // Create edit form
    const form = document.createElement('div');
    form.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-700 mb-4">Edit Payment</h3>
      <div class="space-y-4">
        <div>
          <label for="editPaymentStudent" class="block text-sm font-medium text-gray-700">Student</label>
          <select id="editPaymentStudent" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
            ${studentOptions}
          </select>
        </div>
        <div>
          <label for="editPaymentDate" class="block text-sm font-medium text-gray-700">Payment Date</label>
          <input type="date" id="editPaymentDate" value="${payment.date}" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        <div>
          <label for="editPaymentAmount" class="block text-sm font-medium text-gray-700">Amount (GBP)</label>
          <input type="number" id="editPaymentAmount" min="0.01" step="0.01" value="${payment.amount}" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        <div>
          <label for="editPaymentNotes" class="block text-sm font-medium text-gray-700">Notes</label>
          <input type="text" id="editPaymentNotes" value="${payment.notes}" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        <div class="flex space-x-2">
          <button id="savePaymentEdit" class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200">Save Changes</button>
          <button id="cancelPaymentEdit" class="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200">Cancel</button>
        </div>
      </div>
    `;

    // Show dialog
    const paymentsTab = document.getElementById('payments');
    const oldForm = paymentsTab.querySelector('.edit-form');
    if (oldForm) oldForm.remove(); // Remove any existing edit form

    form.className = 'bg-gray-50 p-4 rounded-lg mb-6 edit-form';
    paymentsTab.appendChild(form);

    // Add event listeners
    document.getElementById('savePaymentEdit').addEventListener('click', () => {
        const studentId = parseInt(document.getElementById('editPaymentStudent').value);
        const date = document.getElementById('editPaymentDate').value;
        const amount = parseFloat(document.getElementById('editPaymentAmount').value);
        const notes = document.getElementById('editPaymentNotes').value;

        if (!studentId || !date || isNaN(amount) || amount <= 0) {
            alert('Please fill in all fields correctly');
            return;
        }

        // Update payment
        payment.studentId = studentId;
        payment.date = date;
        payment.amount = amount;
        payment.notes = notes;

        form.remove(); // Remove the edit form
        renderPayments(); // Re-render the payments table
        renderSummary(); // Update the summary
        saveData(); // Save changes to Firestore
    });

    document.getElementById('cancelPaymentEdit').addEventListener('click', () => {
        form.remove(); // Remove the edit form
    });
}

// Delete payment
function deletePayment(id) {
    if (!confirm('Are you sure you want to delete this payment?')) {
        return;
    }

    payments = payments.filter(p => p.id !== id);

    renderPayments();
    renderSummary();
    saveData();
}

// Update student dropdown in sessions tab
function updateStudentDropdown() {
    const sessionDropdown = document.getElementById('sessionStudent');
    const paymentDropdown = document.getElementById('paymentStudent');
    
    // Clear dropdowns
    sessionDropdown.innerHTML = '<option value="">Select Student</option>';
    if (paymentDropdown) {
        paymentDropdown.innerHTML = '<option value="">Select Student</option>';
    }

    // Populate dropdowns
    students.forEach(student => {
        // For sessions dropdown
        const sessionOption = document.createElement('option');
        sessionOption.value = student.id;
        sessionOption.textContent = student.name;
        sessionDropdown.appendChild(sessionOption);
        
        // For payments dropdown if it exists
        if (paymentDropdown) {
            const paymentOption = document.createElement('option');
            paymentOption.value = student.id;
            paymentOption.textContent = student.name;
            paymentDropdown.appendChild(paymentOption);
        }
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
        saveData(); // Save changes to Firestore
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
    let totalPaymentsReceived = 0;
    let totalOutstanding = 0;

    // Create summary by student
    students.forEach(student => {
        const studentSessions = sessions.filter(s => s.studentId === student.id && s.completed);
        const studentPayments = payments.filter(p => p.studentId === student.id);

        const totalStudentHours = studentSessions.reduce((sum, session) => sum + session.duration, 0);
        const totalStudentEarnings = studentSessions.reduce((sum, session) => sum + (student.rate * session.duration), 0);
        const totalStudentPayments = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const outstandingBalance = totalStudentEarnings - totalStudentPayments;

        totalHours += totalStudentHours;
        totalEarnings += totalStudentEarnings;
        totalPaymentsReceived += totalStudentPayments;
        totalOutstanding += outstandingBalance;

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

        const paymentsCell = document.createElement('td');
        paymentsCell.textContent = `£${totalStudentPayments.toFixed(2)}`;
        row.appendChild(paymentsCell);

        const outstandingCell = document.createElement('td');
        outstandingCell.textContent = `£${outstandingBalance.toFixed(2)}`;
        outstandingCell.className = outstandingBalance > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold';
        row.appendChild(outstandingCell);

        tbody.appendChild(row);

        // Create summary card
        const card = document.createElement('div');
        card.className = 'bg-green-50 p-4 rounded-lg';
        card.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-700">${student.name}</h3>
        <p class="text-sm text-gray-600"><strong>Rate:</strong> £${student.rate.toFixed(2)} per hour</p>
        <p class="text-sm text-gray-600"><strong>Total Hours:</strong> ${totalStudentHours.toFixed(1)}</p>
        <p class="text-sm text-gray-600"><strong>Total Earnings:</strong> £${totalStudentEarnings.toFixed(2)}</p>
        <p class="text-sm text-gray-600"><strong>Total Paid:</strong> £${totalStudentPayments.toFixed(2)}</p>
        <p class="text-sm ${outstandingBalance > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}">
          <strong>Outstanding Balance:</strong> £${outstandingBalance.toFixed(2)}
        </p>
      `;
        summaryCards.appendChild(card);
    });

    // Update totals
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    document.getElementById('totalEarnings').textContent = `£${totalEarnings.toFixed(2)}`;
    
    // New totals for payments
    if (document.getElementById('totalPaymentsReceived')) {
        document.getElementById('totalPaymentsReceived').textContent = `£${totalPaymentsReceived.toFixed(2)}`;
    }
    
    if (document.getElementById('totalOutstanding')) {
        document.getElementById('totalOutstanding').textContent = `£${totalOutstanding.toFixed(2)}`;
    }
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
    
    // Also set the payment date if the element exists
    const paymentDateInput = document.getElementById('paymentDate');
    if (paymentDateInput) {
        paymentDateInput.value = dateString;
    }
}

// Initialize
window.onload = function() {
    loadData();
    setDefaultDate();
};