// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSSwli-4hCHRg9Q5H2_ob2dCE9SoVKixY",
  authDomain: "login-for-my-page.firebaseapp.com",
  projectId: "login-for-my-page",
  storageBucket: "login-for-my-page.firebasestorage.app",
  messagingSenderId: "347084125861",
  appId: "1:347084125861:web:b6e1e22eec72b0f6227f4c",
  measurementId: "G-W4L5TF3GLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupButton = document.getElementById('signup');
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
    // Load quiz questions and logic here
    if (isPractice) {
        // Practice mode logic
        quizContainer.innerHTML = "<h2>Practice Mode</h2>";
    } else {
        // Quiz mode logic
        quizContainer.innerHTML = "<h2>Quiz Mode</h2>";
    }
}