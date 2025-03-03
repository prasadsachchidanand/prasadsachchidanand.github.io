// for solution and hint toggle button

function toggleAnswer(id) {
  document.getElementById(id).classList.toggle('hidden');
}

function toggleHint(id) {
  document.getElementById(id).classList.toggle('hidden');
}

function toggleSolution(id) {
  document.getElementById(id).classList.toggle('hidden');
}

// For MCQ problems (See for example 2024-01-07)
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Universal Quiz Script Loaded!");

  const problemContainer = document.querySelector(".problem-container");
  if (!problemContainer) {
    console.error("❌ No problem-container found!");
    return;
  }

  const correctAnswer = problemContainer.getAttribute("data-correct");
  console.log("🟢 Correct Answer:", correctAnswer);

  const optionsContainer = document.querySelector(".options-container");
  const solutionContainer = document.getElementById("solution"); // Solution section
  const radios = document.querySelectorAll("input[name='answer']");

  radios.forEach((radio) => {
    radio.addEventListener("change", function () {
      console.log("🔵 Selected:", this.value);

      // Reset previous styles
      document.querySelectorAll("label span").forEach((option) => {
        option.classList.remove(
          "bg-green-100",
          "bg-red-100",
          "border-green-500",
          "border-red-500"
        );
      });

      // Highlight the selected answer
      const selectedOption = this.closest("label").querySelector("span");
      if (this.value === correctAnswer) {
        selectedOption.classList.add("bg-green-100", "border-green-500");
        document.getElementById("feedback-message").textContent = "✅ Correct! Well done!";
      } else {
        selectedOption.classList.add("bg-red-100", "border-red-500");
        document.getElementById("feedback-message").textContent = `❌ Incorrect! The correct answer is (${correctAnswer}).`;

        // Highlight the correct answer
        const correctOption = document
          .querySelector(`input[value="${correctAnswer}"]`)
          .closest("label")
          .querySelector("span");
        correctOption.classList.add("bg-green-100", "border-green-500");
      }

      // Show feedback
      document.getElementById("feedback").classList.remove("hidden");

      // Disable all radio buttons after selection
      radios.forEach((input) => (input.disabled = true));

      // Show the solution after selecting an answer
      if (solutionContainer) {
        solutionContainer.classList.remove("hidden");
      }

      // Force MathJax to render new content
      MathJax.typesetPromise().then(() => {
        console.log("✅ MathJax updated!");
      });
    });
  });
});