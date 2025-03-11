document.addEventListener("DOMContentLoaded", function () {
    // Fetch the conference data from the JSON file
    fetch("../data/conferences.json")
      .then((response) => response.json())
      .then((data) => {
        const container = document.getElementById("conferences-list");
  
        // Clear any existing content in the container
        container.innerHTML = "";
  
        // Loop through the conference data and create HTML elements
        data.forEach((item) => {
          const conferenceItem = document.createElement("div");
          conferenceItem.classList.add("bg-gray-50", "p-4", "rounded-lg", "shadow-sm");
  
          // Create the HTML structure for each conference entry
          conferenceItem.innerHTML = `
            <div class="flex items-start">
              <i class="fa-solid fa-calendar-days text-indigo-500 mr-3 mt-1"></i>
              <div class="flex-1">
                <p class="text-gray-800 font-medium">
                  <a href="${item.link}" target="_blank" class="text-indigo-500 hover:text-indigo-700">${item.title}</a>
                </p>
                <div class="flex flex-wrap items-center text-gray-600 text-sm mt-1 gap-3">
                  <span class="flex items-center">
                    <i class="fa-solid fa-calendar-check text-red-500 mr-1"></i> ${item.date}
                  </span>
                  <span class="flex items-center">
                    <i class="fa-solid fa-location-pin text-purple-500 mr-1"></i> ${item.location}
                  </span>
                </div>
              </div>
            </div>
          `;
  
          // Append the conference item to the container
          container.appendChild(conferenceItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching conference data:", error);
        const container = document.getElementById("conferences-list");
        container.innerHTML = `<p class="text-red-500">Unable to load conference data at this time.</p>`;
      });
  });