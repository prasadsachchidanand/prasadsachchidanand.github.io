document.addEventListener("DOMContentLoaded", function () {
    // Fetch the education data from the JSON file
    fetch("../data/education.json")
      .then((response) => response.json())
      .then((data) => {
        const container = document.getElementById("education-list");
  
        // Clear any existing content in the container
        container.innerHTML = "";
  
        // Loop through the education data and create HTML elements
        data.forEach((item) => {
          const educationItem = document.createElement("div");
          educationItem.classList.add("border-l-4", "border-indigo-500", "pl-4", "mb-4");
  
          // Create the HTML structure for each education entry
          educationItem.innerHTML = `
            <p class="text-gray-800 font-medium">${item.degree}</p>
            <div class="ml-4"> <!-- Add left margin here -->
              <p class="text-gray-600 text-sm">
                <i class="fa-solid fa-calendar-check text-red-500 mr-1"></i> ${item.date}
              </p>
              <p class="text-gray-700">
                <i class="fa-solid fa-university text-indigo-500 mr-2"></i>
                <a href="${item.link}" target="_blank" class="text-indigo-500 hover:text-indigo-700">${item.institution}</a>, ${item.location}
              </p>
            </div>
          `;
  
          // Append the education item to the container
          container.appendChild(educationItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching education data:", error);
        const container = document.getElementById("education-list");
        container.innerHTML = `<p class="text-red-500">Unable to load education data at this time.</p>`;
      });
  });