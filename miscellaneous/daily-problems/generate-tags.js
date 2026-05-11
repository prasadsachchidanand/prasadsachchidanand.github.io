const fs = require('fs');
const path = require('path');

// Configuration
const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_FILE = path.join(__dirname, 'tags', 'tagsToProblems.js');
const BACKUP_FILE = path.join(__dirname, 'tags', 'tagsToProblems.js.backup');

// Topic files to process
const TOPIC_FILES = [
    'linear-algebra.json',
    'real-analysis.json',
    'complex-analysis.json',
    'abstract-algebra.json',
    'topology.json',
    'differential-equations.json',
    'miscellaneous.json'
];

// =====================================================================
// CUTOFF DATE — must match LAST_FOLDER_DATE in problem-loader.js
// Dates UP TO AND INCLUDING this date have a real folder (yyyy-mm-dd/).
// Dates AFTER this date use the canonical page (/problem/?date=...).
// =====================================================================
const LAST_FOLDER_DATE = '2025-12-31';

// Build the correct URL string for a given YYYY-MM-DD date string
function buildDateURL(dateString) {
    if (dateString <= LAST_FOLDER_DATE) {
        return `../${dateString}`;                          // old: real folder
    } else {
        return `../problem/?date=${dateString}`;           // new: canonical page
    }
}

// ==================== DATE GENERATION ====================

function generateDateArray(startDateString, endDate = new Date()) {
    const dateArray = [];
    let currentDate = new Date(startDateString);

    while (currentDate <= endDate) {
        const year  = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day   = String(currentDate.getDate()).padStart(2, '0');
        dateArray.push(buildDateURL(`${year}-${month}-${day}`));

        currentDate.setDate(currentDate.getDate() + 7); // Add 7 days
    }

    return dateArray;
}

// Generate category arrays
const linearAlgebra        = generateDateArray('2023-01-01'); // Sundays
const realAnalysis         = generateDateArray('2023-01-02'); // Mondays
const complexAnalysis      = generateDateArray('2023-01-03'); // Tuesdays
const abstractAlgebra      = generateDateArray('2023-01-04'); // Wednesdays
const topology             = generateDateArray('2023-01-05'); // Thursdays
const differentialEquation = generateDateArray('2023-01-06'); // Fridays
const miscellaneous        = generateDateArray('2023-01-07'); // Saturdays

// ==================== MANUAL ENTRIES ====================
// Helper: convert a plain ../YYYY-MM-DD string to the correct URL.
// This lets you keep writing short dates below and have them auto-corrected.
function d(dateString) {
    // Accept both '../2026-01-04' and '2026-01-04' formats
    const clean = dateString.replace('../', '').replace('../problem/?date=', '');
    return buildDateURL(clean);
}

