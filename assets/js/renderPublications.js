function renderPublications(containerId, style = 'cv') {
  fetch('/data/publications.json') // Path to the centralized JSON file
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById(containerId);
      if (!container) return;

      data.forEach((pub, index) => {
        const pubItem = document.createElement('div');

        if (style === 'cv') {
          // CV Page Style
          pubItem.className = 'bg-gray-50 p-4 rounded-lg shadow-sm mb-4';
          pubItem.innerHTML = `
            <div class="flex items-start">
              <i class="fa-solid fa-file-lines text-indigo-500 mr-3 mt-1"></i>
              <div class="flex-1">
                <p class="text-gray-800 font-medium"><span class="italic">${pub.title}</span> (${pub.authors})</p>
                <div class="flex flex-wrap items-center text-gray-600 text-sm mt-1 gap-3">
                  <span>${pub.date}</span>
                  ${pub.arxiv ? `<a href="${pub.arxiv}" target="_blank" class="text-indigo-500 hover:text-indigo-700">arXiv link</a>` : ''}
                  ${pub.journal_link ? `<a href="${pub.journal_link}" target="_blank" class="text-indigo-500 hover:text-indigo-700">Journal link</a>` : ''}
                </div>
              </div>
            </div>
          `;
        } else if (style === 'research') {
          // Research Page Style
          pubItem.className = 'text-lg mt-8';
          pubItem.innerHTML = `
            <em>${pub.title}</em> (${pub.authors}), ${pub.date} <br>
            <span class="pl-4">
              ${pub.arxiv ? `<a href="${pub.arxiv}" target="_blank" class="text-blue-500 hover:text-blue-800">arXiv link</a>` : ''}
              ${pub.journal_link ? `<a href="${pub.journal_link}" target="_blank" class="text-blue-500 hover:text-blue-800">Journal link</a>` : ''}
            </span>
            ${pub.abstract ? `
              <div class="mt-2 ml-4 border-l-2 border-indigo-500 hidden md:block xs:hidden">
                <p class="pl-2 leading-relaxed text-base text-gray-500 text-justify">
                  <span class="text-gray-900">Abstract:</span> ${pub.abstract}
                </p>
              </div>
            ` : ''}
          `;
        }

        container.appendChild(pubItem);

        // Reprocess MathJax after inserting the publication
        if (window.MathJax) {
          MathJax.typeset([pubItem]);
        }
      });
    })
    .catch(error => console.error('Error fetching publications:', error));
}