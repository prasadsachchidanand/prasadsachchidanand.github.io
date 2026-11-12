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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ---------------------------------------------------------------------------
// Currencies
// ---------------------------------------------------------------------------

const CURRENCIES = [
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'QAR', name: 'Qatari Riyal' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'OMR', name: 'Omani Rial' }
];

// Everything recorded before currencies were introduced was in GBP.
const LEGACY_CURRENCY = 'GBP';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let students = [];   // { id, name, rate, currency, archived }
let sessions = [];   // { id, studentId, date, duration, completed, rate }
let payments = [];   // { id, studentId, amount, date, notes } (in the student's currency)
let nextStudentId = 1;
let nextSessionId = 1;
let nextPaymentId = 1;
let defaultCurrency = LEGACY_CURRENCY;

// True only once the user's data has been read from Firestore. Saving is refused
// until then, so a failed load can never overwrite the stored records with an empty list.
let dataLoaded = false;
let unsubscribeData = null;
let saveCounter = 0;

// What the lists currently show (not saved)
const viewState = {
    sessionsStudent: '',   // '' = all students
    paymentsStudent: '',
    showArchived: false,
    // month key ("YYYY-MM") -> expanded? Months not listed fall back to "only the newest is open".
    openMonths: { sessions: {}, payments: {} }
};

const INPUT_CLASS = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700';
const MODAL_IDS = ['forgotPasswordModal', 'signUpModal', 'settingsModal', 'editModal'];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function $(id) {
    return document.getElementById(id);
}

function setVisible(elOrId, visible) {
    const el = typeof elOrId === 'string' ? $(elOrId) : elOrId;
    if (el) el.classList.toggle('hidden', !visible);
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

const moneyFormatters = {};
function formatMoney(amount, currency) {
    if (!moneyFormatters[currency]) {
        try {
            moneyFormatters[currency] = new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency });
        } catch (e) {
            moneyFormatters[currency] = { format: n => `${currency} ${n.toFixed(2)}` };
        }
    }
    // Round away floating-point noise (and -0) before formatting
    const rounded = Math.round(amount * 1000) / 1000 || 0;
    return moneyFormatters[currency].format(rounded);
}

function addMoney(totals, currency, amount) {
    totals[currency] = (totals[currency] || 0) + amount;
}

// Default currency first, then alphabetical. Different currencies are never added together.
function sortedCurrencyCodes(totals) {
    return Object.keys(totals).sort((a, b) =>
        (b === defaultCurrency) - (a === defaultCurrency) || a.localeCompare(b));
}

function moneyTotalsText(totals) {
    return sortedCurrencyCodes(totals).map(code => formatMoney(totals[code], code)).join(' + ');
}

// Show one line per currency
function renderMoneyTotals(el, totals) {
    el.innerHTML = '';
    const codes = sortedCurrencyCodes(totals);
    if (codes.length === 0) {
        el.textContent = formatMoney(0, defaultCurrency);
        return;
    }
    codes.forEach(code => {
        const line = document.createElement('div');
        line.textContent = formatMoney(totals[code], code);
        el.appendChild(line);
    });
}

function currencyOptionsHtml(selected) {
    const list = !selected || CURRENCIES.some(c => c.code === selected)
        ? CURRENCIES
        : [...CURRENCIES, { code: selected, name: selected }];
    return list.map(c =>
        `<option value="${escapeHtml(c.code)}" ${c.code === selected ? 'selected' : ''}>${escapeHtml(c.code)} – ${escapeHtml(c.name)}</option>`
    ).join('');
}

function findStudent(id) {
    return students.find(s => s.id === id);
}

function studentCurrency(student) {
    return student.currency || LEGACY_CURRENCY;
}

function sessionAmount(session) {
    return session.completed ? session.rate * session.duration : 0;
}

// Active students by name, then (optionally) archived ones
function studentOptionsHtml(selectedId, includeArchived = true) {
    const byName = (a, b) => a.name.localeCompare(b.name);
    const active = students.filter(s => !s.archived).sort(byName);
    const archived = includeArchived ? students.filter(s => s.archived).sort(byName) : [];
    return [...active, ...archived].map(s =>
        `<option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${escapeHtml(s.name)}${s.archived ? ' (archived)' : ''}</option>`
    ).join('');
}

// Should this student's records appear, given a list's student filter ('' = all)?
function isStudentShown(student, filterValue) {
    if (filterValue) return student.id === Number(filterValue);
    return viewState.showArchived || !student.archived;
}

function monthKey(dateString) {
    return String(dateString).slice(0, 7); // "YYYY-MM"
}

function monthLabel(key) {
    const [y, m] = key.split('-').map(Number);
    if (!y || !m) return 'No date';
    return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function plural(n, word) {
    return `${n} ${word}${n === 1 ? '' : 's'}`;
}

// Dates are stored as "YYYY-MM-DD". Parse them as local dates: new Date("2025-04-18")
// is UTC midnight, which shows as the previous day in timezones behind UTC.
function formatDate(dateString) {
    const [y, m, d] = String(dateString).split('-').map(Number);
    if (!y || !m || !d) return dateString;
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function todayString() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
}

function byDateNewestFirst(a, b) {
    return String(b.date).localeCompare(String(a.date)) || b.id - a.id;
}

function formatHours(hours) {
    return String(Math.round(hours * 100) / 100);
}

function td(row, content, className = '') {
    const cell = document.createElement('td');
    cell.className = `p-3 ${className}`.trim();
    if (content instanceof Node) {
        cell.appendChild(content);
    } else {
        cell.textContent = content;
    }
    row.appendChild(cell);
    return cell;
}

function actionButtons(buttons) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-2';
    buttons.forEach(([label, className, onClick]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.className = `${className} text-white px-2 py-1 rounded-lg transition duration-200`;
        btn.onclick = onClick;
        wrapper.appendChild(btn);
    });
    return wrapper;
}