const MANUAL_ENTRIES = {
    // Main category tags - ALL dates from start until today
    'linear-algebra':        linearAlgebra,
    'real-analysis':         realAnalysis,
    'complex-analysis':      complexAnalysis,
    'abstract-algebra':      abstractAlgebra,
    'topology':              topology,
    'differential-equation': differentialEquation,
    'miscellaneous':         miscellaneous,

    // Linear Algebra
    'eigenvalues':            ['2023-01-01','2024-06-09','2024-06-30','2024-07-28','2025-01-26','2025-02-02','2026-01-25'].map(d),
    'eigenvectors':           ['2023-01-01','2024-06-30','2025-01-26','2025-02-02'].map(d),
    'linear-transformation':  ['2024-05-05','2024-05-19','2024-06-16','2024-08-11','2025-01-12','2025-01-19','2025-02-23','2025-03-09','2026-01-11','2026-01-18','2026-02-01','2026-02-22'].map(d),
    'inner-product-space':    ['2024-05-12','2024-06-02','2024-07-14'].map(d),
    'characteristic-polynomial': ['2024-05-26','2024-08-18','2024-01-07','2025-02-16','2026-01-25','2026-03-01'].map(d),
    'minimal-polynomial':     ['2025-02-09','2025-02-16'].map(d),
    'dimension':              ['2024-06-02','2025-01-05'].map(d),
    'row-reduction':          ['2025-03-16','2025-03-23','2025-04-06','2025-05-25','2026-01-04'].map(d),
    'basis':                  ['2025-04-20','2026-01-04','2026-02-15'].map(d),

    // Real Analysis
    'supremum':               ['2024-05-06','2024-07-01','2024-01-01','2024-03-24','2026-01-26'].map(d),
    'sequences':              ['2024-05-13','2024-07-29','2024-08-05','2025-01-06','2025-01-27','2025-03-17','2025-03-31','2025-05-26','2025-06-02','2026-02-16','2026-03-09','2026-03-16','2026-03-23','2026-03-30','2026-04-06','2026-04-13'].map(d),
    'continuity':             ['2024-04-29','2024-05-20','2024-08-26','2025-01-13','2025-01-20','2025-02-03','2025-02-10','2025-02-17','2025-02-24','2025-03-03','2025-04-07','2026-01-05','2026-01-12'].map(d),
    'derivatives':            ['2025-01-13','2025-02-03','2025-02-24','2025-04-21','2025-05-19'].map(d),
    'integral':               ['2024-06-17','2026-01-19'].map(d),
    'improper-integral':      ['2024-04-01'].map(d),
    'partial-derivative':     ['2024-04-29','2024-05-27','2024-08-19','2025-04-07'].map(d),
    'inverse-function-theorem': ['2024-06-10'].map(d),
    'sequence-of-functions':  ['2024-07-15','2024-08-12','2025-03-10','2025-04-14','2026-02-02','2026-02-09'].map(d),
    'multivariable':          ['2025-04-07'].map(d),

    // Complex Analysis
    'infinite-series':        ['2024-05-07','2024-08-06','2026-04-07'].map(d),
    'complex-differentiation':['2024-06-18'].map(d),
    'complex-integration':    ['2024-05-21','2024-05-28','2024-08-13','2025-01-07','2025-02-04','2025-02-21','2025-03-11','2025-04-08','2026-01-06','2026-02-03','2026-03-17','2026-03-24','2026-03-31'].map(d),
    'analytic-function':      ['2024-06-04','2024-06-11','2024-06-25','2024-07-02','2024-07-23','2024-08-20','2024-08-27','2025-02-14','2025-02-18','2025-02-25','2025-03-25','2025-04-15','2025-04-22','2026-01-13','2026-01-20'].map(d),
    'singularity':            ['2024-07-16'].map(d),
    'harmonic-conjugate':     ['2024-08-27','2024-01-02','2025-03-18'].map(d),
    'mobius-transformation':  ['2025-05-20'].map(d),

    // Abstract Algebra
    'group-theory':           ['2024-05-01','2024-05-22','2024-06-12','2024-06-19','2024-07-10','2024-07-24','2024-07-31','2024-08-28','2025-01-01','2024-01-03','2025-01-08','2025-01-15','2025-02-05','2025-02-19','2025-02-26','2025-03-05','2025-03-19','2025-04-02','2025-04-09','2025-05-21','2025-05-28','2025-06-04','2026-01-21','2026-01-28','2026-02-04','2026-02-11','2026-03-11','2026-03-18','2026-03-25','2026-04-08'].map(d),
    'sylow-theorem':          ['2025-03-19','2025-08-21'].map(d),
    'cyclic-group':           ['2025-01-22','2025-08-21','2026-01-21','2026-02-04'].map(d),
    'group-action':           ['2025-01-29','2025-02-12'].map(d),
    'ring-theory':            ['2024-05-29','2024-06-26','2024-07-03','2024-07-17','2024-08-14','2025-03-12','2026-03-04','2026-04-01'].map(d),
    'field-theory':           ['2024-05-08','2024-06-05','2024-08-07','2024-08-21','2025-04-16','2026-01-07','2026-01-14','2026-02-18','2026-02-25'].map(d),
    'splitting-field':        ['2024-05-08'].map(d),
    'group-homomorphism':     ['2024-05-22','2024-06-12'].map(d),

    // Topology
    'metric-space':           ['2023-01-05','2024-06-06','2024-06-27','2024-07-04','2024-07-11','2024-08-01','2024-08-15','2024-08-29','2025-01-02','2025-01-16','2025-01-23','2025-01-30','2025-02-13','2025-03-20','2025-04-03','2025-05-22','2026-01-15','2026-01-29','2026-03-05','2026-03-12','2026-03-19','2026-04-09'].map(d),
    'product-topology':       ['2024-05-09','2025-04-10'].map(d),
    'hausdorff-space':        ['2025-04-10'].map(d),
    'homeomorphism':          ['2024-05-23','2024-06-20','2025-06-05'].map(d),
    'connectedness':          ['2024-08-22','2024-01-04','2025-02-06','2026-02-19','2026-04-02'].map(d),
    'subspace-topology':      ['2025-01-09','2025-03-13'].map(d),
    'completeness':           ['2025-03-13'].map(d),
    'homotopy-theory':        ['2026-02-12'].map(d),

    // ODE and PDE
    'ode':                    ['2023-01-06','2024-05-03','2024-05-31','2024-06-07','2024-06-14','2024-06-21','2024-08-09','2024-08-16','2024-08-30','2025-01-03','2024-01-05','2025-01-10','2025-01-17','2025-01-31','2025-02-07','2025-02-14','2025-03-07','2025-03-21','2025-04-04','2025-05-23','2026-01-09','2026-01-16','2026-01-23','2026-02-06','2026-02-20','2026-03-06','2026-03-13','2026-03-27','2026-04-10'].map(d),
    'pde':                    ['2024-05-10','2024-05-24','2024-06-28','2024-07-12','2024-07-26','2024-08-02','2024-08-23','2025-01-24','2025-02-21','2025-02-28','2025-03-14','2025-03-28','2025-04-11','2025-04-18','2025-05-30','2026-01-02','2026-01-23','2026-01-30','2026-02-13','2026-02-27','2026-03-20','2026-04-03'].map(d),
    'characteristics':        ['2024-05-10'].map(d),
    'heat-equation':          ['2024-05-17','2025-01-25'].map(d),
    'laplace-transformation': ['2024-08-09','2026-02-06'].map(d),
    'charpit-method':         ['2025-02-28','2026-03-20'].map(d),

    // Miscellaneous
    'probability-theory':     ['2024-05-04','2024-06-15','2024-06-22','2024-08-24','2025-01-18','2025-04-19','2026-01-10','2026-03-28'].map(d),
    'statistics':             ['2024-06-15','2025-01-04','2025-04-19','2026-03-07'].map(d),
    'normal-distribution':    ['2024-05-04'].map(d),
    'numerical-analysis':     ['2024-05-11','2024-06-29','2024-08-10','2024-08-17','2024-08-31','2025-02-22','2026-04-11'].map(d),
    'numerical-integration':  ['2024-06-29','2024-08-17'].map(d),
    'lagrange-multiplier':    ['2024-05-18'].map(d),
    'linear-programming':     ['2024-05-25','2024-07-06','2024-07-13'].map(d),
    'functional-analysis':    ['2024-06-01'].map(d),
    'number-theory':          ['2024-06-08','2024-01-06','2026-01-03','2026-02-14','2026-02-21','2026-03-14','2026-03-21','2026-04-04'].map(d),
    'calculus':               ['2024-07-20','2025-01-11','2025-02-01','2025-02-08','2025-02-15','2025-03-01','2025-03-22','2025-05-24','2026-01-24'].map(d),
    'differential-geometry':  ['2026-02-07'].map(d),
    'combinatorics':          ['2026-02-28'].map(d),

    // GATE
    'gate-2006': ['2024-05-14'].map(d),
    'gate-2007': ['2024-05-15'].map(d),
    'gate-2019': ['2024-07-26','2024-08-05','2024-08-07','2024-08-19'].map(d),
    'gate-2021': ['2024-06-16'].map(d),
    'gate-2022': ['2024-05-16','2024-07-10','2024-01-02','2024-01-04','2025-01-05','2025-01-06','2025-01-07','2024-01-05','2024-01-06','2024-01-07'].map(d),
    'gate-2023': ['2024-07-13','2024-07-20','2024-08-02','2024-08-06','2024-08-08','2024-08-09','2024-08-10','2024-08-11','2024-08-17','2024-08-18','2024-08-23','2024-08-25'].map(d),
    'gate-2024': ['2024-05-25','2024-05-26','2024-05-27','2024-05-28','2024-05-30','2024-06-02','2024-06-05','2024-06-09','2024-06-10','2024-06-11'].map(d),

    // CSIR-NET
    'csir-net-feb-2022':  ['2024-07-28','2024-07-29','2024-07-30','2024-07-31','2024-08-01'].map(d),
    'csir-net-dec-2019':  ['2025-04-09'].map(d),
    'csir-net-june-2011': ['2025-04-11'].map(d),

    // NBHM
    'nbhm-msc-2019':  ['2025-03-29'].map(d),
    'nbhm-phd-2005':  ['2025-08-18','2025-08-19','2025-08-20','2025-08-21','2026-01-06','2026-01-13','2026-01-17','2026-01-18','2026-01-19','2026-01-20','2026-01-21','2026-01-24','2026-01-25','2026-01-29','2026-01-31','2026-02-01','2026-04-01','2026-04-02','2026-04-11'].map(d),
    'nbhm-phd-2006':  ['2026-02-03'].map(d),
    'nbhm-phd-2007':  ['2026-03-31'].map(d),
    'nbhm-phd-2017':  ['2026-02-04'].map(d),

    // MCQ
    'mcq': ['2025-02-01','2025-04-09','2025-04-12','2025-04-16'].map(d),

    // Book solutions
    'topology-munkres':           ['2025-03-06','2025-03-27'].map(d),
    'linear-algebra-hoffman-kunze': ['2025-03-16','2025-03-23','2025-04-06','2025-06-01','2026-01-04','2026-03-08','2026-03-15','2026-03-22','2026-03-29','2026-04-05','2026-04-12'].map(d),
    'real-analysis-rudin':        ['2025-03-31','2025-04-14','2025-04-21','2025-05-26','2025-06-02','2025-08-18','2025-08-19','2026-02-16','2026-02-23','2026-03-02','2026-03-09','2026-03-16','2026-03-23'].map(d),
    'abstract-algebra-herstein':  ['2025-05-21','2025-05-28','2025-06-04','2026-04-08'].map(d),
    'complex-analysis-gamelin':   ['2025-08-19'].map(d),
};

