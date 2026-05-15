document.addEventListener('DOMContentLoaded', function () {

    // =====================================================================
    // CUTOFF DATE — must match LAST_FOLDER_DATE in problem-loader.js
    // =====================================================================
    const LAST_FOLDER_DATE = '2025-12-31';

    // Convert a raw entry from tagsToProblems into the correct href.
    // Handles both old format  '../2026-01-04'
    // and new format           '../problem/?date=2026-01-04'
    function entryToHref(entry) {
        // Extract the date portion (YYYY-MM-DD) wherever it appears
        const match = entry.match(/(\d{4}-\d{2}-\d{2})/);
        if (!match) return entry; // fallback: use as-is
        const dateStr = match[1];

        if (dateStr <= LAST_FOLDER_DATE) {
            return `../${dateStr}`;
        } else {
            return `../problem/?date=${dateStr}`;
        }
    }

    // Display label: always just the date YYYY-MM-DD
    function entryToLabel(entry) {
        const match = entry.match(/(\d{4}-\d{2}-\d{2})/);
        return match ? match[1] : entry;
    }

    // =====================================================================

    const buttons = document.querySelectorAll('.tag-button');

    const linksContainers = {
        'linear-algebra':        document.getElementById('linear-algebra-links'),
        'real-analysis':         document.getElementById('real-analysis-links'),
        'complex-analysis':      document.getElementById('complex-analysis-links'),
        'abstract-algebra':      document.getElementById('abstract-algebra-links'),
        'topology':              document.getElementById('topology-links'),
        'differential-equation': document.getElementById('differential-equation-links'),
        'miscellaneous':         document.getElementById('miscellaneous-links'),
        'gate':                  document.getElementById('gate-links'),
        'csir-net':              document.getElementById('csir-net-links'),
        'nbhm':                  document.getElementById('nbhm-links'),
        'mcq':                   document.getElementById('mcq-links'),
        'book-solution':         document.getElementById('book-solution-links')
    };

    const subcategoryToCategoryMap = {
        // linear algebra
        'eigenvalues': 'linear-algebra',
        'eigenvectors': 'linear-algebra',
        'linear-transformation': 'linear-algebra',
        'basis': 'linear-algebra',
        'inner-product-space': 'linear-algebra',
        'characteristic-polynomial': 'linear-algebra',
        'minimal-polynomial': 'linear-algebra',
        'dimension': 'linear-algebra',
        'row-reduction': 'linear-algebra',

        // real analysis
        'supremum': 'real-analysis',
        'sequences': 'real-analysis',
        'continuity': 'real-analysis',
        'derivatives': 'real-analysis',
        'integral': 'real-analysis',
        'improper-integral': 'real-analysis',
        'partial-derivative': 'real-analysis',
        'inverse-function-theorem': 'real-analysis',
        'sequence-of-functions': 'real-analysis',
        'multivariable': 'real-analysis',

        // complex analysis
        'infinite-series': 'complex-analysis',
        'complex-differentiation': 'complex-analysis',
        'complex-integration': 'complex-analysis',
        'analytic-function': 'complex-analysis',
        'singularity': 'complex-analysis',
        'harmonic-conjugate': 'complex-analysis',
        'mobius-transformation': 'complex-analysis',

        // abstract algebra
        'group-theory': 'abstract-algebra',
        'sylow-theorem': 'abstract-algebra',
        'cyclic-group': 'abstract-algebra',
        'group-action': 'abstract-algebra',
        'ring-theory': 'abstract-algebra',
        'field-theory': 'abstract-algebra',
        'splitting-field': 'abstract-algebra',
        'group-homomorphism': 'abstract-algebra',

        // topology
        'metric-space': 'topology',
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

        // gate
        'gate-2006': 'gate',
        'gate-2007': 'gate',
        'gate-2019': 'gate',
        'gate-2021': 'gate',
        'gate-2022': 'gate',
        'gate-2023': 'gate',
        'gate-2024': 'gate',

        // csir-net
        'csir-net-june-2011': 'csir-net',
        'csir-net-dec-2019': 'csir-net',
        'csir-net-feb-2022': 'csir-net',

        // nbhm
        'nbhm-msc-2019': 'nbhm',
        'nbhm-phd-2005': 'nbhm',
        'nbhm-phd-2006': 'nbhm',
        'nbhm-phd-2007': 'nbhm',
        'nbhm-phd-2017': 'nbhm',

        // mcq
        'mcq': 'mcq',

        // book-solution
        'topology-munkres': 'book-solution',
        'linear-algebra-hoffman-kunze': 'book-solution',
        'real-analysis-rudin': 'book-solution',
        'abstract-algebra-herstein': 'book-solution',
        'complex-analysis-gamelin': 'book-solution',
    };

    let activeButton = null;
    let activeContainer = null;

    function toggleLinksContainer(button, linksContainer) {
        if (button === activeButton) {
            linksContainer.classList.toggle('hidden');
        } else {
            Object.values(linksContainers).forEach(c => { if (c) c.classList.add('hidden'); });
            linksContainer.classList.remove('hidden');
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const tag = button.innerText.trim().toLowerCase().replace(/ /g, '-');
            const mainCategory = subcategoryToCategoryMap[tag] || tag;
            const linksContainer = linksContainers[mainCategory];

            toggleLinksContainer(button, linksContainer);

            if (activeButton === button) return;

            activeButton = button;
            activeContainer = linksContainer;

            buttons.forEach(b => {
                b.className = 'tag-button text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br font-medium rounded-lg text-base px-5 py-2.5 text-center me-2 mb-2';
            });
            button.className = 'tag-button text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br font-medium rounded-lg text-base px-5 py-2.5 text-center me-2 mb-2';

            const problemDirs = tagsToProblems[tag];

            linksContainer.innerHTML = '';
            linksContainer.classList.add(
                'grid', 'gap-4', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3',
                'lg:grid-cols-4', 'xl:grid-cols-5', '2xl-grid-cols-6', 'text-center'
            );

            if (problemDirs && problemDirs.length > 0) {
                problemDirs.forEach(entry => {
                    const href  = entryToHref(entry);   // ← cutoff-aware URL
                    const label = entryToLabel(entry);  // ← always YYYY-MM-DD

                    const link = document.createElement('a');
                    link.href = href;
                    link.innerText = label;
                    link.classList.add(
                        'block', 'text-blue-500', 'hover:text-blue-800',
                        'font-medium', 'text-lg', 'px-4', 'py-2', 'rounded',
                        'shadow', 'transition', 'duration-300', 'ease-in-out', 'hover:bg-gray-100'
                    );
                    link.target = '_blank';
                    linksContainer.appendChild(link);
                });
            } else {
                linksContainer.innerText = `No problems found for the tag "${tag}".`;
            }
        });
    });

    // Handle ?tag= URL parameter
    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    const tagFromUrl = getQueryParam('tag');
    if (tagFromUrl) {
        const buttonToClick = Array.from(buttons).find(button =>
            button.innerText.trim().toLowerCase().replace(/ /g, '-') === tagFromUrl
        );
        if (buttonToClick) {
            buttonToClick.click();
            setTimeout(() => {
                buttonToClick.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }
});