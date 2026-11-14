// tag-categories.js
// SINGLE SOURCE OF TRUTH for tag -> category grouping and display labels.
// Both tags.js and index.html read this file. Edit tags here, not in either
// of those files.
//
// Load order matters: this file must be included BEFORE tags.js and before
// index.html's inline rendering script.

// ---- category display order + names --------------------------------------
const CATEGORY_ORDER = [
    'linear-algebra', 'real-analysis', 'complex-analysis', 'abstract-algebra',
    'topology', 'differential-equation', 'miscellaneous',
    'gate', 'csir-net', 'nbhm', 'mcq', 'book-solution',
    'uncategorized' // fallback bucket — see note at bottom
];

const CATEGORY_NAMES = {
    'linear-algebra': 'Linear Algebra',
    'real-analysis': 'Real Analysis',
    'complex-analysis': 'Complex Analysis',
    'abstract-algebra': 'Abstract Algebra',
    'topology': 'Topology',
    'differential-equation': 'Differential Equation',
    'miscellaneous': 'Miscellaneous',
    'gate': 'GATE',
    'csir-net': 'CSIR-NET',
    'nbhm': 'NBHM',
    'mcq': 'MCQ',
    'book-solution': 'Book Solutions',
    'uncategorized': 'Uncategorized (needs a category)'
};

// Single glyph per category — kept plain (no icon library dependency),
// shown in a small muted badge before the category name and in the jump nav.
const CATEGORY_ICONS = {
    'linear-algebra': 'V',
    'real-analysis': 'ℝ',
    'complex-analysis': 'ℂ',
    'abstract-algebra': '∘',
    'topology': 'τ',
    'differential-equation': '∂',
    'miscellaneous': '∗',
    'gate': 'G',
    'csir-net': 'N',
    'nbhm': 'B',
    'mcq': '✓',
    'book-solution': '▤',
    'uncategorized': '?'
};

