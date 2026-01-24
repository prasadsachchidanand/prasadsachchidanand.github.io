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

// ==================== DATE GENERATION ====================

function generateDateArray(startDateString, endDate = new Date()) {
    const dateArray = [];
    let currentDate = new Date(startDateString);
    
    while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        dateArray.push(`../${year}-${month}-${day}`);
        
        currentDate.setDate(currentDate.getDate() + 7); // Add 7 days
    }
    
    return dateArray;
}

// Generate category arrays
const linearAlgebra = generateDateArray('2023-01-01');           // Sundays
const realAnalysis = generateDateArray('2023-01-02');            // Mondays
const complexAnalysis = generateDateArray('2023-01-03');         // Tuesdays
const abstractAlgebra = generateDateArray('2023-01-04');         // Wednesdays
const topology = generateDateArray('2023-01-05');                // Thursdays
const differentialEquation = generateDateArray('2023-01-06');    // Fridays
const miscellaneous = generateDateArray('2023-01-07');           // Saturdays

// ==================== MANUAL ENTRIES ====================

const MANUAL_ENTRIES = {
    // Main category tags - ALL dates from start until today
    'linear-algebra': linearAlgebra,
    'real-analysis': realAnalysis,
    'complex-analysis': complexAnalysis,
    'abstract-algebra': abstractAlgebra,
    'topology': topology,
    'differential-equation': differentialEquation,
    'miscellaneous': miscellaneous,
    
    // Specific tags for Linear Algebra
    'eigenvalues': ['../2023-01-01', '../2024-06-09', '../2024-06-30','../2024-07-28', '../2025-01-26', '../2025-02-02', '../2026-01-25'],
    'eigenvectors': ['../2023-01-01', '../2024-06-30', '../2025-01-26', '../2025-02-02'],
    'linear-transformation': ['../2024-05-05', '../2024-05-19', '../2024-06-16', '../2024-08-11', '../2025-01-12', '../2025-01-19', '../2025-02-23', '../2025-03-09', '../2026-01-11', '../2026-01-18'],
    'inner-product-space': ['../2024-05-12', '../2024-06-02', '../2024-07-14'],
    'characteristic-polynomial': ['../2024-05-26', '../2024-08-18', '../2024-01-07', '../2025-02-16', '../2026-01-25'],
    'minimal-polynomial': ['../2025-02-09', '../2025-02-16'],
    'dimension': ['../2024-06-02', '../2025-01-05'],
    'row-reduction': ['../2025-03-16', '../2025-03-23', '../2025-04-06', '../2025-05-25', '../2026-01-04'],
    'basis': ['../2025-04-20', '../2026-01-04'],

    // Real Analysis tags
    'supremum': ['../2024-05-06', '../2024-07-01', '../2024-01-01', '../2024-03-24'],
    'sequences': ['../2024-05-13', '../2024-07-29', '../2024-08-05', '../2025-01-06','../2025-01-27','../2025-03-17', '../2025-03-31', '../2025-05-26', '../2025-06-02'],
    'continuity': ['../2024-04-29', '../2024-05-20', '../2024-08-26', '../2025-01-13', '../2025-01-20', '../2025-02-03', '../2025-02-10', '../2025-02-17', '../2025-02-24', '../2025-03-03', '../2025-04-07', '../2026-01-05', '../2026-01-12'],
    'derivatives': ['../2025-01-13', '../2025-02-03', '../2025-02-24', '../2025-04-21', '../2025-05-19'],
    'integral': ['../2024-06-17', '../2026-01-19'],
    'improper-integral': ['../2024-04-01'],
    'partial-derivative': ['../2024-04-29', '../2024-05-27', '../2024-08-19', '../2025-04-07'],
    'inverse-function-theorem': ['../2024-06-10'],
    'sequence-of-functions': ['../2024-07-15','../2024-08-12', '../2025-03-10', '../2025-04-14'],
    'multivariable': ['../2025-04-07'],

    // Complex Analysis tags
    'infinite-series': ['../2024-05-07', '../2024-08-06'],
    'complex-differentiation': ['../2024-06-18'],
    'complex-integration': ['../2024-05-21', '../2024-05-28', '../2024-08-13', '../2025-01-07', '../2025-02-04', '../2025-02-21', '../2025-03-11', '../2025-04-08', '../2026-01-06'],
    'analytic-function': ['../2024-06-04', '../2024-06-11', '../2024-06-25', '../2024-07-02', '../2024-07-23', '../2024-08-20', '../2024-08-27', '../2025-02-14', '../2025-02-18', '../2025-02-25', '../2025-03-25', '../2025-04-15', '../2025-04-22', '../2026-01-13', '../2026-01-20'],
    'singularity': ['../2024-07-16'],
    'harmonic-conjugate': ['../2024-08-27', '../2024-01-02', '../2025-03-18'],
    'mobius-transformation': ['../2025-05-20'],

    // Abstract Algebra tags
    'group-theory': ['../2024-05-01', '../2024-05-22', '../2024-06-12', '../2024-06-19', '../2024-07-10','../2024-07-24', '../2024-07-31', '../2024-08-28', '../2025-01-01', '../2024-01-03', '../2025-01-08', '../2025-01-15', '../2025-02-05', '../2025-02-19', '../2025-02-26', '../2025-03-05', '../2025-03-19', '../2025-04-02', '../2025-04-09', '../2025-05-21', '../2025-05-28', '../2025-06-04'],
    'sylow-theorem': ['../2025-03-19', '../2025-08-21'],
    'cyclic-group': ['../2025-01-22', '../2025-08-21'],
    'group-action': ['../2025-01-29', '../2025-02-12'],
    'ring-theory': ['../2024-05-29', '../2024-06-26', '../2024-07-03', '../2024-07-17', '../2024-08-14', '../2025-03-12'],
    'field-theory': ['../2024-05-08', '../2024-06-05', '../2024-08-07', '../2024-08-21', '../2025-04-16', '../2026-01-07', '../2026-01-14'],
    'splitting-field': ['../2024-05-08'],
    'group-homomorphism': ['../2024-05-22', '../2024-06-12'],

    // Topology tags
    'metric-space': ['../2023-01-05', '../2024-06-06', '../2024-06-27', '../2024-07-04', '../2024-07-11', '../2024-08-01', '../2024-08-15', '../2024-08-29', '../2025-01-02', '../2025-01-16', '../2025-01-23', '../2025-01-30', '../2025-02-13', '../2025-03-20', '../2025-04-03', '../2025-05-22', '../2026-01-15'],
    'product-topology': ['../2024-05-09', '../2025-04-10'],
    'hausdorff-space': ['../2025-04-10'],
    'homeomorphism': ['../2024-05-23', '../2024-06-20', '../2025-06-05'],
    'connectedness': ['../2024-08-22', '../2024-01-04', '../2025-02-06'],
    'subspace-topology': ['../2025-01-09', '../2025-03-13'],
    'completeness': ['../2025-03-13'],

    // ODE and PDE tags
    'ode': ['../2023-01-06', '../2024-05-03', '../2024-05-31', '../2024-06-07', '../2024-06-14', '../2024-06-21', '../2024-08-09', '../2024-08-16', '../2024-08-30', '../2025-01-03', '../2024-01-05', '../2025-01-10', '../2025-01-17', '../2025-01-31', '../2025-02-07', '../2025-02-14', '../2025-03-07', '../2025-03-21', '../2025-04-04', '../2025-05-23', '../2026-01-09', '../2026-01-16', '../2026-01-23'],
    'pde': ['../2024-05-10', '../2024-05-24', '../2024-06-28', '../2024-07-12', '../2024-07-26', '../2024-08-02', '../2024-08-23', '../2025-01-24', '../2025-02-21', '../2025-02-28', '../2025-03-14', '../2025-03-28', '../2025-04-11', '../2025-04-18', '../2025-05-30', '../2026-01-02'],
    'characteristics': ['../2024-05-10'],
    'heat-equation': ['../2024-05-17', '../2025-01-25'],
    'laplace-transformation': ['../2024-08-09'],
    'charpit-method': ['../2025-02-28'],

    // Miscellaneous tags
    'probability-theory': ['../2024-05-04', '../2024-06-15', '../2024-06-22', '../2024-08-24', '../2025-01-18', '../2025-04-19', '../2026-01-10'],
    'statistics': ['../2024-06-15', '../2025-01-04', '../2025-04-19'],
    'normal-distribution': ['../2024-05-04'],
    'numerical-analysis': ['../2024-05-11', '../2024-06-29', '../2024-08-10', '../2024-08-17', '../2024-08-31', '../2025-02-22'],
    'numerical-integration': ['../2024-06-29', '../2024-08-17'],
    'lagrange-multiplier': ['../2024-05-18'],
    'linear-programming': ['../2024-05-25', '../2024-07-06', '../2024-07-13'],
    'functional-analysis': ['../2024-06-01'],
    'number-theory': ['../2024-06-08', '../2024-01-06', '../2026-01-03'],
    'calculus': ['../2024-07-20', '../2025-01-11', '../2025-02-01', '../2025-02-08', '../2025-02-15', '../2025-03-01', '../2025-03-22', '../2025-05-24', '../2026-01-24'],
    
    // GATE
    'gate-2006': ['../2024-05-14'],
    'gate-2007': ['../2024-05-15'],
    'gate-2019': ['../2024-07-26', '../2024-08-05', '../2024-08-07', '../2024-08-19'],
    'gate-2021': ['../2024-06-16'],
    'gate-2022': ['../2024-05-16', '../2024-07-10', '../2024-01-02', '../2024-01-04', '../2025-01-05', '../2025-01-06', '../2025-01-07', '../2024-01-05', '../2024-01-06', '../2024-01-07'],
    'gate-2023': ['../2024-07-13', '../2024-07-20', '../2024-08-02', '../2024-08-06', '../2024-08-08', '../2024-08-09', '../2024-08-10', '../2024-08-11', '../2024-08-17', '../2024-08-18', '../2024-08-23', '../2024-08-25'],
    'gate-2024': ['../2024-05-25', '../2024-05-26', '../2024-05-27','../2024-05-28', '../2024-05-30', '../2024-06-02', '../2024-06-05', '../2024-06-09', '../2024-06-10', '../2024-06-11'],

    // CSIR-NET
    'csir-net-feb-2022': ['../2024-07-28','../2024-07-29', '../2024-07-30', '../2024-07-31', '../2024-08-01'],
    'csir-net-dec-2019': ['../2025-04-09'],
    'csir-net-june-2011': ['../2025-04-11'],

    // NBHM
    'nbhm-msc-2019': ['../2025-03-29'],
    'nbhm-phd-2005': ['../2026-01-06', '../2026-01-13', '../2026-01-17', '../2026-01-18', '../2025-08-18', '../2025-08-19', '../2025-08-20', '../2025-08-21', '../2026-01-24', '../2026-01-25'],

    // MCQ
    'mcq': ['../2025-02-01', '../2025-04-09', '../2025-04-12', '../2025-04-16'],

    // Book-Solution
    'topology-munkres': ['../2025-03-06', '../2025-03-27'],
    'linear-algebra-hoffman-kunze': ['../2025-03-16', '../2025-03-23', '../2025-04-06', '../2025-06-01', '../2026-01-04'],
    'real-analysis-rudin': ['../2025-03-31', '../2025-04-14', '../2025-04-21', '../2025-05-26', '../2025-06-02', '../2025-08-18', '../2025-08-19'],
    'abstract-algebra-herstein': ['../2025-05-21', '../2025-05-28', '../2025-06-04'],
    'complex-analysis-gamelin': ['../2025-08-19'],
};

