// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLDbjdTBk-2K0jm0yXd5sqLnjJRwoH6OQ",
    authDomain: "test-2a290.firebaseapp.com",
    projectId: "test-2a290",
    storageBucket: "test-2a290.firebasestorage.app",
    messagingSenderId: "903905216526",
    appId: "1:903905216526:web:562b30b31933d6870e545f",
    measurementId: "G-1JFR3ZD0W5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupButton = document.getElementById('signup');
const loginButton = document.getElementById('login');
const dashboard = document.getElementById('dashboard');
const authSection = document.getElementById('auth');
const practiceButton = document.getElementById('practice');
const quizButton = document.getElementById('quiz');
const quizContainer = document.getElementById('quiz-container');

// Sign Up
signupButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up successfully
            authSection.style.display = 'none';
            dashboard.style.display = 'block';
        })
        .catch((error) => {
            console.error("Error signing up: ", error);
        });
});

// Login
loginButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Logged in successfully
            authSection.style.display = 'none';
            dashboard.style.display = 'block';
        })
        .catch((error) => {
            console.error("Error logging in: ", error);
        });
});

// Practice Mode
practiceButton.addEventListener('click', () => {
    dashboard.style.display = 'none';
    quizContainer.style.display = 'block';
    loadQuiz(true); // true for practice mode
});

// Quiz Mode
quizButton.addEventListener('click', () => {
    dashboard.style.display = 'none';
    quizContainer.style.display = 'block';
    loadQuiz(false); // false for quiz mode
});

function loadQuiz(isPractice) {
    const questions = [
        { question: "What is 2 + 2?", answers: ["3", "4", "5"], correctAnswer: "4" },
        { question: "What is the capital of France?", answers: ["Paris", "London", "Berlin"], correctAnswer: "Paris" }
    ];

    let quizHTML = "<h2 class='text-xl font-bold mb-6'>" + (isPractice ? "Practice Mode" : "Quiz Mode") + "</h2>";
    questions.forEach((q, index) => {
        quizHTML += `<div class="question mb-6">
                        <h3 class="font-semibold mb-2">${q.question}</h3>
                        ${q.answers.map(answer => `
                            <label class="block mb-2">
                                <input type="radio" name="q${index}" value="${answer}" class="mr-2">
                                ${answer}
                            </label>
                        `).join('')}
                    </div>`;
    });

    quizHTML += `<button id="submit-quiz" class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Submit
                 </button>`;
    quizContainer.innerHTML = quizHTML;

    document.getElementById('submit-quiz').addEventListener('click', () => {
        let score = 0;
        questions.forEach((q, index) => {
            const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
            if (selectedAnswer && selectedAnswer.value === q.correctAnswer) {
                score++;
            }
        });
        alert(`Your score is ${score}/${questions.length}`);
    });
}