// ---- tag slug -> category slug --------------------------------------------
// This is the exact map that used to live inside tags.js. Moved here so
// index.html can use it too, instead of duplicating it.
const subcategoryToCategoryMap = {
    // linear algebra
    'vector-spaces': 'linear-algebra',
    'subspaces': 'linear-algebra',
    'linear-independence': 'linear-algebra',
    'eigenvalues': 'linear-algebra',
    'eigenvectors': 'linear-algebra',
    'linear-transformation': 'linear-algebra',
    'basis': 'linear-algebra',
    'inner-product-space': 'linear-algebra',
    'characteristic-polynomial': 'linear-algebra',
    'minimal-polynomial': 'linear-algebra',
    'dimension': 'linear-algebra',
    'row-reduction': 'linear-algebra',
    'coordinates': 'linear-algebra',

    // real analysis
    'supremum': 'real-analysis',
    'real-numbers': 'real-analysis',
    'sequences': 'real-analysis',
    'continuity': 'real-analysis',
    'derivatives': 'real-analysis',
    'integral': 'real-analysis',
    'improper-integral': 'real-analysis',
    'partial-derivative': 'real-analysis',
    'inverse-function-theorem': 'real-analysis',
    'sequence-of-functions': 'real-analysis',
    'multivariable': 'real-analysis',
    'uniform-continuity': 'real-analysis', // NEW — was missing; confirm this grouping

    // complex analysis
    'infinite-series': 'complex-analysis',
    'complex-numbers': 'complex-analysis',
    'complex-differentiation': 'complex-analysis',
    'complex-integration': 'complex-analysis',
    'analytic-function': 'complex-analysis',
    'singularity': 'complex-analysis',
    'harmonic-conjugate': 'complex-analysis',
    'mobius-transformation': 'complex-analysis',
    'residue-theorem': 'complex-analysis',
    'cauchy-integral-formula': 'complex-analysis',

    // abstract algebra
    'group-theory': 'abstract-algebra',
    'subgroups': 'abstract-algebra',
    'sylow-theorem': 'abstract-algebra',
    'cyclic-group': 'abstract-algebra',
    'group-action': 'abstract-algebra',
    'ring-theory': 'abstract-algebra',
    'field-theory': 'abstract-algebra',
    'splitting-field': 'abstract-algebra',
    'group-homomorphism': 'abstract-algebra',
    'ideals': 'abstract-algebra',
    'normal-subgroup': 'abstract-algebra',
    'lagrange-theorem': 'abstract-algebra',
    'class-equation': 'abstract-algebra',

    // topology
    'metric-space': 'topology',
    'open-set': 'topology',
    'product-topology': 'topology',
    'hausdorff-space': 'topology',
    'homeomorphism': 'topology',
    'connectedness': 'topology',
    'subspace-topology': 'topology',
    'separation': 'topology',
    'completeness': 'topology',
    'homotopy-theory': 'topology',

    // differential equations
    'ode': 'differential-equation',
    'pde': 'differential-equation',
    'characteristics': 'differential-equation',
    'heat-equation': 'differential-equation',
    'laplace-transformation': 'differential-equation',
    'charpit-method': 'differential-equation',
    'system-of-odes': 'differential-equation',
    'series-solution': 'differential-equation',
    'wave-equation': 'differential-equation',

    // miscellaneous
    'probability-theory': 'miscellaneous',
    'statistics': 'miscellaneous',
    'normal-distribution': 'miscellaneous',
    'number-theory': 'miscellaneous',
    'numerical-analysis': 'miscellaneous',
    'numerical-integration': 'miscellaneous',
    'lagrange-multiplier': 'miscellaneous',
    'linear-programming': 'miscellaneous',
    'functional-analysis': 'miscellaneous',
    'calculus': 'miscellaneous',
    'differential-geometry': 'miscellaneous',
    'combinatorics': 'miscellaneous',
    'set-theory': 'miscellaneous',
    'mappings': 'miscellaneous',
    'relations': 'miscellaneous',

    // gate
    'gate-2006': 'gate', 'gate-2007': 'gate', 'gate-2019': 'gate',
    'gate-2021': 'gate', 'gate-2022': 'gate', 'gate-2023': 'gate', 'gate-2024': 'gate',

    // csir-net
    'csir-net-june-2011': 'csir-net',
    'csir-net-june-2015': 'csir-net',
    'csir-net-dec-2015': 'csir-net',
    'csir-net-dec-2017': 'csir-net',
    'csir-net-june-2018': 'csir-net',
    'csir-net-dec-2019': 'csir-net',
    'csir-net-feb-2022': 'csir-net',

    // nbhm
    'nbhm-msc-2019': 'nbhm', 'nbhm-phd-2005': 'nbhm', 'nbhm-phd-2006': 'nbhm',
    'nbhm-phd-2007': 'nbhm', 'nbhm-phd-2017': 'nbhm',

    // mcq
    'mcq': 'mcq',

    // book-solution
    'topology-munkres': 'book-solution',
    'linear-algebra-hoffman-kunze': 'book-solution',
    'real-analysis-rudin': 'book-solution',
    'real-analysis-bartle-sherbert': 'book-solution',
    'abstract-algebra-herstein': 'book-solution',
    'topics-in-algebra-herstein': 'book-solution',
    'complex-analysis-gamelin': 'book-solution',
    'complex-variables-brown-and-churchill': 'book-solution',

    // ---- added 2026-11-14: topic tags that had no category yet ----
    // linear algebra
    'annihilator': 'linear-algebra', 'cayley-hamilton': 'linear-algebra', 'determinant': 'linear-algebra',
    'dual-basis': 'linear-algebra', 'inverse': 'linear-algebra', 'isomorphism': 'linear-algebra',
    'linear-functional': 'linear-algebra', 'matrices': 'linear-algebra', 'matrix-representation': 'linear-algebra',
    'nilpotent': 'linear-algebra', 'null-space': 'linear-algebra', 'projection': 'linear-algebra',
    'rank': 'linear-algebra', 'rank-nullity': 'linear-algebra', 'similar-matrices': 'linear-algebra',
    'trace': 'linear-algebra',
    // real analysis
    'archimedean-property': 'real-analysis', 'differentiability': 'real-analysis', 'differentiation': 'real-analysis',
    'intermediate-value-theorem': 'real-analysis', 'intervals': 'real-analysis', 'limits': 'real-analysis',
    'mean-value-theorem': 'real-analysis', 'sequence': 'real-analysis', 'series': 'real-analysis',
    'squeeze-theorem': 'real-analysis', 'uniform-convergence': 'real-analysis', 'inequalities': 'real-analysis',
    // complex analysis
    'analytic-functions': 'complex-analysis', 'branch': 'complex-analysis', 'conformal-mapping': 'complex-analysis',
    'elementary-functions': 'complex-analysis', 'harmonic-function': 'complex-analysis', 'laurent-series': 'complex-analysis',
    'liouville-theorem': 'complex-analysis', 'maximum-modulus-principle': 'complex-analysis',
    'morera-theorem': 'complex-analysis', 'power-series': 'complex-analysis', 'roots-of-unity': 'complex-analysis',
    'rouche-theorem': 'complex-analysis', 'zeros': 'complex-analysis',
    // abstract algebra
    'abelian-group': 'abstract-algebra', 'center-of-a-group': 'abstract-algebra', 'conjugacy': 'abstract-algebra',
    'cosets': 'abstract-algebra', 'dihedral-group': 'abstract-algebra', 'equivalence-relation': 'abstract-algebra',
    'group-axioms': 'abstract-algebra', 'order': 'abstract-algebra', 'permutations': 'abstract-algebra',
    'symmetric-group': 'abstract-algebra',
    // topology
    'closed-sets': 'topology', 'closure': 'topology', 'compactness': 'topology',
    'countability-axioms': 'topology', 'order-topology': 'topology',
    // differential equations
    'applications': 'differential-equation', 'boundary-value-problem': 'differential-equation',
    'cauchy-euler': 'differential-equation', 'change-of-variables': 'differential-equation',
    'classification': 'differential-equation', 'constant-coefficients': 'differential-equation',
    'exact-equation': 'differential-equation', 'existence-uniqueness': 'differential-equation',
    'frobenius': 'differential-equation', 'greens-function': 'differential-equation',
    'homogeneous-equation': 'differential-equation', 'integral-equation': 'differential-equation',
    'integrating-factor': 'differential-equation', 'laplace-equation': 'differential-equation',
    'linear-equation': 'differential-equation', 'nonlinear-first-order': 'differential-equation',
    'orthogonal-trajectories': 'differential-equation', 'reduction-of-order': 'differential-equation',
    'separable': 'differential-equation', 'separation-of-variables': 'differential-equation',
    'stability': 'differential-equation', 'sturm-theory': 'differential-equation',
    'undetermined-coefficients': 'differential-equation', 'variation-of-parameters': 'differential-equation',
    'wronskian': 'differential-equation',
    // miscellaneous
    'axiom-of-choice': 'miscellaneous', 'cardinality': 'miscellaneous', 'cartesian-product': 'miscellaneous',
    'countable-sets': 'miscellaneous', 'field-axioms': 'miscellaneous', 'finite-sets': 'miscellaneous',
    'induction': 'miscellaneous', 'order-axioms': 'miscellaneous', 'order-relations': 'miscellaneous',
    'power-set': 'miscellaneous',
};

