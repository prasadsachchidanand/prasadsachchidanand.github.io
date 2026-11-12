document.addEventListener("DOMContentLoaded", function () {
    // Fetch the teaching data from the JSON file
    fetch("../data/teaching.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const container = document.getElementById("teaching-list");
  
        // Clear any existing content in the container
        container.innerHTML = "";
  
        // Loop through the teaching data and create HTML elements
        data.forEach((institution) => {
          const institutionGroup = document.createElement("div");
          institutionGroup.classList.add("space-y-6", "mb-8"); // Added mb-8 for margin-bottom
  
          // Create the institution heading
          const institutionHeading = document.createElement("h4");
          institutionHeading.classList.add("text-lg", "font-semibold", "text-indigo-700", "mb-2");
          institutionHeading.textContent = institution.institution;
          institutionGroup.appendChild(institutionHeading);
  
          // Create the grid for courses
          const coursesGrid = document.createElement("div");
          coursesGrid.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4");
  
          // Loop through the courses and create HTML elements
          institution.courses.forEach((course) => {
            // Plain card (no gradient): reads well in both light and dark mode
            const courseItem = document.createElement("div");
            courseItem.className = "flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200";
            courseItem.innerHTML = `
              <span class="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center" aria-hidden="true">
                <i class="fa-solid fa-chalkboard-user text-sm"></i>
              </span>
              <div class="min-w-0">
                <p class="text-gray-800 font-medium leading-snug">${course.title}</p>
                <p class="mt-1 text-gray-500 text-sm"><i class="fa-regular fa-calendar mr-1" aria-hidden="true"></i>${course.date}</p>
                ${course.location ? `<p class="text-gray-500 text-sm"><i class="fa-solid fa-location-dot mr-1" aria-hidden="true"></i>${course.location}</p>` : ""}
              </div>
            `;
            coursesGrid.appendChild(courseItem);
          });

          // Append the courses grid to the institution group
          institutionGroup.appendChild(coursesGrid);
  
          // Append the institution group to the container
          container.appendChild(institutionGroup);
        });
      })
      .catch((error) => {
        console.error("Error fetching teaching data:", error);
        const container = document.getElementById("teaching-list");
        container.innerHTML = `<p class="text-red-500">Unable to load teaching data at this time. Error: ${error.message}</p>`;
      });
  });