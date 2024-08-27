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
    'eigenvalues': ['../2023-01-01', '../2024-06-09', , '../2024-06-30','../2024-07-28'],
    'eigenvectors': ['../2023-01-01', '../2024-06-30'],
    'linear-transformation': ['../2024-05-05', '../2024-05-19', '../2024-06-16', '../2024-08-11'],
    'inner-product-space': ['../2024-05-12', '../2024-06-02', '../2024-07-14'],
    'characteristic-polynomial': ['../2024-05-26', '../2024-08-18'],
    'dimension': ['../2024-06-02'],

    // real analysis
    'real-analysis': realAnalysis,
    'supremum': ['../2024-05-06', '../2024-07-01'],
    'sequences': ['../2024-05-13', '../2024-07-29', '../2024-08-05'],
    'continuity': ['../2024-04-29', '../2024-05-20', '../2024-08-26'],
    'integral': ['../2024-06-17'],
    'improper-integral': ['../2024-04-01'],
    'partial-derivative': ['../2024-04-29', '../2024-05-27', '../2024-08-19'],
    'inverse-function-theorem': ['../2024-06-10'],
    'sequence-of-functions': ['../2024-07-15','../2024-08-12'],

    // complex analysis
    'complex-analysis': complexAnalysis,
    'infinite-series': ['../2024-05-07', '../2024-08-06'],
    'complex-differentiation': ['../2024-06-18'],
    'complex-integration': ['../2024-05-21', '../2024-05-28', '../2024-08-13'],
    'analytic-function': ['../2024-06-04', '../2024-06-11', '../2024-06-25', '../2024-07-02', '../2024-07-23', '../2024-08-20', '../2024-08-27'],
    'singularity': ['../2024-07-16'],
    'harmonic-conjugate': ['../2024-08-27'],

    // abstract algebra
    'abstract-algebra': abstractAlgebra,
    'group-theory': ['../2024-05-01', '../2024-05-22', '../2024-06-12', '../2024-06-19', '../2024-07-10','../2024-07-24', '../2024-07-31'],
    'ring-theory': ['../2024-05-29', '../2024-06-26', '../2024-07-03', '../2024-07-17', '../2024-08-14'],
    'field-theory': ['../2024-05-08', '../2024-06-05', '../2024-08-07', '../2024-08-21'],
    'spliting-field': ['../2024-05-08'],
    'group-homomorphism': ['../2024-05-22', '../2024-06-12'],

    // topology
    'topology': topology,
    'metric-space': ['../2023-01-05', '../2024-06-06', '../2024-06-27', '../2024-07-04', '../2024-07-11', '../2024-08-01', '../2024-08-15'],
    'product-topology': ['../2024-05-09'],
    'homeomorphism': ['../2024-05-23', '../2024-06-20'],
    'connectedness': ['../2024-08-22'],

    // ODE and PDE
    'differential-equation': differentialEquation,
    'ode': ['../2023-01-06', '../2024-05-03', '../2024-05-31', '../2024-06-07', '../2024-06-14', '../2024-06-21', '../2024-08-09', '../2024-08-16', '../2024-08-23'],
    'pde': ['../2024-05-10', '../2024-05-24', '../2024-06-28', '../2024-07-12', '../2024-07-26', '../2024-08-02'],
    'characteristics': ['../2024-05-10'],
    'heat-equation': ['../2024-05-17'],
    'laplace-transformation': ['../2024-08-09'],

    // miscellaneous
    'miscellaneous': miscellaneous,
    'probability-theory': ['../2024-05-04', '../2024-06-15', '../2024-06-22', '../2024-08-24'],
    'statistics': ['../2024-06-15'],
    'normal-distribution': ['../2024-05-04'],
    'numerical-analysis': ['../2024-05-11', '../2024-06-29', '../2024-08-10', '../2024-08-17'],
    'numerical-integration': ['../2024-06-29', '../2024-08-17'],
    'lagrange-multiplier': ['../2024-05-18'],
    'linear-programming': ['../2024-05-25', '../2024-07-06', '../2024-07-13'],
    'functional-analysis': ['../2024-06-01'],
    'number-theory': ['../2024-06-08'],
    'calculus': ['../2024-07-20'],
    
    // GATE
    'gate-2006': ['../2024-05-14'],
    'gate-2007': ['../2024-05-15'],
    'gate-2019': ['../2024-07-26', '../2024-08-05', '../2024-08-07', '../2024-08-19'],
    'gate-2021': ['../2024-06-16'],
    'gate-2022': ['../2024-05-16', '../2024-07-10'],
    'gate-2023': ['../2024-07-13', '../2024-07-20', '../2024-08-02', '../2024-08-06', '../2024-08-08', '../2024-08-09', '../2024-08-10', '../2024-08-11', '../2024-08-17', '../2024-08-18', '../2024-08-23', '../2024-08-25'],
    'gate-2024': ['../2024-05-25', '../2024-05-26', '../2024-05-27','../2024-05-28', '../2024-05-30', '../2024-06-02', '../2024-06-05', '../2024-06-09', , '../2024-06-10', '../2024-06-11'],

    // CSIR-NET
    'csir-net-feb-2022': ['../2024-07-28','../2024-07-29', '../2024-07-30', '../2024-07-31', '../2024-08-01'],
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
