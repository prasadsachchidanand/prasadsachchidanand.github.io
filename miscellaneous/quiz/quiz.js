/********************************
 * quiz.js
 * - Loads questions from questions.json
 * - Randomizes 10 questions uniquely per user
 * - Implements a quiz timer (duration set in the setup)
 * - Provides navigation between questions (Previous/Next)
 * - Saves user answers, grades the quiz (+1 for correct, -1/3 for wrong if attempted, 0 if unattempted)
 * - Submits score (name, email, score, time taken) to Google Sheets via Google Apps Script
 * - Displays detailed results
 *******************************/

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyd1K3MJaYbHjBqrHwKdLRPe6Aprfw086fbyAR99eMoYtQReQANQKvTgCrdGu-m9EVA2w/exec";
let quizQuestions = [];
let currentQuestion = 0;
let quizDuration; // in seconds
let timerInterval;
let startTime;

const CORRECT_SCORE = 1;
const WRONG_SCORE = -1/3;
const QUESTIONS_JSON = "questions.json";

// Fisher-Yates shuffle
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Load questions from questions.json
// Load questions from questions.json
function loadQuestions() {
    fetch(QUESTIONS_JSON)
    .then(response => response.json())
    .then(data => {
    // Get the selected category from the dropdown
    const selectedCategory = document.getElementById("category-select").value;
    let filteredData = data;
    
    // If a specific category is chosen, filter questions by checking the "tags" property
    if (selectedCategory !== "all") {
        filteredData = data.filter(q => q.tags && q.tags.includes(selectedCategory));
    }
    
    // Check if there are enough questions; if not, warn the user or use all available
    if (filteredData.length < 10) {
        alert(`Only ${filteredData.length} questions found for category "${selectedCategory}". The quiz will use all available questions.`);
    }
    
    // Shuffle and select up to 10 questions
    quizQuestions = shuffle(filteredData).slice(0, 10);
    renderQuestion();
    updateQuestionCounter();
    startTimer();
    if (window.MathJax) MathJax.typeset();
    })
    .catch(err => console.error("Error loading questions:", err));
}  

// Render the current question
function renderQuestion() {
  const questionObj = quizQuestions[currentQuestion];
  const container = document.getElementById("question-container");
  container.innerHTML = "";
  
  // Render question text
  const qText = document.createElement("div");
  qText.className = "text-xl mb-4";
  qText.innerHTML = `<p>${questionObj.question}</p>`;
  container.appendChild(qText);
  
  // Render options as checkboxes
  if (questionObj.choices && questionObj.choices.length > 0) {
    questionObj.choices.forEach(choice => {
      const optionLabel = document.createElement("label");
      optionLabel.className = "flex items-center space-x-2 mb-2";
      optionLabel.innerHTML = `<input type="checkbox" name="q${currentQuestion}" value="${choice}" class="mr-2"> <span>${choice}</span>`;
      container.appendChild(optionLabel);
    });
  }
  
  // Restore saved answers if any
  if (questionObj.userAnswers) {
    const checkboxes = document.getElementsByName("q" + currentQuestion);
    checkboxes.forEach(chk => {
      if (questionObj.userAnswers.includes(chk.value)) {
        chk.checked = true;
      }
    });
  }
  
  if (window.MathJax) MathJax.typeset();
}

// Update question counter
function updateQuestionCounter() {
  document.getElementById("question-counter").textContent = `Question ${currentQuestion + 1}/${quizQuestions.length}`;
}

// Timer functions
function startTimer() {
  const quizTimeInput = document.getElementById("quiz-time");
  quizDuration = parseInt(quizTimeInput.value) * 60; // convert minutes to seconds
  startTime = Date.now();
  updateTimerDisplay(quizDuration);
  timerInterval = setInterval(() => {
    quizDuration--;
    updateTimerDisplay(quizDuration);
    if (quizDuration <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById("timer").textContent = `Time: ${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Save current answers
function saveCurrentAnswers() {
  const checkboxes = document.querySelectorAll(`[name="q${currentQuestion}"]:checked`);
  const answers = Array.from(checkboxes).map(chk => chk.value);
  quizQuestions[currentQuestion].userAnswers = answers;
}

// Navigation buttons
document.getElementById("next-btn").addEventListener("click", () => {
  saveCurrentAnswers();
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    renderQuestion();
    updateQuestionCounter();
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  saveCurrentAnswers();
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
    updateQuestionCounter();
  }
});

// Finish Quiz and grade
document.getElementById("finish-btn").addEventListener("click", finishQuiz);
function finishQuiz() {
  clearInterval(timerInterval);
  saveCurrentAnswers();
  gradeQuiz();
  showResults();
}

// Grading: +1 for correct, -1/3 for wrong (if attempted), 0 if unattempted
function gradeQuiz() {
  let totalScore = 0;
  quizQuestions.forEach(q => {
    const userAns = q.userAnswers || [];
    if (userAns.length === 0) return; // unattempted => 0
    // Assume a single correct answer per question
    const isCorrect = userAns.includes(q.correct);
    totalScore += isCorrect ? CORRECT_SCORE : WRONG_SCORE;
  });
  document.getElementById("score-display").textContent = `${totalScore}/${quizQuestions.length}`;
  document.getElementById("percentage-display").textContent = `Score: ${((totalScore / quizQuestions.length) * 100).toFixed(2)}%`;
  const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  
  // Submit score to Google Sheets
  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, score: totalScore, timeTaken: timeTaken }),
    mode: "no-cors"
  })
//   .then(response => response.json())
  .then(() => console.log("Score stored (no-cors)"))
  .then(data => console.log("Score stored:", data))
  .catch(err => console.error("Error storing score:", err));
}  

// Show results screen with detailed results
function showResults() {
  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("results-screen").classList.remove("hidden");
  renderResults();
}

function renderResults() {
  const container = document.getElementById("results-container");
  container.innerHTML = "";
  quizQuestions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "p-4 border rounded bg-gray-50 mb-4";
    const qText = `<strong>Q${i+1}:</strong> ${q.question}`;
    const userAnswer = (q.userAnswers || []).join(', ') || 'Unattempted';
    const correctAnswer = q.correct;
    div.innerHTML = `${qText}<br><strong>Your Answer:</strong> ${userAnswer}<br><strong>Correct Answer:</strong> ${correctAnswer}`;
    container.appendChild(div);
  });
  if (window.MathJax) MathJax.typeset();
}

// Start Quiz when user clicks Start Quiz
document.getElementById("start-quiz-btn").addEventListener("click", () => {
  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  document.getElementById("finish-btn").classList.remove("hidden");
  loadQuestions();
});

// Retry Quiz button reloads the page
document.getElementById("retry-btn").addEventListener("click", () => {
  location.reload();
});
