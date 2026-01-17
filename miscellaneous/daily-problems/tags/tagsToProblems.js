// Define the end date
const endDate = new Date();

// Function to generate date arrays for each category
function generateDateArray(startDateString) {
    // Initialize the date array
    const dateArray = [];

    // Parse the start date
    let currentDate = new Date(startDateString);
    
    // Loop to generate the dates in seven-day intervals
    while (currentDate <= endDate) {
        // Add the date in the format 'YYYY-MM-DD' to the array
        dateArray.push(`../${currentDate.toISOString().slice(0, 10)}`);
        
        // Increment the date by seven days
        currentDate.setDate(currentDate.getDate() + 7);
    }

    // Return the generated date array
    return dateArray;
}

// Define the start dates for each category
const startDates = {
    'linear-algebra': '2023-01-01',
    'real-analysis': '2023-01-02',
    'complex-analysis': '2023-01-03',
    'abstract-algebra': '2023-01-04',
    'topology': '2023-01-05',
    'differential-equation': '2023-01-06',
    'miscellaneous': '2023-01-07'
};

// Initialize the arrays for each category
const linearAlgebra = generateDateArray(startDates['linear-algebra']);
const realAnalysis = generateDateArray(startDates['real-analysis']);
const complexAnalysis = generateDateArray(startDates['complex-analysis']);
const abstractAlgebra = generateDateArray(startDates['abstract-algebra']);
const topology = generateDateArray(startDates['topology']);
const differentialEquation = generateDateArray(startDates['differential-equation']);
const miscellaneous = generateDateArray(startDates['miscellaneous']);

// Each array contains dates in the 'YYYY-MM-DD' format, starting from the given start date and incrementing by seven days