// ==================== TAG EXTRACTION ====================

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
                if (!problem.date) {
                    console.log(`   ⚠️  Problem missing date, skipping: ${problem.title || 'Untitled'}`);
                    return;
                }
                
                if (!problem.tags || !Array.isArray(problem.tags)) {
                    console.log(`   ⚠️  Problem missing tags: ${problem.date}`);
                    return;
                }
                
                const dateStr = `../${problem.date}`;
                
                problem.tags.forEach(tag => {
                    // Clean tag: remove content in parentheses or brackets
                    let cleanTag = tag;
                    const parentTagMatch = tag.match(/^(.+?)\s+[\(\[].*[\)\]]$/);
                    if (parentTagMatch) {
                        cleanTag = parentTagMatch[1].trim();
                        console.log(`   📎 Cleaned tag: "${tag}" → "${cleanTag}"`);
                    }
                    
                    // Add the cleaned tag
                    if (!tagsMap[cleanTag]) {
                        tagsMap[cleanTag] = [];
                    }
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
    
    // Add or merge auto-generated tags
    for (const [tag, dates] of Object.entries(autoGenerated)) {
        if (merged[tag]) {
            // Merge and remove duplicates
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
            const dateA = new Date(a.replace('../', ''));
            const dateB = new Date(b.replace('../', ''));
            return dateA - dateB;
        });
    }
    
    return sorted;
}

