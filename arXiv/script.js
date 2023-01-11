let question = document.querySelectorAll(".accordion-title");

question.forEach(question => {
   question.addEventListener("click", event => {
      const active = document.querySelector(".accordion-title.active");
      if (active && active !== question) {
         active.classList.toggle("active");
         active.nextElementSibling.style.maxHeight = 0;
      }
      question.classList.toggle("active");
      const details = question.nextElementSibling;
      if (question.classList.contains("active")) {
         details.style.maxHeight = details.scrollHeight + "px";
      } else {
         details.style.maxHeight = 0;
      }
   })
})