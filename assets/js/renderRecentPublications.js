function renderRecentPublications(containerId, maxItems = 3) {
    fetch('/data/publications.json') // Path to your publications.json file
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById(containerId);
        if (!container) return;
  
        // Sort publications by date (newest first)
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        // Limit the number of publications to display
        const recentPublications = data.slice(0, maxItems);
  
        // Render each publication
        recentPublications.forEach(pub => {
          const pubItem = document.createElement('div');
          pubItem.className = 'bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow'; // Added hover effect
          pubItem.innerHTML = `
            <div class="flex items-start">
              <i class="fa-solid fa-file-lines text-indigo-500 mr-4 mt-1"></i> <!-- Increased margin-right to mr-4 -->
              <div class="flex-1">
                <p class="text-gray-800 font-medium"><span class="italic">${pub.title}</span> (${pub.authors})</p>
                <div class="flex flex-wrap items-center text-gray-600 text-sm mt-2 gap-3"> <!-- Increased margin-top to mt-2 -->
                  <span>${pub.date}</span>
                  ${pub.arxiv ? `<a href="${pub.arxiv}" target="_blank" class="text-indigo-500 hover:text-indigo-700">arXiv link</a>` : ''}
                  ${pub.journal_link ? `<a href="${pub.journal_link}" target="_blank" class="text-indigo-500 hover:text-indigo-700">Journal link</a>` : ''}
                </div>
              </div>
            </div>
          `;
          container.appendChild(pubItem);
        });
      })
      .catch(error => console.error('Error fetching publications:', error));
  }