// ==================== TAG EXTRACTION FROM JSON ====================

console.log('🚀 Starting tag generation process...\n');

function extractTagsFromJSON() {
    const tagsMap = {};

    TOPIC_FILES.forEach(filename => {
        const filepath = path.join(DATA_DIR, filename);

        if (!fs.existsSync(filepath)) {
            console.log(`⚠️  Warning: ${filename} not found, skipping...`);
            return;
        }

        try {
            const content = fs.readFileSync(filepath, 'utf8');
            const data = JSON.parse(content);

            if (!data.problems || !Array.isArray(data.problems)) {
                console.log(`⚠️  Warning: ${filename} has no 'problems' array, skipping...`);
                return;
            }

            console.log(`📖 Processing ${filename}: ${data.problems.length} problems`);

            data.problems.forEach(problem => {
                if (!problem.date) return;
                if (!problem.tags || !Array.isArray(problem.tags)) return;

                const dateStr = buildDateURL(problem.date); // ← cutoff-aware

                problem.tags.forEach(tag => {
                    let cleanTag = tag;
                    const parentTagMatch = tag.match(/^(.+?)\s+[\(\[].*[\)\]]$/);
                    if (parentTagMatch) {
                        cleanTag = parentTagMatch[1].trim();
                    }

                    if (!tagsMap[cleanTag]) tagsMap[cleanTag] = [];
                    if (!tagsMap[cleanTag].includes(dateStr)) {
                        tagsMap[cleanTag].push(dateStr);
                    }
                });
            });

        } catch (error) {
            console.error(`❌ Error processing ${filename}:`, error.message);
        }
    });

    return tagsMap;
}

