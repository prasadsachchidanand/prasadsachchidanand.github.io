document.addEventListener('DOMContentLoaded', function () {

    // =====================================================================
    // CUTOFF DATE — must match LAST_FOLDER_DATE in problem-loader.js
    // =====================================================================
    const LAST_FOLDER_DATE = '2025-12-31';

    function entryToHref(entry) {
        const match = entry.match(/(\d{4}-\d{2}-\d{2})/);
        if (!match) return entry;
        const dateStr = match[1];
        if (dateStr <= LAST_FOLDER_DATE) {
            return `../${dateStr}`;
        } else {
            return `../problem/?date=${dateStr}`;
        }
    }

    function entryToLabel(entry) {
        const match = entry.match(/(\d{4}-\d{2}-\d{2})/);
        return match ? match[1] : entry;
    }

    // =====================================================================
    // NOTE: subcategoryToCategoryMap no longer lives here. It now comes from
    // tag-categories.js (loaded before this file), so index.html's tag
    // renderer and this file always agree on tag -> category grouping.
    // =====================================================================
    if (typeof subcategoryToCategoryMap === 'undefined') {
        console.error('tags.js: subcategoryToCategoryMap is missing — make sure tag-categories.js is loaded before tags.js.');
        return;
    }

    const buttons = document.querySelectorAll('.tag-button');

    const linksContainers = {};
    CATEGORY_ORDER.forEach(function (catId) {
        linksContainers[catId] = document.getElementById(catId + '-links');
    });

    let activeButton = null;
    let activeContainer = null;

    function getButtonTag(button) {
        return button.dataset.tag || button.innerText.trim().toLowerCase().replace(/ /g, '-');
    }

    function findButtonForTag(tag) {
        return Array.from(buttons).find(b => getButtonTag(b) === tag);
    }

    const LINK_CLASSES = [
        'block', 'bg-white', 'border', 'border-gray-200', 'text-indigo-600', 'hover:border-indigo-300', 'hover:bg-indigo-50',
        'font-medium', 'text-sm', 'px-4', 'py-2', 'rounded-lg', 'transition-colors',
        'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-indigo-400', 'focus-visible:ring-offset-1'
    ];
    const YEAR_TAB_BASE = 'rounded-full text-xs font-medium px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1';
    const YEAR_TAB_ACTIVE = YEAR_TAB_BASE + ' bg-indigo-600 text-white';
    const YEAR_TAB_INACTIVE = YEAR_TAB_BASE + ' bg-gray-100 text-gray-600 hover:bg-gray-200';

    // Populates a category's links panel with a tag's problems, grouped into
    // year tabs (most recent year shown first) instead of one long flat grid.
    // Does NOT touch visibility or the URL — callers decide that.
    function renderTagContent(linksContainer, tag) {
        const canonicalTag = (typeof TAG_ALIASES !== 'undefined' && TAG_ALIASES[tag]) || tag;
        const problemDirs = tagsToProblems[canonicalTag] || tagsToProblems[tag];

        const wasHidden = linksContainer.classList.contains('hidden');
        linksContainer.className = 'p-5' + (wasHidden ? ' hidden' : '');
        linksContainer.innerHTML = '';

        if (!problemDirs || problemDirs.length === 0) {
            linksContainer.innerText = `No problems found for the tag "${tag}".`;
            return;
        }

        const byYear = {};
        problemDirs.forEach(entry => {
            const m = entry.match(/(\d{4})-\d{2}-\d{2}/);
            const year = m ? m[1] : 'Other';
            (byYear[year] = byYear[year] || []).push(entry);
        });

        const years = Object.keys(byYear).sort((a, b) => {
            if (a === 'Other') return 1;
            if (b === 'Other') return -1;
            return b.localeCompare(a); // most recent year first
        });

        const tabsRow = document.createElement('div');
        tabsRow.className = 'flex flex-wrap gap-2 mb-4';

        const gridWrap = document.createElement('div');
        gridWrap.className = 'grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 text-center max-h-[480px] overflow-y-auto pr-1';

        function renderYearGrid(year) {
            gridWrap.innerHTML = '';
            // Most recent date first within the year.
            byYear[year].slice().reverse().forEach(entry => {
                const link = document.createElement('a');
                link.href = entryToHref(entry);
                link.innerText = entryToLabel(entry);
                link.target = '_blank';
                link.classList.add(...LINK_CLASSES);
                gridWrap.appendChild(link);
            });
        }

        years.forEach((year, idx) => {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.textContent = year + ' (' + byYear[year].length + ')';
            tab.className = idx === 0 ? YEAR_TAB_ACTIVE : YEAR_TAB_INACTIVE;
            tab.addEventListener('click', function () {
                tabsRow.querySelectorAll('button').forEach(b => { b.className = YEAR_TAB_INACTIVE; });
                tab.className = YEAR_TAB_ACTIVE;
                renderYearGrid(year);
                if (typeof window.expandCategoryForTag === 'function') window.expandCategoryForTag(tag);
            });
            tabsRow.appendChild(tab);
        });

        linksContainer.appendChild(tabsRow);
        linksContainer.appendChild(gridWrap);
        renderYearGrid(years[0]);
    }

    function markActiveButton(button) {
        buttons.forEach(b => {
            b.className = 'tag-button inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 font-medium rounded-full text-sm px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1';
        });
        button.className = 'tag-button inline-flex items-center gap-1.5 bg-indigo-600 border border-indigo-600 text-white font-medium rounded-full text-sm px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1';
    }

    // Sets/clears ?tag= in the address bar. pushState (not replaceState) so
    // the back button steps through the tags a person actually looked at.
    function syncUrl(tag) {
        const url = new URL(window.location);
        if (tag) url.searchParams.set('tag', tag); else url.searchParams.delete('tag');
        if (url.toString() !== window.location.href) {
            history.pushState({ tag: tag || null }, '', url);
        }
    }

    // Always shows (never toggles) a tag's panel — used for deep links,
    // back/forward navigation, and the initial page load.
    function showTag(tag, { updateUrl } = { updateUrl: false }) {
        const button = findButtonForTag(tag);
        if (!button) return null;
        const mainCategory = (typeof resolveCategory === 'function')
            ? resolveCategory(tag)
            : (subcategoryToCategoryMap[tag] || tag);
        const linksContainer = linksContainers[mainCategory];
        if (!linksContainer) {
            console.warn(`tags.js: no links container found for tag "${tag}" (resolved category "${mainCategory}"). Check tag-categories.js.`);
            return null;
        }

        Object.values(linksContainers).forEach(c => { if (c) c.classList.add('hidden'); });
        linksContainer.classList.remove('hidden');
        activeButton = button;
        activeContainer = linksContainer;
        markActiveButton(button);
        renderTagContent(linksContainer, tag);
        if (updateUrl) syncUrl(tag);
        if (typeof window.expandCategoryForTag === 'function') window.expandCategoryForTag(tag);
        return button;
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const tag = getButtonTag(button);
            const mainCategory = (typeof resolveCategory === 'function')
                ? resolveCategory(tag)
                : (subcategoryToCategoryMap[tag] || tag);
            const linksContainer = linksContainers[mainCategory];

            if (!linksContainer) {
                console.warn(`tags.js: no links container found for tag "${tag}" (resolved category "${mainCategory}"). Check tag-categories.js.`);
                return;
            }

            if (button === activeButton) {
                // Re-clicking the active tag toggles its panel shut — mirror
                // that in the URL by dropping the ?tag= param.
                linksContainer.classList.toggle('hidden');
                syncUrl(linksContainer.classList.contains('hidden') ? null : tag);
                if (typeof window.expandCategoryForTag === 'function') window.expandCategoryForTag(tag);
                return;
            }

            showTag(tag, { updateUrl: true });
        });
    });

    window.addEventListener('popstate', function () {
        const tag = getQueryParam('tag');
        if (tag) {
            const button = showTag(tag, { updateUrl: false });
            if (button) button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (activeContainer) {
            activeContainer.classList.add('hidden');
            activeButton = null;
            activeContainer = null;
        }
    });

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    const tagFromUrl = getQueryParam('tag');
    if (tagFromUrl) {
        const button = showTag(tagFromUrl, { updateUrl: false });
        if (button) {
            setTimeout(() => {
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }
});