const tagsToProblems = {
    // linear algebra
    'linear-algebra': ['../2023-01-01'],
    'eigenvalues': ['../2023-01-01'],
    'eigenvectors': ['../2023-01-01'],

    // real analysis
    'real-analysis': ['../2023-01-02'],

    // complex analysis
    'complex-analysis': ['../2023-01-03'],

    // abstract algebra
    'abstract-algebra': ['../2023-01-04','../2024-05-01'],
    'group-theory': ['../2024-05-01'],
    // 'ring-theory': [],
    // 'field-theory': [],

    // topoloy
    'topology': ['../2023-01-05', '../2024-05-02'],
    'metric-space': ['../2023-01-05', '../2024-05-02'],

    // ODE and PDE
    'ode': ['../2023-01-06'],

    // number theory
    'number-theory': [],
};


// Declare `tagsToProblems` globally
// let tagsToProblems = {};
// let isTagsToProblemsReady = false;

// // Define `defineTagsToProblems` function
// async function defineTagsToProblems() {
//     // Define base URL and date range
//     const baseUrl = '../';
//     const startDate = new Date('2023-01-01');
//     const endDate = new Date('2024-05-31');

//     // Function to fetch and process problem files
//     async function fetchProblemFiles() {
//         const problemFiles = [];

//         async function fetchDirectory(date) {
//             const formattedDate = date.toISOString().split('T')[0];
//             const directoryUrl = `${baseUrl}${formattedDate}/index.html`;

//             try {
//                 const response = await fetch(directoryUrl);
//                 if (!response.ok) return;

//                 const text = await response.text();

//                 // Find and extract tags from the script tag
//                 const tagsMatch = text.match(/<script>[^>]*const tags = \[(.*?)\];[^<]*<\/script>/);
//                 if (tagsMatch && tagsMatch[1]) {
//                     const tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''));
//                     problemFiles.push({ filePath: `${baseUrl}${formattedDate}`, tags });
//                 }
//             } catch (error) {
//                 console.error(`Error fetching ${directoryUrl}:`, error);
//             }
//         }

//         let currentDate = startDate;
//         while (currentDate <= endDate) {
//             await fetchDirectory(currentDate);
//             currentDate.setDate(currentDate.getDate() + 1);
//         }

//         return problemFiles;
//     }

//     // Fetch and process problem files
//     const problemFiles = await fetchProblemFiles();

//     // Populate `tagsToProblems`
//     problemFiles.forEach(({ filePath, tags }) => {
//         if (tags) {
//             tags.forEach(tag => {
//                 if (!tagsToProblems[tag]) tagsToProblems[tag] = [];
//                 tagsToProblems[tag].push(filePath);
//             });
//         }
//     });

//     isTagsToProblemsReady = true;
//     console.log('tagsToProblems:', tagsToProblems);
// }

// // Event handler for button clicks
// function handleButtonClick(event) {
//     if (!isTagsToProblemsReady) {
//         console.warn('Please wait, data is still being processed.');
//         return;
//     }

//     const button = event.target;
//     const tag = button.innerText.trim().toLowerCase().replace(/ /g, '-');
//     const linksContainer = document.getElementById(`${tag}-links`);

//     if (linksContainer) {
//         updateLinksForTag(tag, linksContainer);
//     }
// }

// // Function to update links for a given tag
// function updateLinksForTag(tag, container) {
//     container.innerHTML = '';

//     if (tagsToProblems[tag]) {
//         tagsToProblems[tag].forEach(filePath => {
//             const dateOnly = filePath.split('/')[1];
//             const link = document.createElement('a');
//             link.href = filePath; // Use filePath directly without `/index.html`
//             link.innerText = dateOnly;

//             // Styling and link target attributes
//             link.classList.add('text-blue-500', 'hover:text-blue-800');
//             link.target = '_blank';

//             container.appendChild(link);
//         });
//     } else {
//         container.innerText = `No problems found for the tag "${tag}".`;
//     }
// }

// // Initialize after DOM content is loaded
// document.addEventListener('DOMContentLoaded', async function () {
//     // Define and wait for `tagsToProblems` to be ready
//     await defineTagsToProblems();
//     console.log('tagsToProblems is ready.');

//     // Set up button click event listeners
//     const buttons = document.querySelectorAll('.tag-button');
//     buttons.forEach(button => button.addEventListener('click', handleButtonClick));
// });