// Define the `tagsToProblems` object
const tagsToProblems = {
    // linear algebra
    'linear-algebra': linearAlgebra,
    'eigenvalues': ['../2023-01-01', '../2024-06-09', , '../2024-06-30','../2024-07-28', '../2025-01-26', '../2025-02-02' ],
    'eigenvectors': ['../2023-01-01', '../2024-06-30', '../2025-01-26', '../2025-02-02'],
    'linear-transformation': ['../2024-05-05', '../2024-05-19', '../2024-06-16', '../2024-08-11', '../2025-01-12', '../2025-01-19', '../2025-02-23', '../2025-03-09', '../2026-01-11', '../2026-01-18'],
    'inner-product-space': ['../2024-05-12', '../2024-06-02', '../2024-07-14'],
    'characteristic-polynomial': ['../2024-05-26', '../2024-08-18', '../2024-01-07', '../2025-02-16'],
    'minimal-polynomial': ['../2025-02-09', '../2025-02-16'],
    'dimension': ['../2024-06-02', '../2025-01-05'],
    'row-reduction': ['../2025-03-16', '../2025-03-23', '../2025-04-06', '../2025-05-25', '../2026-01-04'],
    'basis': ['../2025-04-20', '../2026-01-04'],

    // real analysis
    'real-analysis': realAnalysis,
    'supremum': ['../2024-05-06', '../2024-07-01', '../2024-01-01', '../2024-03-24'],
    'sequences': ['../2024-05-13', '../2024-07-29', '../2024-08-05', '../2025-01-06','../2025-01-27','../2025-03-17', '../2025-03-31', '../2025-05-26', '../2025-06-02'],
    'continuity': ['../2024-04-29', '../2024-05-20', '../2024-08-26', '../2025-01-13', '../2025-01-20', '../2025-02-03', '../2025-02-10', '../2025-02-17', '../2025-02-24', '../2025-03-03', '../2025-04-07', '../2026-01-05', '../2026-01-12'],
    'derivatives': ['../2025-01-13', '../2025-02-03', '../2025-02-24', '../2025-04-21', '../2025-05-19'],
    'integral': ['../2024-06-17'],
    'improper-integral': ['../2024-04-01'],
    'partial-derivative': ['../2024-04-29', '../2024-05-27', '../2024-08-19', '../2025-04-07'],
    'inverse-function-theorem': ['../2024-06-10'],
    'sequence-of-functions': ['../2024-07-15','../2024-08-12', '../2025-03-10', '../2025-04-14'],
    'multivariable': ['../2025-04-07'],

    // complex analysis
    'complex-analysis': complexAnalysis,
    'infinite-series': ['../2024-05-07', '../2024-08-06'],
    'complex-differentiation': ['../2024-06-18'],
    'complex-integration': ['../2024-05-21', '../2024-05-28', '../2024-08-13', '../2025-01-07', '../2025-02-04', '../2025-02-21', '../2025-03-11', '../2025-04-08', '../2026-01-06'],
    'analytic-function': ['../2024-06-04', '../2024-06-11', '../2024-06-25', '../2024-07-02', '../2024-07-23', '../2024-08-20', '../2024-08-27', '../2025-02-14', '../2025-02-18', '../2025-02-25', '../2025-03-25', '../2025-04-15', '../2025-04-22', '2026-01-13'],
    'singularity': ['../2024-07-16'],
    'harmonic-conjugate': ['../2024-08-27', '../2024-01-02', '../2025-03-18'],
    'mobius-transformation': ['../2025-05-20'],

    // abstract algebra
    'abstract-algebra': abstractAlgebra,
    'group-theory': ['../2024-05-01', '../2024-05-22', '../2024-06-12', '../2024-06-19', '../2024-07-10','../2024-07-24', '../2024-07-31', '../2024-08-28', '../2025-01-01', '../2024-01-03', '../2025-01-08', '../2025-01-15', '../2025-02-05', '../2025-02-19', '../2025-02-26', '../2025-03-05', '../2025-03-19', '../2025-04-02', '../2025-04-09', '../2025-05-21', '../2025-05-28', '../2025-06-04'],
    'sylow-theorem': ['../2025-03-19'],
    'cyclic-group': ['../2025-01-22'],
    'group-action': ['../2025-01-29', '../2025-02-12'],
    'ring-theory': ['../2024-05-29', '../2024-06-26', '../2024-07-03', '../2024-07-17', '../2024-08-14', '../2025-03-12'],
    'field-theory': ['../2024-05-08', '../2024-06-05', '../2024-08-07', '../2024-08-21', '../2025-04-16', '../2026-01-07', '../2026-01-14'],
    'splitting-field': ['../2024-05-08'],
    'group-homomorphism': ['../2024-05-22', '../2024-06-12'],

    // topology
    'topology': topology,
    'metric-space': ['../2023-01-05', '../2024-06-06', '../2024-06-27', '../2024-07-04', '../2024-07-11', '../2024-08-01', '../2024-08-15', '../2024-08-29', '../2025-01-02', '../2025-01-16', '../2025-01-23', '../2025-01-30', '../2025-02-13', '../2025-03-20', '../2025-04-03', '../2025-05-22', '../2026-01-15'],
    'product-topology': ['../2024-05-09', '../2025-04-10'],
    'hausdorff-space': ['../2025-04-10'],
    'homeomorphism': ['../2024-05-23', '../2024-06-20', '../2025-06-05'],
    'connectedness': ['../2024-08-22', '../2024-01-04', '../2025-02-06'],
    'subspace-topology': ['../2025-01-09', '../2025-03-13'],
    'completeness': ['../2025-03-13'],

    // ODE and PDE
    'differential-equation': differentialEquation,
    'ode': ['../2023-01-06', '../2024-05-03', '../2024-05-31', '../2024-06-07', '../2024-06-14', '../2024-06-21', '../2024-08-09', '../2024-08-16', '../2024-08-30', '../2025-01-03', '../2024-01-05', '../2025-01-10', '../2025-01-17', '../2025-01-31', '../2025-02-07', '../2025-02-14', '../2025-03-07', '../2025-03-21', '../2025-04-04', '../2025-05-23', '../2026-01-09', '../2026-01-16'],
    'pde': ['../2024-05-10', '../2024-05-24', '../2024-06-28', '../2024-07-12', '../2024-07-26', '../2024-08-02', '../2024-08-23', '../2025-01-24', '../2025-02-21', '../2025-02-28', '../2025-03-14',, '../2025-03-28', '../2025-04-11', '../2025-04-18', '../2025-05-30', '../2026-01-02'],
    'characteristics': ['../2024-05-10'],
    'heat-equation': ['../2024-05-17', '../2025-01-25'],
    'laplace-transformation': ['../2024-08-09'],
    'charpit-method': ['../2025-02-28'],

    // miscellaneous
    'miscellaneous': miscellaneous,
    'probability-theory': ['../2024-05-04', '../2024-06-15', '../2024-06-22', '../2024-08-24', '../2025-01-18', '../2025-04-19', '../2026-01-10'],
    'statistics': ['../2024-06-15', '../2025-01-04', '../2025-04-19'],
    'normal-distribution': ['../2024-05-04'],
    'numerical-analysis': ['../2024-05-11', '../2024-06-29', '../2024-08-10', '../2024-08-17', '../2024-08-31', '../2025-02-22'],
    'numerical-integration': ['../2024-06-29', '../2024-08-17'],
    'lagrange-multiplier': ['../2024-05-18'],
    'linear-programming': ['../2024-05-25', '../2024-07-06', '../2024-07-13'],
    'functional-analysis': ['../2024-06-01'],
    'number-theory': ['../2024-06-08', '../2024-01-06', '../2026-01-03'],
    'calculus': ['../2024-07-20', '../2025-01-11', '../2025-02-01', '../2025-02-08', '../2025-02-15', '../2025-03-01', '../2025-03-22', '../2025-05-24'],
    
    // GATE
    'gate-2006': ['../2024-05-14'],
    'gate-2007': ['../2024-05-15'],
    'gate-2019': ['../2024-07-26', '../2024-08-05', '../2024-08-07', '../2024-08-19'],
    'gate-2021': ['../2024-06-16'],
    'gate-2022': ['../2024-05-16', '../2024-07-10', '../2024-01-02', '../2024-01-04', '../2025-01-05', '../2025-01-06', '../2025-01-07', '../2024-01-05', '../2024-01-06', '../2024-01-07'],
    'gate-2023': ['../2024-07-13', '../2024-07-20', '../2024-08-02', '../2024-08-06', '../2024-08-08', '../2024-08-09', '../2024-08-10', '../2024-08-11', '../2024-08-17', '../2024-08-18', '../2024-08-23', '../2024-08-25'],
    'gate-2024': ['../2024-05-25', '../2024-05-26', '../2024-05-27','../2024-05-28', '../2024-05-30', '../2024-06-02', '../2024-06-05', '../2024-06-09', , '../2024-06-10', '../2024-06-11'],

    // CSIR-NET
    'csir-net-feb-2022': ['../2024-07-28','../2024-07-29', '../2024-07-30', '../2024-07-31', '../2024-08-01'],
    'csir-net-dec-2019': ['../2025-04-09'],
    'csir-net-june-2011': ['../2025-04-11'],

    // NBHM
    'nbhm-msc-2019': ['../2025-03-29'],
    'nbhm-phd-2005': ['../2026-01-06', '../2026-01-13', '../2026-01-17', '../2026-01-18'],

    // MCQ
    'mcq': ['../2025-02-01', '../2025-04-09', '../2025-04-12', '../2025-04-16'],

    // Book-Solution
    'topology-munkres': ['../2025-03-06', '../2025-03-27'],
    'linear-algebra-hoffman-kunze': ['../2025-03-16', '../2025-03-23', '../2025-04-06', '../2025-06-01', '../2026-01-04' ],
    'real-analysis-rudin': ['../2025-03-31', '../2025-04-14', '../2025-04-21', '../2025-05-26', '../2025-06-02', '../2025-08-18'],
    'abstract-algebra-herstein': ['../2025-05-21', '../2025-05-28', '../2025-06-04'],
    'complex-analysis-gamelin': ['../2025-08-19'],
};

// Function to sort arrays by date
function sortDateArrays(tagsToProblems) {
    // Iterate over the keys in the `tagsToProblems` object
    for (const key in tagsToProblems) {
        // Check if the value is an array
        if (Array.isArray(tagsToProblems[key])) {
            // Sort the array by date
            tagsToProblems[key].sort((a, b) => {
                // Parse the date from the file paths and compare
                const dateA = new Date(a.replace('../', ''));
                const dateB = new Date(b.replace('../', ''));
                return dateA - dateB; // Sort in ascending order
            });
        }
    }
}

// Call the function to sort the arrays in `tagsToProblems`
sortDateArrays(tagsToProblems);

// The `tagsToProblems` object now has arrays sorted by date