// ==================== MERGING ====================

function mergeTags(manualEntries, autoGenerated) {
    const merged = { ...manualEntries };

    for (const [tag, dates] of Object.entries(autoGenerated)) {
        if (merged[tag]) {
            merged[tag] = [...new Set([...merged[tag], ...dates])];
        } else {
            merged[tag] = dates;
        }
    }

    return merged;
}

// ==================== SORTING ====================

function sortTagDates(tagsMap) {
    const sorted = {};

    for (const [tag, dates] of Object.entries(tagsMap)) {
        sorted[tag] = dates.sort((a, b) => {
            // Extract the date portion from either URL format
            const getDate = url => {
                const m = url.match(/(\d{4}-\d{2}-\d{2})/);
                return m ? new Date(m[1]) : new Date(0);
            };
            return getDate(a) - getDate(b);
        });
    }

    return sorted;
}

// ==================== FILE GENERATION ====================

function generateFileContent(tagsMap) {
    const lines = [];

    lines.push('// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY');
    lines.push('// Generated on: ' + new Date().toISOString());
    lines.push(`// LAST_FOLDER_DATE: ${LAST_FOLDER_DATE}`);
    lines.push('// Run "node generate-tags.js" to regenerate');
    lines.push('');
    lines.push('// Define the `tagsToProblems` object');
    lines.push('const tagsToProblems = {');

    const sortedTags = Object.keys(tagsMap).sort();

    sortedTags.forEach((tag, index) => {
        const dates  = tagsMap[tag];
        const datesStr = dates.map(d => `'${d}'`).join(', ');
        const comma  = index < sortedTags.length - 1 ? ',' : '';
        lines.push(`    '${tag}': [${datesStr}]${comma}`);
    });

    lines.push('};');
    lines.push('');

    return lines.join('\n');
}

