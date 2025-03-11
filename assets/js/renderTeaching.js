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
            const courseItem = document.createElement("div");
  
            // Split the gradient string into two class names
            const gradientClasses = course.gradient.split(" ");
            courseItem.classList.add("bg-gradient-to-br", ...gradientClasses, "p-4", "rounded-lg", "shadow-sm");
  
            // Create the HTML structure for each course
            courseItem.innerHTML = `
              <div class="flex items-start">
                <i class="fa-solid fa-chalkboard-teacher text-indigo-500 mr-3 mt-1"></i>
                <div>
                  <p class="text-gray-800 font-medium">${course.title}</p>
                  <p class="text-gray-600 text-sm">
                    <i class="fa-solid fa-calendar-check text-red-500 mr-1"></i> ${course.date}
                  </p>
                  ${course.location ? `
                    <p class="text-gray-600 text-sm">
                      <i class="fa-solid fa-location-pin text-purple-500 mr-1"></i> ${course.location}
                    </p>
                  ` : ""}
                </div>
              </div>
            `;
  
            // Append the course item to the grid
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