const EDIT_BUTTON = 'bg-blue-500 hover:bg-blue-600';
const DELETE_BUTTON = 'bg-red-500 hover:bg-red-600';

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

function authErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Incorrect email or password. Please try again.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password is too weak. Use at least 6 characters.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return error.message || 'An error occurred. Please try again.';
    }
}

function login() {
    const email = $('emailInput').value.trim();
    const password = $('passwordInput').value;
    const loginError = $('loginError');

    if (!email || !password) {
        loginError.textContent = 'Please enter both email and password.';
        return;
    }

    loginError.textContent = '';
    // On success, onAuthStateChanged shows the app.
    auth.signInWithEmailAndPassword(email, password)
        .then(() => { $('passwordInput').value = ''; })
        .catch(error => {
            console.error('Login error:', error.code, error.message);
            loginError.textContent = authErrorMessage(error);
        });
}

function logout() {
    auth.signOut().catch(error => console.error('Error logging out:', error));
}

function signUp() {
    const submitButton = document.querySelector('#signUpForm button[type="submit"]');
    const errorEl = $('signUpError');
    const email = $('signUpEmail').value.trim();
    const password = $('signUpPassword').value;
    const confirmPassword = $('signUpConfirmPassword').value;

    errorEl.textContent = '';
    if (!email || !password || !confirmPassword) {
        errorEl.textContent = 'Please fill in all fields.';
        return;
    }
    if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match.';
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Signing Up...';

    // Firebase signs the new user in automatically; onAuthStateChanged shows the app.
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => closeModal('signUpModal'))
        .catch(error => { errorEl.textContent = authErrorMessage(error); })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Up';
        });
}

function resetPassword() {
    const email = $('forgotPasswordEmail').value.trim();
    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('If an account exists with this email, a password reset link has been sent. Check your inbox.');
            closeModal('forgotPasswordModal');
        })
        .catch(error => alert(authErrorMessage(error)));
}

