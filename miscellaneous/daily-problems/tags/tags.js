document.addEventListener('DOMContentLoaded', function() {
    // Retrieve all tag buttons
    const buttons = document.querySelectorAll('.tag-button');

    // Map categories to links containers
    const linksContainers = {
        'linear-algebra': document.getElementById('linear-algebra-links'),
        'real-analysis': document.getElementById('real-analysis-links'),
        'complex-analysis': document.getElementById('complex-analysis-links'),
        'abstract-algebra': document.getElementById('abstract-algebra-links'),
        'topology': document.getElementById('topology-links'),
        'differential-equation': document.getElementById('differential-equation-links'),
        'miscellaneous': document.getElementById('miscellaneous-links'),
        'gate': document.getElementById('gate-links')
    };

    // Map subcategories to main categories
    const subcategoryToCategoryMap = {
        // linear algebra
        'eigenvalues': 'linear-algebra',
        'eigenvectors': 'linear-algebra',
        'linear-transformation': 'linear-algebra',
        'inner-product-space': 'linear-algebra',
        'characteristic-polynomial': 'linear-algebra',
        'dimension': 'linear-algebra',

        // real analysis
        'supremum': 'real-analysis',
        'sequences': 'real-analysis',
        'continuity': 'real-analysis',
        'improper-integral': 'real-analysis',
        'partial-derivative': 'real-analysis',

        // complex analysis
        'infinite-series': 'complex-analysis',
        'complex-integration': 'complex-analysis',
        'analytic-function': 'complex-analysis',

        // abstract algebra
        'group-theory': 'abstract-algebra',
        'ring-theory': 'abstract-algebra',
        'field-theory': 'abstract-algebra',
        'spliting-field': 'abstract-algebra',
        'group-homomorphism': 'abstract-algebra',

        // topology
        'metric-space': 'topology',
        'product-topology': 'topology',
        'homeomorphism': 'topology',

        // differential equations
        'ode': 'differential-equation',
        'pde': 'differential-equation',
        'characteristics': 'differential-equation',
        'heat-equation': 'differential-equation',

        // miscellaneous
        'probability-theory': 'miscellaneous',
        'normal-distribution': 'miscellaneous',
        'number-theory': 'miscellaneous',
        'numerical-analysis': 'miscellaneous',
        'lagrange-multiplier': 'miscellaneous',
        'linear-programming': 'miscellaneous',
        'functional-analysis': 'miscellaneous',
        'number-theory': 'miscellaneous',

        // gate
        'gate-2006': 'gate',
        'gate-2007': 'gate',
        'gate-2022': 'gate',
        'gate-2024': 'gate',
    };

    // Define the active button and container
    let activeButton = null;
    let activeContainer = null;

    // Function to toggle visibility of links containers
    function toggleLinksContainer(button, linksContainer) {
        // If the clicked button is the same as the active button
        if (button === activeButton) {
            // Toggle visibility of links container
            linksContainer.classList.toggle('hidden');
        } else {
            // Hide all links containers
            Object.values(linksContainers).forEach(container => {
                if (container) {
                    container.classList.add('hidden');
                }
            });

            // Show the new links container
            linksContainer.classList.remove('hidden');
        }
    }

    // Event listener for button clicks
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Determine the tag from the button text
            const tag = button.innerText.trim().toLowerCase().replace(/ /g, '-');
            const mainCategory = subcategoryToCategoryMap[tag] || tag;

            // Retrieve the links container for the main category
            const linksContainer = linksContainers[mainCategory];

            // Toggle links container visibility
            toggleLinksContainer(button, linksContainer);

            // If the button is already active, stop further processing
            if (activeButton === button) {
                return;
            }

            // Set the active button and container to the current ones
            activeButton = button;
            activeContainer = linksContainer;

            // Reset all buttons to default style
            buttons.forEach(b => {
                b.className = 'tag-button text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br font-medium rounded-lg text-base px-5 py-2.5 text-center me-2 mb-2';
            });

            // Highlight the clicked button
            button.className = 'tag-button text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br font-medium rounded-lg text-base px-5 py-2.5 text-center me-2 mb-2';

            // Fetch problems associated with the tag from `tagsToProblems`
            const problemDirs = tagsToProblems[tag];

            // Clear existing content in links container
            linksContainer.innerHTML = '';

            // Add Tailwind classes for responsive grid layout
            linksContainer.classList.add(
                'grid', 'gap-4', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3',
                'lg:grid-cols-4', 'xl:grid-cols-5', '2xl-grid-cols-6', 'text-center'
            );

            // Populate links container with links
            if (problemDirs && problemDirs.length > 0) {
                problemDirs.forEach(dir => {
                    // Extract date from the directory path
                    const date = dir.replace('../', '');

                    // Create a link element
                    const link = document.createElement('a');
                    link.href = dir;
                    link.innerText = date;

                    // Apply Tailwind classes for styling
                    link.classList.add(
                        'block', 'text-blue-500', 'hover:text-blue-800',
                        'font-medium', 'text-lg', 'px-4', 'py-2', 'rounded',
                        'shadow', 'transition', 'duration-300', 'ease-in-out', 'hover:bg-gray-100'
                    );

                    // Open the link in a new tab
                    link.target = '_blank';

                    // Append the link to the links container
                    linksContainer.appendChild(link);
                });
            } else {
                // Display a message if no problems are found
                linksContainer.innerText = `No problems found for the tag "${tag}".`;
            }
        });
    });
});
