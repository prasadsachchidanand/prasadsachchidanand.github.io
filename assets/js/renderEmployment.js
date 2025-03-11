document.addEventListener("DOMContentLoaded", function () {
  // Fetch the employment data from the JSON file
  fetch("../data/employment.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("employment-list");

      // Clear any existing content in the container
      container.innerHTML = "";

      // Loop through the employment data and create HTML elements
      data.forEach((item) => {
        const employmentItem = document.createElement("div");
        employmentItem.classList.add("border-l-4", "border-indigo-500", "pl-4", "mb-4");

        // Create the title and date
        employmentItem.innerHTML = `
          <p class="text-gray-800 font-medium">${item.title}</p>
          <div class="ml-4"> <!-- Add left margin here -->
            <p class="text-gray-600 text-sm">
              <i class="fa-solid fa-calendar-check text-red-500 mr-1"></i> ${item.date}
            </p>
        `;

        // Loop through the institutions and add them to the employment item
        item.institutions.forEach((institution) => {
          const institutionElement = document.createElement("p");
          institutionElement.classList.add("text-gray-700", "mt-1");
          institutionElement.innerHTML = `
            <i class="fa-solid fa-university text-indigo-500 mr-2"></i>
            <a href="${institution.link}" target="_blank" class="text-indigo-500 hover:text-indigo-700">${institution.name}</a>, ${institution.location}
          `;
          employmentItem.querySelector(".ml-4").appendChild(institutionElement);
        });

        // Close the left margin container
        employmentItem.innerHTML += `</div>`;

        // Append the employment item to the container
        container.appendChild(employmentItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching employment data:", error);
      const container = document.getElementById("employment-list");
      container.innerHTML = `<p class="text-red-500">Unable to load employment data at this time.</p>`;
    });
});