// ==================== FILE GENERATION ====================

function generateFileContent(tagsMap) {
    const lines = [];
    
    lines.push('// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY');
    lines.push('// Generated on: ' + new Date().toISOString());
    lines.push('// Run "node generate-tags.js" to regenerate');
    lines.push('');
    lines.push('// Define the `tagsToProblems` object');
    lines.push('const tagsToProblems = {');
    
    const sortedTags = Object.keys(tagsMap).sort();
    
    sortedTags.forEach((tag, index) => {
        const dates = tagsMap[tag];
        const datesStr = dates.map(d => `'${d}'`).join(', ');
        const comma = index < sortedTags.length - 1 ? ',' : '';
        
        lines.push(`    '${tag}': [${datesStr}]${comma}`);
    });
    
    lines.push('};');
    lines.push('');
    
    return lines.join('\n');
}

// ==================== MAIN EXECUTION ====================

function main() {
    try {
        // Backup existing file
        if (fs.existsSync(OUTPUT_FILE)) {
            fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE);
            console.log('✅ Backup created: tagsToProblems.js.backup\n');
        }
        
        // Extract tags from JSON files
        console.log('📊 Extracting tags from JSON files...\n');
        const autoGenerated = extractTagsFromJSON();
        
        console.log(`\n✅ Found ${Object.keys(autoGenerated).length} unique tags from JSON files`);
        console.log(`✅ Found ${Object.keys(MANUAL_ENTRIES).length} manual entries\n`);
        
        // Merge with manual entries
        console.log('🔄 Merging manual and auto-generated entries...');
        const merged = mergeTags(MANUAL_ENTRIES, autoGenerated);
        
        // Sort dates
        console.log('📅 Sorting dates...');
        const sorted = sortTagDates(merged);
        
        // Generate file content
        console.log('📝 Generating file...');
        const content = generateFileContent(sorted);
        
        // Write to file
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

// Run the script
main();