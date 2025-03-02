// DOM Elements
const quizTimeInput = document.getElementById('quiz-time');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const categorySelect = document.getElementById('category-select');
const startQuizBtn = document.getElementById('start-quiz-btn');

const quizTimeError = document.getElementById('quiz-time-error');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const categoryError = document.getElementById('category-error');

// Real-time validation for Quiz Duration
quizTimeInput.addEventListener('input', () => {
    const value = parseInt(quizTimeInput.value);
    if (isNaN(value) || value < 1 || value > 120) {
        quizTimeError.classList.remove('hidden');
        quizTimeInput.classList.add('border-red-500');
    } else {
        quizTimeError.classList.add('hidden');
        quizTimeInput.classList.remove('border-red-500');
    }
});

// Real-time validation for Name
nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() === '') {
        nameError.classList.remove('hidden');
        nameInput.classList.add('border-red-500');
    } else {
        nameError.classList.add('hidden');
        nameInput.classList.remove('border-red-500');
    }
});

// Real-time validation for Email
emailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-red-500');
    } else {
        emailError.classList.add('hidden');
        emailInput.classList.remove('border-red-500');
    }
});

// Real-time validation for Category
categorySelect.addEventListener('change', () => {
    if (categorySelect.value === '') {
        categoryError.classList.remove('hidden');
        categorySelect.classList.add('border-red-500');
    } else {
        categoryError.classList.add('hidden');
        categorySelect.classList.remove('border-red-500');
    }
});

// Form submission validation
startQuizBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission

    let isValid = true;

    // Validate Quiz Duration
    const quizTimeValue = parseInt(quizTimeInput.value);
    if (isNaN(quizTimeValue) || quizTimeValue < 1 || quizTimeValue > 120) {
        quizTimeError.classList.remove('hidden');
        quizTimeInput.classList.add('border-red-500');
        isValid = false;
    }

    // Validate Name
    if (nameInput.value.trim() === '') {
        nameError.classList.remove('hidden');
        nameInput.classList.add('border-red-500');
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-red-500');
        isValid = false;
    }

    // Validate Category
    if (categorySelect.value === '') {
        categoryError.classList.remove('hidden');
        categorySelect.classList.add('border-red-500');
        isValid = false;
    }

    // If all fields are valid, proceed with form submission
    // if (isValid) {
    //     alert('Quiz started successfully!');
    //     // Add your logic to start the quiz here
    // }
});