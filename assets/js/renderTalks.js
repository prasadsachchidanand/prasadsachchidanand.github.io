document.addEventListener("DOMContentLoaded", function () {
    // Fetch the talks data from the JSON file
    fetch("../data/talks.json")
      .then((response) => response.json())
      .then((data) => {
        const container = document.getElementById("talks-list");
  
        // Clear any existing content in the container
        container.innerHTML = "";
  
        // Loop through the talks data and create HTML elements
        data.forEach((item) => {
          const talkItem = document.createElement("div");
          talkItem.classList.add("bg-gray-50", "p-4", "rounded-lg", "shadow-sm");
  
          // Create the HTML structure for each talk entry
          talkItem.innerHTML = `
            <div class="flex items-start">
              <i class="fa-solid fa-microphone text-indigo-500 mr-3 mt-1"></i>
              <div class="flex-1">
                <p class="text-gray-800 font-medium italic">${item.title}</p>
                <p class="text-gray-700 text-sm">
                  ${item.eventLink ? `<a href="${item.eventLink}" target="_blank" class="text-indigo-500 hover:text-indigo-700">${item.event}</a>` : item.event}
                </p>
                <div class="flex flex-wrap items-center text-gray-600 text-sm mt-1 gap-3">
                  <span class="flex items-center">
                    <i class="fa-solid fa-calendar-check text-red-500 mr-1"></i> ${item.date}
                  </span>
                  ${item.location ? `
                    <span class="flex items-center">
                      <i class="fa-solid fa-location-pin text-purple-500 mr-1"></i> ${item.location}
                    </span>
                  ` : ""}
                  ${item.slides ? `
                    <a href="${item.slides}" target="_blank" class="flex items-center text-green-500 hover:text-green-800">
                      <i class="fa-regular fa-file-pdf pr-1"></i>Slide
                    </a>
                  ` : ""}
                  ${item.video ? `
                    <a href="${item.video}" target="_blank" class="flex items-center text-red-500 hover:text-red-800">
                      <i class="fa-brands fa-youtube pr-1"></i>Video
                    </a>
                  ` : ""}
                  ${item.source ? `
                    <a href="${item.source}" target="_blank" class="flex items-center text-gray-500 hover:text-gray-800">
                      <i class="fa-solid fa-file pr-1"></i>Source
                    </a>
                  ` : ""}
                </div>
              </div>
            </div>
          `;
  
          // Append the talk item to the container
          container.appendChild(talkItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching talks data:", error);
        const container = document.getElementById("talks-list");
        container.innerHTML = `<p class="text-red-500">Unable to load talks data at this time.</p>`;
      });
  });