function changePassword() {
    const currentPassword = $('currentPassword').value;
    const newPassword = $('newPassword').value;
    const confirmPassword = $('confirmPassword').value;
    const user = auth.currentUser;

    if (!user) {
        alert('No user is signed in.');
        return;
    }
    if (!currentPassword) {
        alert('Please enter your current password.');
        return;
    }
    if (!newPassword) {
        alert('New password cannot be empty.');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        return;
    }

    const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    user.reauthenticateWithCredential(credential)
        .then(() => user.updatePassword(newPassword))
        .then(() => {
            closeModal('settingsModal');
            alert('Password updated successfully. Please log in again.');
            return auth.signOut();
        })
        .then(() => {
            $('loginError').textContent = 'Password updated! Log in with your new password.';
        })
        .catch(error => {
            if (['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(error.code)) {
                alert('Current password is incorrect.');
            } else {
                alert('Error updating password: ' + authErrorMessage(error));
            }
        });
}

auth.onAuthStateChanged(user => {
    closeAllModals();
    if (user) {
        setVisible('loginScreen', false);
        setVisible('appContainer', false);
        setVisible('loadingScreen', true);
        startDataSync(user);
    } else {
        // Clear everything from the previous account so it can never be saved into another one.
        stopDataSync();
        resetData();
        renderAll();
        setSaveStatus('', '');
        setVisible('loadError', false);
        setVisible('appContainer', false);
        setVisible('loadingScreen', false);
        setVisible('loginScreen', true);
    }
});

// ---------------------------------------------------------------------------
// Loading & saving
// ---------------------------------------------------------------------------

function maxId(list) {
    return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
}

// Bring data saved by older versions of the app (or imported files) into the current shape.
function normalizeData() {
    students.forEach(s => {
        s.id = Number(s.id);
        s.name = String(s.name ?? '');
        s.rate = Number(s.rate) || 0;
        if (!s.currency) s.currency = LEGACY_CURRENCY;
        s.archived = Boolean(s.archived);
    });

    sessions.forEach(s => {
        s.id = Number(s.id);
        s.studentId = Number(s.studentId);
        s.duration = Number(s.duration) || 0;
        s.completed = Boolean(s.completed);
        // Each session keeps the rate it was charged at, so changing a student's
        // rate later doesn't rewrite past charges. Older sessions get the current rate.
        if (s.rate === undefined || s.rate === null || s.rate === '') {
            const student = findStudent(s.studentId);
            s.rate = student ? student.rate : 0;
        }
        s.rate = Number(s.rate) || 0;
        delete s.amount; // stale cached value from older versions; amounts are always computed
    });

    payments.forEach(p => {
        p.id = Number(p.id);
        p.studentId = Number(p.studentId);
        p.amount = Number(p.amount) || 0;
        p.notes = String(p.notes ?? '');
    });

    nextStudentId = Math.max(nextStudentId, maxId(students) + 1);
    nextSessionId = Math.max(nextSessionId, maxId(sessions) + 1);
    nextPaymentId = Math.max(nextPaymentId, maxId(payments) + 1);
}

function applyData(data) {
    students = Array.isArray(data.students) ? data.students : [];
    sessions = Array.isArray(data.sessions) ? data.sessions : [];
    payments = Array.isArray(data.payments) ? data.payments : [];
    nextStudentId = Number(data.nextStudentId) || 1;
    nextSessionId = Number(data.nextSessionId) || 1;
    nextPaymentId = Number(data.nextPaymentId) || 1;
    defaultCurrency = data.defaultCurrency || LEGACY_CURRENCY;
    normalizeData();
}

function resetData() {
    applyData({});
    dataLoaded = false;
}

// Listen to the user's document so every open tab/device always shows the latest data.
// This prevents a tab left open on another device from overwriting newer changes with old data.
function startDataSync(user) {
    stopDataSync();
    dataLoaded = false;

    unsubscribeData = db.collection('users').doc(user.uid).onSnapshot(snapshot => {
        // While offline the cache may report "no document" before the server answers.
        // Don't treat that as an empty account, or the first save would wipe the real data.
        if (!snapshot.exists && snapshot.metadata.fromCache) return;

        const wasLoaded = dataLoaded;
        const previousDefault = defaultCurrency;
        applyData(snapshot.exists ? snapshot.data() : {});
        dataLoaded = true;

        if (!wasLoaded || previousDefault !== defaultCurrency) {
            $('studentCurrency').value = defaultCurrency;
        }
        setVisible('loadError', false);
        renderAll();
        setVisible('loadingScreen', false);
        setVisible('appContainer', true);
    }, error => {
        console.error('Error loading data:', error);
        if (!dataLoaded) {
            resetData();
            renderAll();
        }
        setVisible('loadError', true);
        setVisible('loadingScreen', false);
        setVisible('appContainer', true);
    });
}

function stopDataSync() {
    if (unsubscribeData) {
        unsubscribeData();
        unsubscribeData = null;
    }
}

function setSaveStatus(state, text) {
    const el = $('saveStatus');
    const colours = { saving: 'text-gray-500', ok: 'text-green-600', error: 'text-red-600' };
    el.className = `text-sm ${colours[state] || 'text-gray-500'}`;
    el.textContent = text;
}

function saveData() {
    const user = auth.currentUser;
    if (!user) return;

    if (!dataLoaded) {
        setSaveStatus('error', 'Not saved – your data has not loaded. Reload the page.');
        return;
    }

    const thisSave = ++saveCounter;
    setSaveStatus('saving', 'Saving…');

    db.collection('users').doc(user.uid).set({
        students: students,
        sessions: sessions,
        payments: payments,
        nextStudentId: nextStudentId,
        nextSessionId: nextSessionId,
        nextPaymentId: nextPaymentId,
        defaultCurrency: defaultCurrency
    })
        .then(() => {
            if (thisSave === saveCounter) setSaveStatus('ok', 'All changes saved');
        })
        .catch(error => {
            console.error('Error saving data:', error);
            setSaveStatus('error', 'Save failed – check your connection');
        });
}

// ---------------------------------------------------------------------------
// Modals, tabs & settings
// ---------------------------------------------------------------------------

function openModal(id) {
    setVisible(id, true);
}

function closeModal(id) {
    setVisible(id, false);
    if (id === 'settingsModal') $('changePasswordForm').reset();
    if (id === 'signUpModal') $('signUpForm').reset();
}

function closeAllModals() {
    MODAL_IDS.forEach(closeModal);
}

function openSignUpModal() {
    $('signUpForm').reset();
    $('signUpError').textContent = '';
    openModal('signUpModal');
    $('signUpEmail').focus();
}

function openForgotPasswordModal() {
    $('forgotPasswordEmail').value = $('emailInput').value;
    openModal('forgotPasswordModal');
    $('forgotPasswordEmail').focus();
}

function openSettings() {
    $('defaultCurrency').innerHTML = currencyOptionsHtml(defaultCurrency);
    openModal('settingsModal');
}

function changeDefaultCurrency(code) {
    defaultCurrency = code;
    $('studentCurrency').value = code;
    renderAll();
    saveData();
}

// Opens the shared edit dialog. onSave returns true when the dialog should close.
function openEditModal(title, fieldsHtml, onSave) {
    $('editModalTitle').textContent = title;
    $('editModalFields').innerHTML = fieldsHtml;
    $('editModalForm').onsubmit = event => {
        event.preventDefault();
        if (onSave()) closeModal('editModal');
    };
    openModal('editModal');
    const firstField = $('editModalFields').querySelector('input, select');
    if (firstField) firstField.focus();
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => setVisible(el, el.id === tabName));
    document.querySelectorAll('.tab').forEach(tab => {
        const active = tab.dataset.tab === tabName;
        tab.classList.toggle('bg-green-500', active);
        tab.classList.toggle('text-white', active);
        tab.classList.toggle('bg-gray-200', !active);
    });
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderAll() {
    updateStudentDropdowns();
    renderStudents();
    renderSessions();
    renderPayments();
    renderSummary();
}

function updateStudentDropdowns() {
    const fill = (id, placeholder, includeArchived) => {
        const select = $(id);
        const previous = select.value;
        select.innerHTML = `<option value="">${placeholder}</option>` + studentOptionsHtml(undefined, includeArchived);
        // Keep the current choice if it is still available
        if ([...select.options].some(o => o.value === previous)) select.value = previous;
        return select.value;
    };
    // Archived students can't get new sessions/payments, but can still be looked up
    fill('sessionStudent', 'Select Student', false);
    fill('paymentStudent', 'Select Student', false);
    viewState.sessionsStudent = fill('sessionFilterStudent', 'All students', true);
    viewState.paymentsStudent = fill('paymentFilterStudent', 'All students', true);

    // Only offer "Show archived students" once there are some
    const anyArchived = students.some(s => s.archived);
    document.querySelectorAll('.archived-toggle-wrap').forEach(el => setVisible(el, anyArchived));
    document.querySelectorAll('.show-archived-toggle').forEach(el => { el.checked = viewState.showArchived; });

    updateSessionRateHint();
    updatePaymentCurrencyLabel();
}

function updateSessionRateHint() {
    const student = findStudent(parseInt($('sessionStudent').value));
    $('sessionRateHint').textContent = student
        ? `· ${formatMoney(student.rate, studentCurrency(student))}/hour`
        : '';
}

function setStudentFilter(listName, value) {
    if (listName === 'sessions') {
        viewState.sessionsStudent = value;
        renderSessions();
    } else {
        viewState.paymentsStudent = value;
        renderPayments();
    }
}

function setShowArchived(show) {
    viewState.showArchived = show;
    renderAll();
}

function setAllMonths(listName, open) {
    const items = listName === 'sessions' ? sessions : payments;
    items.forEach(item => { viewState.openMonths[listName][monthKey(item.date)] = open; });
    if (listName === 'sessions') renderSessions(); else renderPayments();
}

// Footer label that says what the total covers
function totalLabel(filterValue) {
    const student = filterValue ? findStudent(Number(filterValue)) : null;
    if (student) return `Total for ${student.name}:`;
    if (!viewState.showArchived && students.some(s => s.archived)) return 'Total (active students):';
    return 'Total:';
}

// Renders items (already sorted newest first) into tbody as collapsible month groups.
// Only the newest month starts open; the user's choices are remembered in viewState.
function renderMonthGroups(tbody, listName, items, options) {
    tbody.innerHTML = '';

    if (items.length === 0) {
        const row = document.createElement('tr');
        const cell = td(row, options.emptyText, 'text-center text-gray-500');
        cell.colSpan = options.colspan;
        tbody.appendChild(row);
        return;
    }

    const groups = new Map();
    items.forEach(item => {
        const key = monthKey(item.date);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
    });

    const openState = viewState.openMonths[listName];
    let isNewest = true;
    groups.forEach((groupItems, key) => {
        const isOpen = key in openState ? openState[key] : isNewest;
        isNewest = false;

        const header = document.createElement('tr');
        header.className = 'bg-gray-100 hover:bg-gray-200 border-b cursor-pointer';
        header.onclick = () => {
            openState[key] = !isOpen;
            options.rerender();
        };
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'w-full text-left flex flex-wrap items-baseline gap-x-3 gap-y-1';
        button.setAttribute('aria-expanded', String(isOpen));
        button.innerHTML = `
            <span class="font-semibold text-gray-800">${isOpen ? '▾' : '▸'} ${escapeHtml(monthLabel(key))}</span>
            <span class="text-sm text-gray-600">${escapeHtml(options.describe(groupItems))}</span>`;
        const cell = td(header, button);
        cell.colSpan = options.colspan;
        tbody.appendChild(header);

        if (isOpen) groupItems.forEach(item => tbody.appendChild(options.renderRow(item)));
    });
}

function updatePaymentCurrencyLabel() {
    const student = findStudent(parseInt($('paymentStudent').value));
    $('paymentAmountLabel').textContent = student ? `Amount (${studentCurrency(student)})` : 'Amount';
}

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------

function addStudent() {
    const nameInput = $('studentName');
    const rateInput = $('hourlyRate');
    const name = nameInput.value.trim();
    const rate = parseFloat(rateInput.value);
    const currency = $('studentCurrency').value || defaultCurrency;

    if (!name) {
        alert('Please enter a student name');
        return;
    }
    if (isNaN(rate) || rate <= 0) {
        alert('Please enter a valid hourly rate');
        return;
    }

    students.push({ id: nextStudentId++, name: name, rate: rate, currency: currency, archived: false });

    nameInput.value = '';
    rateInput.value = '';

    renderAll();
    saveData();
}

function renderStudents() {
    const tbody = $('studentsBody');
    tbody.innerHTML = '';

    // Active students first, archived ones at the bottom
    const ordered = [...students.filter(s => !s.archived), ...students.filter(s => s.archived)];
    ordered.forEach(student => {
        const row = document.createElement('tr');
        row.className = student.archived ? 'border-b text-gray-400' : 'border-b';

        const name = document.createDocumentFragment();
        name.append(student.name);
        if (student.archived) {
            const badge = document.createElement('span');
            badge.className = 'ml-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs';
            badge.textContent = 'Archived';
            name.append(badge);
        }
        td(row, name);
        td(row, studentCurrency(student));
        td(row, formatMoney(student.rate, studentCurrency(student)), 'whitespace-nowrap');
        td(row, actionButtons([
            ['Edit', EDIT_BUTTON, () => editStudent(student.id)],
            student.archived
                ? ['Restore', 'bg-green-500 hover:bg-green-600', () => setStudentArchived(student.id, false)]
                : ['Archive', 'bg-gray-500 hover:bg-gray-600', () => setStudentArchived(student.id, true)],
            ['Delete', DELETE_BUTTON, () => deleteStudent(student.id)]
        ]));
        tbody.appendChild(row);
    });
}

function editStudent(id) {
    const student = findStudent(id);
    if (!student) return;

    openEditModal('Edit Student', `
        <div>
          <label for="editStudentName" class="${LABEL_CLASS}">Student Name</label>
          <input type="text" id="editStudentName" value="${escapeHtml(student.name)}" class="${INPUT_CLASS}">
        </div>
        <div>
          <label for="editStudentCurrency" class="${LABEL_CLASS}">Currency</label>
          <select id="editStudentCurrency" class="${INPUT_CLASS}">${currencyOptionsHtml(studentCurrency(student))}</select>
          <p class="mt-1 text-xs text-gray-500">Applies to all of this student's sessions and payments. Amounts are relabelled, not converted.</p>
        </div>
        <div>
          <label for="editStudentRate" class="${LABEL_CLASS}">Hourly Rate</label>
          <input type="number" id="editStudentRate" min="0" step="any" value="${student.rate}" class="${INPUT_CLASS}">
        </div>
        <label class="flex items-start text-sm text-gray-700">
          <input type="checkbox" id="editStudentApplyRate" class="mr-2 mt-1">
          <span>Also apply this rate to this student's existing sessions (otherwise past sessions keep the rate they were charged at)</span>
        </label>
    `, () => {
        const name = $('editStudentName').value.trim();
        const rate = parseFloat($('editStudentRate').value);
        const currency = $('editStudentCurrency').value;
        const applyToPast = $('editStudentApplyRate').checked;

        if (!name) {
            alert('Please enter a student name');
            return false;
        }
        if (isNaN(rate) || rate <= 0) {
            alert('Please enter a valid hourly rate');
            return false;
        }

        // Look the student up again: data may have been refreshed while the dialog was open.
        const current = findStudent(id);
        if (!current) return true;
        current.name = name;
        current.rate = rate;
        current.currency = currency;
        if (applyToPast) {
            sessions.filter(s => s.studentId === id).forEach(s => { s.rate = rate; });
        }

        renderAll();
        saveData();
        return true;
    });
}

function deleteStudent(id) {
    const student = findStudent(id);
    if (!student) return;

    const sessionCount = sessions.filter(s => s.studentId === id).length;
    const paymentCount = payments.filter(p => p.studentId === id).length;
    if (!confirm(`Delete ${student.name}? This also deletes their ${sessionCount} session(s) and ${paymentCount} payment(s).`)) {
        return;
    }

    students = students.filter(s => s.id !== id);
    sessions = sessions.filter(s => s.studentId !== id);
    payments = payments.filter(p => p.studentId !== id);

    renderAll();
    saveData();
}

// Archiving hides a past student from lists, dropdowns and totals without deleting anything.
function setStudentArchived(id, archived) {
    const student = findStudent(id);
    if (!student) return;

    if (archived) {
        const owed = studentTotals(student).outstanding;
        if (owed > 0.005 && !confirm(
            `${student.name} still owes ${formatMoney(owed, studentCurrency(student))}. Archive anyway?\n\n` +
            'Archived students are hidden from lists and totals, but nothing is deleted. You can restore them from Manage Students.')) {
            return;
        }
    }

    student.archived = archived;
    renderAll();
    saveData();
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

function addSession() {
    const studentId = parseInt($('sessionStudent').value);
    const date = $('sessionDate').value;
    const duration = parseFloat($('sessionDuration').value);
    const completed = $('sessionCompleted').checked;

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

    const student = findStudent(studentId);
    if (!student) {
        alert('Selected student not found');
        return;
    }

    sessions.push({
        id: nextSessionId++,
        studentId: studentId,
        date: date,
        duration: duration,
        completed: completed,
        rate: student.rate
    });
    // Make sure the month the session was added to is open, so it's visible
    viewState.openMonths.sessions[monthKey(date)] = true;

    $('sessionDate').value = todayString();
    $('sessionDuration').value = '1';
    $('sessionCompleted').checked = true;

    renderSessions();
    renderSummary();
    saveData();
}

function sessionRow(session) {
    const student = findStudent(session.studentId);
    const currency = studentCurrency(student);

    const row = document.createElement('tr');
    row.className = 'border-b';
    td(row, student.name);
    td(row, formatDate(session.date), 'whitespace-nowrap');
    td(row, formatHours(session.duration));
    td(row, formatMoney(session.rate, currency), 'whitespace-nowrap');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = session.completed;
    checkbox.onchange = () => toggleSessionCompletion(session.id, checkbox.checked);
    td(row, checkbox);

    td(row, formatMoney(sessionAmount(session), currency), 'whitespace-nowrap');
    td(row, actionButtons([
        ['Edit', EDIT_BUTTON, () => editSession(session.id)],
        ['Delete', DELETE_BUTTON, () => deleteSession(session.id)]
    ]));
    return row;
}

function describeSessions(list) {
    const totals = {};
    let hours = 0;
    list.forEach(s => {
        addMoney(totals, studentCurrency(findStudent(s.studentId)), sessionAmount(s));
        if (s.completed) hours += s.duration;
    });
    return `${plural(list.length, 'session')} · ${formatHours(hours)} h · ${moneyTotalsText(totals)}`;
}

function renderSessions() {
    const filter = viewState.sessionsStudent;
    const shown = [...sessions].sort(byDateNewestFirst).filter(s => {
        const student = findStudent(s.studentId);
        return student && isStudentShown(student, filter);
    });

    renderMonthGroups($('sessionsBody'), 'sessions', shown, {
        colspan: 7,
        emptyText: sessions.length ? 'No sessions match this filter.' : 'No sessions yet. Add one above.',
        describe: describeSessions,
        renderRow: sessionRow,
        rerender: renderSessions
    });

    const totals = {};
    shown.forEach(s => addMoney(totals, studentCurrency(findStudent(s.studentId)), sessionAmount(s)));
    renderMoneyTotals($('totalAmount'), totals);
    $('sessionsTotalLabel').textContent = totalLabel(filter);
}

function toggleSessionCompletion(id, completed) {
    const session = sessions.find(s => s.id === id);
    if (!session) return;

    session.completed = completed;
    renderSessions();
    renderSummary();
    saveData();
}

function editSession(id) {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    const student = findStudent(session.studentId);
    if (!student) return;

    openEditModal('Edit Session', `
        <div>
          <label for="editStudent" class="${LABEL_CLASS}">Student</label>
          <select id="editStudent" class="${INPUT_CLASS}">${studentOptionsHtml(session.studentId)}</select>
        </div>
        <div>
          <label for="editDate" class="${LABEL_CLASS}">Date</label>
          <input type="date" id="editDate" value="${escapeHtml(session.date)}" class="${INPUT_CLASS}">
        </div>
        <div>
          <label for="editDuration" class="${LABEL_CLASS}">Duration (hours)</label>
          <input type="number" id="editDuration" min="0.25" step="0.25" value="${session.duration}" class="${INPUT_CLASS}">
        </div>
        <div>
          <label for="editRate" id="editRateLabel" class="${LABEL_CLASS}">Hourly Rate (${escapeHtml(studentCurrency(student))})</label>
          <input type="number" id="editRate" min="0" step="any" value="${session.rate}" class="${INPUT_CLASS}">
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="editCompleted" ${session.completed ? 'checked' : ''} class="mr-2">
          <label for="editCompleted" class="text-sm text-gray-700">Completed</label>
        </div>
    `, () => {
        const studentId = parseInt($('editStudent').value);
        const date = $('editDate').value;
        const duration = parseFloat($('editDuration').value);
        const rate = parseFloat($('editRate').value);
        const completed = $('editCompleted').checked;

        if (!studentId || !date || isNaN(duration) || duration <= 0 || isNaN(rate) || rate < 0) {
            alert('Please fill in all fields correctly');
            return false;
        }

        const current = sessions.find(s => s.id === id);
        if (!current) return true;
        current.studentId = studentId;
        current.date = date;
        current.duration = duration;
        current.rate = rate;
        current.completed = completed;

        renderSessions();
        renderSummary();
        saveData();
        return true;
    });

    // Switching student switches to that student's rate and currency
    $('editStudent').onchange = () => {
        const selected = findStudent(parseInt($('editStudent').value));
        if (!selected) return;
        $('editRate').value = selected.rate;
        $('editRateLabel').textContent = `Hourly Rate (${studentCurrency(selected)})`;
    };
}

function deleteSession(id) {
    if (!confirm('Are you sure you want to delete this session?')) return;

    sessions = sessions.filter(s => s.id !== id);
    renderSessions();
    renderSummary();
    saveData();
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

function addPayment() {
    const studentId = parseInt($('paymentStudent').value);
    const amount = parseFloat($('paymentAmount').value);
    const date = $('paymentDate').value;
    const notes = $('paymentNotes').value.trim();

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

    payments.push({ id: nextPaymentId++, studentId: studentId, amount: amount, date: date, notes: notes });
    viewState.openMonths.payments[monthKey(date)] = true;

    $('paymentAmount').value = '';
    $('paymentNotes').value = '';

    renderPayments();
    renderSummary();
    saveData();
}

function paymentRow(payment) {
    const student = findStudent(payment.studentId);
    const currency = studentCurrency(student);

    const row = document.createElement('tr');
    row.className = 'border-b';
    td(row, student.name);
    td(row, formatDate(payment.date), 'whitespace-nowrap');
    td(row, formatMoney(payment.amount, currency), 'whitespace-nowrap');
    td(row, payment.notes);
    td(row, actionButtons([
        ['Edit', EDIT_BUTTON, () => editPayment(payment.id)],
        ['Delete', DELETE_BUTTON, () => deletePayment(payment.id)]
    ]));
    return row;
}

function describePayments(list) {
    const totals = {};
    list.forEach(p => addMoney(totals, studentCurrency(findStudent(p.studentId)), p.amount));
    return `${plural(list.length, 'payment')} · ${moneyTotalsText(totals)}`;
}

function renderPayments() {
    const filter = viewState.paymentsStudent;
    const shown = [...payments].sort(byDateNewestFirst).filter(p => {
        const student = findStudent(p.studentId);
        return student && isStudentShown(student, filter);
    });

    renderMonthGroups($('paymentsBody'), 'payments', shown, {
        colspan: 5,
        emptyText: payments.length ? 'No payments match this filter.' : 'No payments yet. Record one above.',
        describe: describePayments,
        renderRow: paymentRow,
        rerender: renderPayments
    });

    const totals = {};
    shown.forEach(p => addMoney(totals, studentCurrency(findStudent(p.studentId)), p.amount));
    renderMoneyTotals($('totalPayments'), totals);
    $('paymentsTotalLabel').textContent = totalLabel(filter);
}

function editPayment(id) {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;
    const student = findStudent(payment.studentId);
    const currency = student ? studentCurrency(student) : defaultCurrency;

    openEditModal('Edit Payment', `
        <div>
          <label for="editPaymentStudent" class="${LABEL_CLASS}">Student</label>
          <select id="editPaymentStudent" class="${INPUT_CLASS}">${studentOptionsHtml(payment.studentId)}</select>
        </div>
        <div>
          <label for="editPaymentDate" class="${LABEL_CLASS}">Payment Date</label>
          <input type="date" id="editPaymentDate" value="${escapeHtml(payment.date)}" class="${INPUT_CLASS}">
        </div>
        <div>
          <label for="editPaymentAmount" id="editPaymentAmountLabel" class="${LABEL_CLASS}">Amount (${escapeHtml(currency)})</label>
          <input type="number" id="editPaymentAmount" min="0.01" step="0.01" value="${payment.amount}" class="${INPUT_CLASS}">
        </div>
        <div>
          <label for="editPaymentNotes" class="${LABEL_CLASS}">Notes</label>
          <input type="text" id="editPaymentNotes" value="${escapeHtml(payment.notes)}" class="${INPUT_CLASS}">
        </div>
    `, () => {
        const studentId = parseInt($('editPaymentStudent').value);
        const date = $('editPaymentDate').value;
        const amount = parseFloat($('editPaymentAmount').value);
        const notes = $('editPaymentNotes').value.trim();

        if (!studentId || !date || isNaN(amount) || amount <= 0) {
            alert('Please fill in all fields correctly');
            return false;
        }

        const current = payments.find(p => p.id === id);
        if (!current) return true;
        current.studentId = studentId;
        current.date = date;
        current.amount = amount;
        current.notes = notes;

        renderPayments();
        renderSummary();
        saveData();
        return true;
    });

    $('editPaymentStudent').onchange = () => {
        const selected = findStudent(parseInt($('editPaymentStudent').value));
        if (selected) $('editPaymentAmountLabel').textContent = `Amount (${studentCurrency(selected)})`;
    };
}

function deletePayment(id) {
    if (!confirm('Are you sure you want to delete this payment?')) return;

    payments = payments.filter(p => p.id !== id);
    renderPayments();
    renderSummary();
    saveData();
}

// ---------------------------------------------------------------------------
// Summary & printing
// ---------------------------------------------------------------------------

function studentTotals(student) {
    const studentSessions = sessions.filter(s => s.studentId === student.id);
    const completedSessions = studentSessions.filter(s => s.completed);
    const studentPayments = payments.filter(p => p.studentId === student.id);

    const hours = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const charges = completedSessions.reduce((sum, s) => sum + sessionAmount(s), 0);
    const paid = studentPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
        sessions: studentSessions,
        payments: studentPayments,
        hours: hours,
        charges: charges,
        paid: paid,
        outstanding: charges - paid
    };
}

function renderSummary() {
    const tbody = $('summaryBody');
    const summaryCards = $('summaryCards');
    tbody.innerHTML = '';
    summaryCards.innerHTML = '';

    let totalHours = 0;
    const totalCharges = {};
    const totalPaid = {};
    const totalOutstanding = {};

    const shownStudents = students.filter(s => isStudentShown(s, ''));
    if (shownStudents.length === 0) {
        const row = document.createElement('tr');
        const cell = td(row, students.length ? 'All students are archived.' : 'No students yet. Add one in Manage Students.', 'text-center text-gray-500');
        cell.colSpan = 7;
        tbody.appendChild(row);
    }
    $('summaryTotalLabel').textContent = totalLabel('').replace('Total', 'Totals');

    shownStudents.forEach(student => {
        const currency = studentCurrency(student);
        const t = studentTotals(student);
        const owes = t.outstanding > 0.005;
        const outstandingClass = owes ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold';

        totalHours += t.hours;
        addMoney(totalCharges, currency, t.charges);
        addMoney(totalPaid, currency, t.paid);
        addMoney(totalOutstanding, currency, t.outstanding);

        const money = amount => formatMoney(amount, currency);

        const row = document.createElement('tr');
        row.className = 'border-b';
        td(row, student.name);
        td(row, money(student.rate), 'whitespace-nowrap');
        td(row, formatHours(t.hours));
        td(row, money(t.charges), 'whitespace-nowrap');
        td(row, money(t.paid), 'whitespace-nowrap');
        td(row, money(t.outstanding), `whitespace-nowrap ${outstandingClass}`);
        td(row, actionButtons([['Print', EDIT_BUTTON, () => printStudentDetails(student.id)]]));
        tbody.appendChild(row);

        const card = document.createElement('div');
        card.className = 'bg-green-50 p-4 rounded-lg';
        card.innerHTML = `
          <h3 class="text-lg font-semibold text-gray-700">${escapeHtml(student.name)}</h3>
          <p class="text-sm text-gray-600"><strong>Rate:</strong> ${money(student.rate)} per hour</p>
          <p class="text-sm text-gray-600"><strong>Total Hours:</strong> ${formatHours(t.hours)}</p>
          <p class="text-sm text-gray-600"><strong>Total Charges:</strong> ${money(t.charges)}</p>
          <p class="text-sm text-gray-600"><strong>Total Paid:</strong> ${money(t.paid)}</p>
          <p class="text-sm ${outstandingClass}"><strong>Outstanding Balance:</strong> ${money(t.outstanding)}</p>
        `;
        const printBtn = document.createElement('button');
        printBtn.type = 'button';
        printBtn.textContent = 'Print Details';
        printBtn.className = 'mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200';
        printBtn.onclick = () => printStudentDetails(student.id);
        card.appendChild(printBtn);
        summaryCards.appendChild(card);
    });

    $('totalHours').textContent = formatHours(totalHours);
    renderMoneyTotals($('totalEarnings'), totalCharges);
    renderMoneyTotals($('totalPaymentsReceived'), totalPaid);
    renderMoneyTotals($('totalOutstanding'), totalOutstanding);
}

function printStudentDetails(studentId) {
    const student = findStudent(studentId);
    if (!student) return;

    const currency = studentCurrency(student);
    const money = amount => formatMoney(amount, currency);
    const t = studentTotals(student);
    const name = escapeHtml(student.name);

    const sessionRows = [...t.sessions].sort(byDateNewestFirst).map(session => `
        <tr>
            <td>${formatDate(session.date)}</td>
            <td>${formatHours(session.duration)}</td>
            <td>${money(session.rate)}</td>
            <td>${session.completed ? 'Completed' : 'Not Completed'}</td>
            <td>${money(sessionAmount(session))}</td>
        </tr>`).join('');

    const paymentRows = [...t.payments].sort(byDateNewestFirst).map(payment => `
        <tr>
            <td>${formatDate(payment.date)}</td>
            <td>${money(payment.amount)}</td>
            <td>${escapeHtml(payment.notes)}</td>
        </tr>`).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Student Details: ${name}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        h2 { color: #2d3748; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background-color: #f7fafc; }
        .summary { margin-top: 30px; padding: 15px; background-color: #f7fafc; border-radius: 5px; }
        .summary p { margin: 5px 0; }
        .outstanding { font-weight: bold; color: ${t.outstanding > 0.005 ? '#e53e3e' : '#38a169'}; }
        @media print { body { padding: 0; } button { display: none; } }
    </style>
</head>
<body>
    <h1>Student Details: ${name}</h1>
    <p><strong>Current Hourly Rate:</strong> ${money(student.rate)}</p>
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Hours:</strong> ${formatHours(t.hours)}</p>
        <p><strong>Total Charges:</strong> ${money(t.charges)}</p>
        <p><strong>Total Paid:</strong> ${money(t.paid)}</p>
        <p class="outstanding"><strong>Outstanding Balance:</strong> ${money(t.outstanding)}</p>
    </div>

    <h2>Sessions</h2>
    <table>
        <thead>
            <tr><th>Date</th><th>Duration (hours)</th><th>Rate</th><th>Status</th><th>Amount (${escapeHtml(currency)})</th></tr>
        </thead>
        <tbody>${sessionRows || '<tr><td colspan="5">No sessions</td></tr>'}</tbody>
    </table>

    <h2>Payments</h2>
    <table>
        <thead>
            <tr><th>Date</th><th>Amount (${escapeHtml(currency)})</th><th>Notes</th></tr>
        </thead>
        <tbody>${paymentRows || '<tr><td colspan="3">No payments</td></tr>'}</tbody>
    </table>

    <div style="margin-top: 30px">
        <p>Generated on: ${new Date().toLocaleString('en-GB')}</p>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow pop-ups for this site to print student details.');
        return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
}

// ---------------------------------------------------------------------------
// Export / import
// ---------------------------------------------------------------------------

function exportData() {
    const data = {
        students: students,
        sessions: sessions,
        payments: payments,
        nextStudentId: nextStudentId,
        nextSessionId: nextSessionId,
        nextPaymentId: nextPaymentId,
        defaultCurrency: defaultCurrency
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tuition_data_${todayString()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importData(event) {
    const file = event.target.files[0];
    event.target.value = ''; // allow re-importing the same file
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data.students) || !Array.isArray(data.sessions)) {
                alert('Invalid data format');
                return;
            }
            if (!confirm('Importing will replace ALL your current students, sessions and payments with the contents of this file. Continue?')) {
                return;
            }

            applyData(data);
            dataLoaded = true; // an explicit import is allowed to replace whatever is stored
            $('studentCurrency').value = defaultCurrency;
            renderAll();
            saveData();
            alert('Data imported successfully');
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAllModals();
});

// Clicking the dark backdrop closes a modal
MODAL_IDS.forEach(id => {
    $(id).addEventListener('click', event => {
        if (event.target.id === id) closeModal(id);
    });
});

$('studentCurrency').innerHTML = currencyOptionsHtml(defaultCurrency);
$('sessionDate').value = todayString();
$('paymentDate').value = todayString();
showTab('sessions');