// ---- resolve a tag slug to its category id --------------------------------
// A tag can be:
//   1. A sub-tag explicitly mapped above (e.g. 'eigenvalues' -> 'linear-algebra')
//   2. A main category tag whose slug IS a category id (e.g. 'linear-algebra'
//      itself, generated day-of-week by generate-tags.js) — belongs to itself
//   3. Anything else — genuinely uncategorized, needs a map entry added
function resolveCategory(tagSlug) {
    if (subcategoryToCategoryMap[tagSlug]) return subcategoryToCategoryMap[tagSlug];
    if (CATEGORY_ORDER.includes(tagSlug)) return tagSlug;
    return 'uncategorized';
}
// The renderer folds these into their canonical tag's count instead of
// showing a second, near-identical, orphaned button. This is a band-aid:
// the real fix is correcting the source JSON tag spelling / the
// parent-tag-stripping regex in generate-tags.js so these never appear again.
const TAG_ALIASES = {
    'metric-sapce': 'metric-space',
    'seqeunces': 'sequences',
    'analytic-functions': 'analytic-function',
    'differential-equations': 'differential-equation',
};
// case-insensitive dupes like 'real-Analysis-rudin' vs 'real-analysis-rudin'
// are folded automatically by the renderer (it lowercases every key before
// grouping), so they don't need an entry here.

// ---- acronyms to preserve when auto-generating a display label -----------
const ACRONYMS = new Set(['gate', 'csir', 'net', 'nbhm', 'mcq', 'ode', 'pde']);
const LOWERCASE_WORDS = new Set(['and', 'of', 'the', 'in']);

// A handful of tags whose auto-generated label isn't quite right (usually
// because the acronym is joined by a hyphen in the "real" name, like
// CSIR-NET, or has irregular capitalization, like PhD). Add entries here
// as you notice odd labels rather than hand-writing every label.
const LABEL_OVERRIDES = {
    'csir-net-june-2011': 'CSIR-NET June 2011',
    'csir-net-dec-2019': 'CSIR-NET Dec 2019',
    'csir-net-feb-2022': 'CSIR-NET Feb 2022',
    'nbhm-msc-2019': 'NBHM MSc 2019',
    'nbhm-phd-2005': 'NBHM PhD 2005',
    'nbhm-phd-2006': 'NBHM PhD 2006',
    'nbhm-phd-2007': 'NBHM PhD 2007',
    'nbhm-phd-2017': 'NBHM PhD 2017',
};

function slugToLabel(slug) {
    if (LABEL_OVERRIDES[slug]) return LABEL_OVERRIDES[slug];

    return slug
        .split('-')
        .map((word, i) => {
            if (/^\d+$/.test(word)) return word; // years etc, keep as-is

            const lower = word.toLowerCase();
            if (ACRONYMS.has(lower)) return word.toUpperCase();

            // Plural of an acronym, e.g. 'odes' -> 'ODEs', 'pdes' -> 'PDEs'
            // (capital acronym + lowercase 's', not a fully-uppercased word).
            if (lower.endsWith('s') && ACRONYMS.has(lower.slice(0, -1))) {
                return word.slice(0, -1).toUpperCase() + 's';
            }

            if (i > 0 && LOWERCASE_WORDS.has(lower)) return lower;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}