// ==================== MAIN ====================

function main() {
    try {
        if (fs.existsSync(OUTPUT_FILE)) {
            fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE);
            console.log('✅ Backup created: tagsToProblems.js.backup\n');
        }

        console.log('📊 Extracting tags from JSON files...\n');
        const autoGenerated = extractTagsFromJSON();

        console.log(`\n✅ Found ${Object.keys(autoGenerated).length} unique tags from JSON files`);
        console.log(`✅ Found ${Object.keys(MANUAL_ENTRIES).length} manual entries\n`);

        console.log('🔄 Merging manual and auto-generated entries...');
        const merged = mergeTags(MANUAL_ENTRIES, autoGenerated);

        console.log('📅 Sorting dates...');
        const sorted = sortTagDates(merged);

        console.log('📝 Generating file...');
        const content = generateFileContent(sorted);

        fs.writeFileSync(OUTPUT_FILE, content, 'utf8');

        console.log('\n✅ SUCCESS! Generated tagsToProblems.js');
        console.log(`   Total tags: ${Object.keys(sorted).length}`);
        console.log(`   Total entries: ${Object.values(sorted).reduce((sum, arr) => sum + arr.length, 0)}`);
        console.log(`\n📍 Output: ${OUTPUT_FILE}`);
        console.log(`📍 Backup: ${BACKUP_FILE}\n`);

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();