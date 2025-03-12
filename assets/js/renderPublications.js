function renderPublications(containerId, style = 'cv') {
  fetch('/data/publications.json') // Path to the centralized JSON file
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById(containerId);
      if (!container) return;

      data.forEach((pub, index) => {
        console.log(`Rendering publication ${index + 1}:`, pub.title); // Debugging
        const pubItem = document.createElement('div');

        if (style === 'cv') {
          // CV Page Style
          pubItem.className = 'bg-gray-50 p-4 rounded-lg shadow-sm mb-4';
          pubItem.innerHTML = `
            <div class="flex items-start">
              <i class="fa-solid fa-file-lines text-indigo-500 mr-3 mt-1"></i>
              <div class="flex-1">
                <p class="text-gray-800 font-medium"><span class="italic">${pub.title}</span></p>
                <p class="text-gray-600 text-sm mt-1">${pub.authors}</p>
                <p class="text-gray-600 text-sm mt-1">
                  ${pub.journal ? `<span class = "font-medium text-black">${pub.journal}</span>` : '<span>Preprint</span>'}
                  ${pub.date ? `<span>, ${pub.date}</span>` : ''}
                </p>
                <div class="flex flex-wrap items-center text-gray-600 text-sm mt-1 gap-3">
                  ${pub.arxiv ? `<a href="${pub.arxiv}" target="_blank" class="text-indigo-500 hover:text-indigo-700">arXiv link</a>` : ''}
                  ${pub.journal_link ? `<a href="${pub.journal_link}" target="_blank" class="text-indigo-500 hover:text-indigo-700">Journal link</a>` : ''}
                </div>
              </div>
            </div>
          `;
        } 
        else if (style === 'research') {
          // Research Page Style
          pubItem.className = 'publication-item bg-white p-6 rounded-lg shadow-md mb-6';
          pubItem.innerHTML = `
            <div class="publication-header">
              <h3 class="text-lg font-semibold text-gray-800"><em>${pub.title}</em></h3>
              <p class="text-gray-600 mt-1">${pub.authors}</p>
              <p class="text-gray-500 text-sm mt-1">${pub.date}</p>
            </div>
            <div class="publication-details mt-2">
              <p class="text-gray-700">
                ${pub.journal ? `<span class="font-medium">Journal:</span> ${pub.journal}` : '<span class="font-medium">Status:</span> Preprint'}
              </p>
              <div class="links mt-2">
                ${pub.arxiv ? `<a href="${pub.arxiv}" target="_blank" class="text-blue-500 hover:text-blue-700 mr-4">arXiv</a>` : ''}
                ${pub.journal_link ? `<a href="${pub.journal_link}" target="_blank" class="text-blue-500 hover:text-blue-700">Journal</a>` : ''}
              </div>
            </div>
            ${pub.abstract ? `
              <div class="abstract mt-4 pt-4 border-t border-gray-200 hidden xs:hidden md:block">
                <p class="text-gray-600">
                  <span class="font-medium text-gray-800">Abstract:</span> ${pub.abstract}
                </p>
              </div>
            ` : ''}
          `;
        }

        container.appendChild(pubItem);

        // Reprocess MathJax after inserting the publication
        if (window.MathJax) {
          MathJax.typeset([pubItem]);
          console.log('Math success');
        }
      });
    })
    .catch(error => console.error('Error fetching publications:', error));
}