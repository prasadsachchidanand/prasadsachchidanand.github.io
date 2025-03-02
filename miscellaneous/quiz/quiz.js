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
      updateNavigationButtons();
      startTimer();
      if (window.MathJax) MathJax.typeset();
    })
    .catch(err => console.error("Error loading questions:", err));
}  

// Render the current question and update navigation buttons
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
  
  updateNavigationButtons();
  if (window.MathJax) MathJax.typeset();
  
  // Update navigation buttons based on the current question
  updateNavButtons();
}

// Update question counter
function updateQuestionCounter() {
  document.getElementById("question-counter").textContent = `Question ${currentQuestion + 1}/${quizQuestions.length}`;
}

// Update navigation button states
function updateNavButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  
  // Disable Previous if at the first question; otherwise, enable it.
  prevBtn.disabled = (currentQuestion === 0);
  
  // Disable Next if at the last question; otherwise, enable it.
  nextBtn.disabled = (currentQuestion === quizQuestions.length - 1);
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

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = currentQuestion === quizQuestions.length - 1;

  prevBtn.classList.toggle("bg-gray-400", currentQuestion === 0);
  prevBtn.classList.toggle("cursor-not-allowed", currentQuestion === 0);
  nextBtn.classList.toggle("bg-gray-400", currentQuestion === quizQuestions.length - 1);
  nextBtn.classList.toggle("cursor-not-allowed", currentQuestion === quizQuestions.length - 1);
}

// Navigation buttons event listeners
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
  // Show the custom confirmation modal
  document.getElementById("confirmation-modal").classList.remove("hidden");
}

// Handle modal buttons
document.getElementById("cancel-submit").addEventListener("click", () => {
  document.getElementById("confirmation-modal").classList.add("hidden"); // Hide modal on cancel
});

document.getElementById("confirm-submit").addEventListener("click", () => {
  // Proceed with quiz submission
  document.getElementById("confirmation-modal").classList.add("hidden");
  clearInterval(timerInterval);
  saveCurrentAnswers();
  gradeQuiz();
  showResults();
});


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
  document.getElementById("score-display").textContent = `${totalScore.toFixed(2)}/${quizQuestions.length}`;
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
    div.className = "p-4 border rounded-lg shadow mt-4";
    
    const userAnswers = q.userAnswers || [];
    const correctAnswers = Array.isArray(q.correct) ? q.correct : [q.correct];
    
    // Determine background color
    let bgColor = "bg-yellow-100"; // Default for unattempted
    if (userAnswers.length > 0) {
      const isCorrect = JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort());
      bgColor = isCorrect ? "bg-green-100" : "bg-red-100";
    }
    
    // Construct answers display
    const userAnswerText = userAnswers.length
      ? userAnswers.join(", ")
      : "<span class='text-gray-700 italic'>Not attempted</span>";
    
    const correctAnswerText = correctAnswers.join(", ");
    
    // Render question and answers
    div.classList.add(bgColor);
    div.innerHTML = `
      <div class="font-semibold">Q${i + 1}: ${q.question}</div>
      <div class="mt-2">
          <span class="font-semibold">Your Answer:</span> ${userAnswerText}
      </div>
      <div class="mt-2">
          <span class="font-semibold">Correct Answer:</span> ${correctAnswerText}
      </div>
    `;
    
    container.appendChild(div);
  });
  
  // Ensure MathJax renders LaTeX properly
  if (window.MathJax) MathJax.typeset();
}

// Function to start the quiz after validation
function startQuiz() {
  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  document.getElementById("finish-btn").classList.remove("hidden");
  loadQuestions();
}

// Retry Quiz button reloads the page
document.getElementById("retry-btn").addEventListener("click", () => {
  location.reload();
});

// Function to load user scores from Google Sheets via the GET endpoint
function loadUserScores(email) {
  fetch(SCRIPT_URL + "?action=getScores") // Assuming your doGet returns all scores
    .then(response => response.json())
    .then(data => {
      // Filter scores for the given email (case-insensitive)
      const userScores = data.filter(score => score.email.toLowerCase() === email.toLowerCase());
      renderUserScores(userScores);
    })
    .catch(err => console.error("Error loading user scores:", err));
}

// Function to render the user's scores in a table with formatted timestamp
function renderUserScores(scores) {
  const container = document.getElementById("user-scores-container");
  container.innerHTML = ""; // Clear previous content
  
  // Make sure the container is visible
  container.classList.remove("hidden");

  if (scores.length === 0) {
    container.innerHTML = "<p>No previous scores found.</p>";
    return;
  }

  // Function to format timestamp
  function formatTimestamp(timestampStr) {
    try {
      const date = new Date(timestampStr);
      
      // Format to YYYY-MM-DD HH:MM
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return timestampStr; // Return original if there's an error
    }
  }

  // Function to format score to 2 decimal places
  function formatScore(score) {
    try {
      // Convert to number if it's a string, then format to 2 decimal places
      return parseFloat(score).toFixed(2);
    } catch (e) {
      console.error("Error formatting score:", e);
      return score; // Return original if there's an error
    }
  }

  // Create a table for better display
  const table = document.createElement("table");
  table.className = "min-w-full border-collapse";
  table.innerHTML = `
    <thead>
      <tr>
        <th class="border px-4 py-2">Timestamp</th>
        <th class="border px-4 py-2">Score (out of 10)</th>
        <th class="border px-4 py-2">Time Taken (s)</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  scores.forEach(score => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2 text-center">${formatTimestamp(score.timestamp)}</td>
      <td class="border px-4 py-2 text-center">${formatScore(score.score)}</td>
      <td class="border px-4 py-2 text-center">${Math.round(score.timeTaken)}</td>
    `;
    tbody.appendChild(row);
  });
  container.appendChild(table);
}

// document.getElementById("view-scores-btn").addEventListener("click", () => {
//   const email = document.getElementById("email").value;
//   if (!email) {
//     alert("Please enter your email in the setup screen to view your previous scores.");
//     return;
//   }
//   loadUserScores(email);
// });

// Function to start the quiz after validation
function startQuiz() {
  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  document.getElementById("finish-btn").classList.remove("hidden");
  
  // Hide the view scores section when quiz starts
  document.getElementById("view-scores-section").classList.add("hidden");
  
  loadQuestions();
}

// Show results screen with detailed results
function showResults() {
  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("results-screen").classList.remove("hidden");
  
  // Show the view scores section when results are displayed
  document.getElementById("view-scores-section").classList.remove("hidden");
  
  renderResults();
}

document.body.insertAdjacentHTML('beforeend', `
  <div id="email-alert-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center hidden z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Email Required</h2>
      <p class="text-gray-700 mb-6">Please enter your email in the setup screen to view your previous scores.</p>
      <div class="flex justify-end">
        <button id="close-email-alert" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">OK</button>
      </div>
    </div>
  </div>
`);

// Add event listener for the close button
document.getElementById("close-email-alert").addEventListener("click", () => {
  document.getElementById("email-alert-modal").classList.add("hidden");
});

// Function to show the custom alert
function showCustomAlert(message) {
  // Update the message if provided
  if (message) {
    document.querySelector("#email-alert-modal p").textContent = message;
  }
  document.getElementById("email-alert-modal").classList.remove("hidden");
}

// Update the view-scores-btn event listener to use our custom alert
document.getElementById("view-scores-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  if (!email) {
    showCustomAlert("Please enter your email in the setup screen to view your previous scores.");
    return;
  }
  loadUserScores(email);
});