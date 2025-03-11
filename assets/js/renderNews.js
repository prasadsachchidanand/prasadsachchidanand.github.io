function renderNews(containerId, maxItems = 3) {
    fetch('/data/news.json') // Path to your news.json file
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById(containerId);
        if (!container) return;
  
        // Sort news by date (newest first)
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        // Limit the number of news items to display
        const recentNews = data.slice(0, maxItems);
  
        // Render each news item
        recentNews.forEach((item, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <div class="flex items-start space-x-4">
              <span class="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white font-semibold">${index + 1}</span> 
              <div class="flex-1">
                <span class="font-semibold text-gray-900">${item.date}:</span> 
                <span class="text-gray-700">${item.text}</span>
              </div>
            </div>
          `;
          li.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500";
          container.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching news:', error));
  }