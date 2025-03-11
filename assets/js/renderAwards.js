document.addEventListener("DOMContentLoaded", function () {
    // Fetch the awards data from the JSON file
    fetch("../data/awards.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const container = document.getElementById("awards-list");
  
        // Clear any existing content in the container
        container.innerHTML = "";
  
        // Loop through the awards data and create HTML elements
        data.forEach((award) => {
          const awardItem = document.createElement("div");
          awardItem.classList.add("flex", "items-center", "text-base", "text-gray-800");
  
          // Create the HTML structure for each award
          awardItem.innerHTML = `
            <i class="${award.icon} ${award.iconColor} mr-3"></i>
            <div>
              <p class="text-gray-800 font-medium">${award.title}</p>
              <p class="text-gray-600 text-sm">${award.description}</p>
            </div>
          `;
  
          // Append the award item to the container
          container.appendChild(awardItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching awards data:", error);
        const container = document.getElementById("awards-list");
        container.innerHTML = `<p class="text-red-500">Unable to load awards data at this time. Error: ${error.message}</p>`;
      });
  });