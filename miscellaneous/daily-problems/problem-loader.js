// problem-loader.js - Enhanced with Solved Feature & SEO Optimization
// Place this file in: /miscellaneous/daily-problems/problem-loader.js

// Map day of week to topic/JSON file
const topicMap = {
    0: 'linear-algebra',          // Sunday
    1: 'real-analysis',           // Monday
    2: 'complex-analysis',        // Tuesday
    3: 'abstract-algebra',        // Wednesday
    4: 'topology',                // Thursday
    5: 'differential-equations',  // Friday
    6: 'miscellaneous'            // Saturday
};

// =====================================================================
// CUTOFF DATE
// Dates UP TO AND INCLUDING this date have a real folder (yyyy-mm-dd/).
// Dates AFTER this date use the canonical page (/problem/?date=yyyy-mm-dd).
// Set this to the last date you manually created a folder for.
// =====================================================================
const LAST_FOLDER_DATE = '2025-12-31';

// ==================== URL / DATE HELPERS ====================

// Get problem date — works for both:
//   /miscellaneous/daily-problems/2025-03-10/   (old folder style)
//   /miscellaneous/daily-problems/problem/?date=2026-05-06  (new canonical style)
function getProblemDateFromURL() {
    // 1. Try query string first (?date=YYYY-MM-DD)
    const params = new URLSearchParams(window.location.search);
    const qDate = params.get('date');
    if (qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate)) {
        // If someone types ?date=2023-05-10 on the canonical page,
        // that date has a real folder — redirect there immediately.
        if (qDate <= LAST_FOLDER_DATE && window.location.pathname.includes('/problem/')) {
            window.location.replace(`/miscellaneous/daily-problems/${qDate}/`);
            return null; // halt further execution while redirect fires
        }
        return qDate;
    }
    // 2. Fall back to path segment (/YYYY-MM-DD/)
    const path = window.location.pathname;
    const match = path.match(/\/(\d{4}-\d{2}-\d{2})\/?/);
    return match ? match[1] : null;
}

// Build the correct URL for a given date string
function buildDateURL(dateString) {
    if (dateString <= LAST_FOLDER_DATE) {
        return `/miscellaneous/daily-problems/${dateString}/`;
    } else {
        return `/miscellaneous/daily-problems/problem/?date=${dateString}`;
    }
}

// Data JSON files are always one level up from the current page
function getDataBasePath() {
    return '../data/';
}

// Pages under /problem/ are the canonical (2026+), query-string driven pages.
// Old dated folders (YYYY-MM-DD/) share this same script but get a simpler
// experience: no mini-calendar and no "jump to topic" button/modal, since both
// of those surface recent (current-era) dates that have no contextual link to
// whatever old problem is being viewed on a legacy page.
function isCanonicalPage() {
    return window.location.pathname.includes('/problem/');
}

// ==================== SOLVED STATUS MANAGEMENT ====================
function isProblemSolved(problemDate) {
    const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '{}');
    return solvedProblems[problemDate] === true;
}

function toggleSolvedStatus(problemDate) {
    const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '{}');
    solvedProblems[problemDate] = !solvedProblems[problemDate];
    localStorage.setItem('solvedProblems', JSON.stringify(solvedProblems));
    updateTotalSolvedCount();
    return solvedProblems[problemDate];
}

function getSolvedCountForTopic(problems) {
    const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '{}');
    return problems.filter(p => solvedProblems[p.date] === true).length;
}

function getTotalSolvedCount() {
    const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '{}');
    return Object.values(solvedProblems).filter(status => status === true).length;
}

function createSolvedButton(problemDate) {
    const isSolved = isProblemSolved(problemDate);
    let solvedButton = document.getElementById('solved-button');
    
    if (!solvedButton) {
        solvedButton = document.createElement('button');
        solvedButton.id = 'solved-button';
    }
    
    if (isSolved) {
        solvedButton.className = 'px-3 py-1 rounded font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700';
        solvedButton.innerHTML = '✓ Solved';
    } else {
        solvedButton.className = 'px-3 py-1 rounded font-semibold transition-all duration-200 bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200';
        solvedButton.innerHTML = 'Mark as Solved';
    }
    
    solvedButton.onclick = function() {
        const newStatus = toggleSolvedStatus(problemDate);
        createSolvedButton(problemDate);
        updatePageTitleSolvedIndicator(newStatus);
        showSolvedConfirmation(newStatus);
        refreshTopicModalIfOpen();
    };
    
    return solvedButton;
}

function showSolvedConfirmation(isSolved) {
    const existing = document.getElementById('solved-confirmation');
    if (existing) existing.remove();
    
    const confirmation = document.createElement('div');
    confirmation.id = 'solved-confirmation';
    confirmation.className = 'fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
    confirmation.style.backgroundColor = isSolved ? '#10b981' : '#6b7280';
    confirmation.style.color = 'white';
    confirmation.innerHTML = isSolved 
        ? `✓ Problem marked as solved! (Total: ${getTotalSolvedCount()} problems)` 
        : `Problem marked as unsolved. (Total: ${getTotalSolvedCount()} problems)`;
    document.body.appendChild(confirmation);
    
    setTimeout(() => { 
        confirmation.style.opacity = '0'; 
        setTimeout(() => confirmation.remove(), 300); 
    }, 3000);
}

function updatePageTitleSolvedIndicator(isSolved) {
    const titleElement = document.querySelector('h1');
    if (!titleElement) return;
    
    let indicator = titleElement.querySelector('.solved-indicator');
    if (!indicator) {
        indicator = document.createElement('span');
        indicator.className = 'solved-indicator ml-2 text-2xl';
        titleElement.appendChild(indicator);
    }
    
    indicator.textContent = isSolved ? '✓' : '';
    indicator.style.color = '#10b981';
}

function updateTotalSolvedCount() {
    let solvedCountDisplay = document.getElementById('total-solved-count');
    if (!solvedCountDisplay) {
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            solvedCountDisplay = document.createElement('div');
            solvedCountDisplay.id = 'total-solved-count';
            solvedCountDisplay.className = 'text-sm text-gray-600 mt-1 mb-4';
            titleElement.parentNode.insertBefore(solvedCountDisplay, titleElement.nextSibling);
        }
    }
    
    if (solvedCountDisplay) {
        const totalSolved = getTotalSolvedCount();
        solvedCountDisplay.innerHTML = `
            <div class="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200">
                <span class="font-semibold">${totalSolved}</span>
                <span class="ml-1">problem${totalSolved === 1 ? '' : 's'} solved</span>
                <button id="clear-solved-data" class="ml-2 text-xs text-red-500 hover:text-red-700 hover:underline">
                    (clear)
                </button>
            </div>
        `;
        
        document.getElementById('clear-solved-data')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to clear all solved problem data? This cannot be undone.')) {
                localStorage.removeItem('solvedProblems');
                updateTotalSolvedCount();
                location.reload();
            }
        });
    }
}

function styleNavigationLinks() {
    const nav = document.querySelector('nav[aria-label="Page navigation example"]');
    if (!nav) return;

    const ul = nav.querySelector('ul');
    if (ul) {
        ul.className = 'flex list-none items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm';
    }

    const links = nav.querySelectorAll('.page-link');
    links.forEach(link => {
        link.className = 'page-link relative block py-1.5 px-4 rounded-full text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200';
    });

    const items = nav.querySelectorAll('.page-item');
    items.forEach((item, i) => {
        if (i < items.length - 1) {
            item.style.borderRight = '1px solid #e5e7eb';
        }
    });
}

function refreshTopicModalIfOpen() {
    const modal = document.getElementById('topic-modal');
    if (modal && !modal.classList.contains('hidden')) {
        const topicBtn = document.getElementById('topic-link');
        if (topicBtn && topicBtn.onclick) {
            modal.classList.add('hidden');
            setTimeout(() => {
                topicBtn.onclick({preventDefault: () => {}});
            }, 100);
        }
    }
}

// ==================== CORE FUNCTIONS ====================

function getTopicFromDate(dateString) {
    try {
        const date = new Date(dateString + 'T00:00:00');
        const dayOfWeek = date.getDay();
        return topicMap[dayOfWeek] || 'miscellaneous';
    } catch (error) {
        console.error('Error parsing date:', error);
        return 'miscellaneous';
    }
}

function isProblemVisible(problemDateString) {
    const [year, month, day] = problemDateString.split('-').map(Number);
    const problemDate = new Date(year, month - 1, day, 0, 0, 0);
    const now = new Date();
    return now >= problemDate;
}

function isSolutionVisible(problemDateString) {
    const [year, month, day] = problemDateString.split('-').map(Number);
    const problemDate = new Date(year, month - 1, day, 23, 59, 59);
    const now = new Date();
    return now > problemDate;
}

function formatTopicName(topic) {
    return topic.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function renderTitleHeader(problemDate, topicName) {
    const titleEl = document.getElementById('problem-date-title');
    if (!titleEl) return;

    const [year, month, day] = problemDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const topic = topicName ? formatTopicName(topicName) : null;

    const h1 = titleEl.closest('h1') || titleEl.parentElement;
    if (!h1) {
        titleEl.textContent = formattedDate;
        return;
    }

    h1.classList.add('mb-4');
    h1.innerHTML = `
        <span class="block text-xs font-semibold tracking-widest uppercase text-blue-500 mb-1">
            ${topic ? `${topic} &middot; ` : ''}Problem of the Day
        </span>
        <span id="problem-date-title" class="block text-4xl font-semibold text-gray-900">
            ${formattedDate}
        </span>
        <span class="block mx-auto mt-3 w-20 h-0.5 bg-indigo-500 rounded"></span>
    `;
}

function getDifficultyBadge(difficulty) {
    const difficultyLower = (difficulty || 'medium').toLowerCase();
    const colorMap = {
        'easy': 'bg-green-100 text-green-800 border-green-300',
        'medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'hard': 'bg-red-100 text-red-800 border-red-300'
    };
    const color = colorMap[difficultyLower] || colorMap['medium'];
    return `<span class="inline-block ${color} text-sm font-semibold rounded px-3 py-1 border">${difficulty || 'Medium'}</span>`;
}

// ==================== MCQ RENDERING ====================
// Renders problem.options as clickable buttons when problem.isMcq is true.
// On first click: selected wrong option -> red, correct option -> green,
// all options then lock (no re-answering).
function createMcqOptions(problem) {
    const existing = document.getElementById('mcq-options');
    if (existing) existing.remove();

    if (!problem.isMcq || !Array.isArray(problem.options) || problem.options.length === 0) {
        return null;
    }

    const wrap = document.createElement('div');
    wrap.id = 'mcq-options';
    wrap.className = 'mt-4 space-y-2';

    const baseClasses = ['border-gray-200', 'hover:border-indigo-300', 'hover:bg-indigo-50'];

    const optionsList = document.createElement('div');
    optionsList.className = 'space-y-2';
    wrap.appendChild(optionsList);

    const feedback = document.createElement('div');
    feedback.id = 'mcq-feedback';
    feedback.className = 'hidden mt-3 px-4 py-2.5 rounded-lg text-sm font-medium';
    wrap.appendChild(feedback);

    const correctOpt = problem.options.find(o => o.label === problem.correctAnswer);

    problem.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.label = opt.label;
        btn.className = `mcq-option block w-full text-left px-4 py-2.5 border-2 rounded-lg bg-white transition-colors duration-150 ${baseClasses.join(' ')}`;
        btn.innerHTML = `<span class="font-semibold mr-2">(${opt.label})</span><span>${opt.text}</span>`;

        btn.addEventListener('click', () => {
            if (wrap.dataset.answered) return; // lock after first answer
            wrap.dataset.answered = 'true';

            const isCorrect = opt.label === problem.correctAnswer;
            btn.classList.remove(...baseClasses);
            btn.classList.add(isCorrect ? 'border-green-500' : 'border-red-500', isCorrect ? 'bg-green-50' : 'bg-red-50');

            if (!isCorrect) {
                const correctBtn = wrap.querySelector(`[data-label="${problem.correctAnswer}"]`);
                if (correctBtn) {
                    correctBtn.classList.remove(...baseClasses);
                    correctBtn.classList.add('border-green-500', 'bg-green-50');
                }
            }

            // Disable further interaction/hover styling on all options
            wrap.querySelectorAll('.mcq-option').forEach(b => {
                b.classList.remove('hover:border-indigo-300', 'hover:bg-indigo-50');
                b.style.cursor = 'default';
            });

            // Feedback message
            feedback.classList.remove('hidden');
            if (isCorrect) {
                feedback.className = 'mt-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-green-50 text-green-800 border border-green-200';
                feedback.innerHTML = `✓ Correct! The answer is (${opt.label}) ${correctOpt ? correctOpt.text : ''}`;
            } else {
                feedback.className = 'mt-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-50 text-red-800 border border-red-200';
                feedback.innerHTML = `✗ Not quite. The correct answer is (${problem.correctAnswer}) ${correctOpt ? correctOpt.text : ''}`;
            }

            if (window.MathJax && MathJax.typesetPromise) {
                MathJax.typesetPromise([wrap]).catch(err => console.log('MathJax mcq render error:', err));
            }
        });

        optionsList.appendChild(btn);
    });

    return wrap;
}

async function loadAllProblemDates() {
    const allDates = {};
    const topics = Object.values(topicMap);
    const base = getDataBasePath();
    
    for (const topic of topics) {
        try {
            const response = await fetch(`${base}${topic}.json`);
            if (!response.ok) continue;
            const data = await response.json();
            if (data.problems) {
                data.problems.forEach(p => {
                    allDates[p.date] = topic;
                });
            }
        } catch (e) {
            console.error(`Calendar: failed to load ${topic}`, e);
        }
    }
    return allDates;
}

// ==================== MAIN LOADER ====================

async function loadProblem() {
    try {
        const problemDate = getProblemDateFromURL();
        
        if (!problemDate) {
            // null means either:
            //   a) a pre-cutoff date was found and a folder redirect was already fired, OR
            //   b) no date at all — redirect to today.
            // Only redirect to today if we are NOT already in the middle of a folder redirect.
            // We detect case (a) by checking if the URL still contains /problem/ with no ?date=.
            const params = new URLSearchParams(window.location.search);
            if (!params.get('date') && window.location.pathname.includes('/problem/')) {
                // Genuine missing date — redirect to today
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
                window.location.replace(`?date=${todayStr}`);
            }
            // In all null cases, stop further execution here
            return;
        }
        
        renderTitleHeader(problemDate, null);
        
        const topic = getTopicFromDate(problemDate);
        renderTitleHeader(problemDate, topic);

        const base = getDataBasePath();
        const jsonPath = `${base}${topic}.json`;
        
        console.log(`Loading ${topic} data for ${problemDate} from ${jsonPath}`);
        
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${topic} data (${response.status})`);
        }
        
        const data = await response.json();
        const problem = data.problems.find(p => p.date === problemDate);
        
        if (!isProblemVisible(problemDate)) {
            displayUpcomingProblem(problemDate, data.topic);
            if (problem) updateMetadata(problemDate, problem, data.topic);
            updateNavigationLinks(problemDate, topic, data.problems, false);
            updateTotalSolvedCount();
            return;
        }
        
        if (!problem) {
            displayMissingProblem(problemDate, data.topic);
            updateNavigationLinks(problemDate, topic, data.problems, true);
            updateTotalSolvedCount();
            return;
        }
        
        displayProblem(problem, problemDate, data.topic, data.problems);
        updateMetadata(problemDate, problem, data.topic);
        updateNavigationLinks(problemDate, topic, data.problems, true);
        updatePageTitleSolvedIndicator(isProblemSolved(problemDate));
        updateTotalSolvedCount();
        styleShareButton();

        if (isCanonicalPage()) {
            loadAllProblemDates().then(allDates => {
                createMiniCalendar(problemDate, allDates);
            });
        }
        
    } catch (error) {
        console.error('Error loading problem:', error);
        displayError('Failed to load problem data. Please check console for details.');
        updateTotalSolvedCount();
    }
}

// ==================== DISPLAY FUNCTIONS ====================

function displayMissingProblem(problemDate, topicName) {
    const problemBox = document.querySelector('.border-red-500');
    const problemStrong = problemBox.querySelector('strong');
    if (problemStrong) problemStrong.remove();
    problemBox.innerHTML = '';
    
    const [year, month, day] = problemDate.split('-');
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    const missingMessage = document.createElement('div');
    missingMessage.className = 'text-lg';
    missingMessage.innerHTML = `
        <span class="text-orange-600 font-semibold text-xl">⏳ Problem Coming Soon!</span>
        <p class="mt-3 text-gray-700">The problem for <strong>${formattedDate}</strong> is being prepared and will be posted shortly.</p>
        <p class="mt-2 text-gray-600">Topic: <strong class="text-blue-600">${formatTopicName(topicName)}</strong></p>
        <p class="mt-3 text-gray-500 italic">Please check back later. Thank you for your patience! In the meanwhile solve other ${formatTopicName(topicName)} problems.</p>
    `;
    problemBox.appendChild(missingMessage);
    
    const solutionBox = document.getElementById('solution-box');
    if (solutionBox) solutionBox.style.display = 'none';
    const hintBox = document.getElementById('hint-box');
    if (hintBox) hintBox.style.display = 'none';
}

function displayUpcomingProblem(problemDate, topicName) {
    const problemBox = document.querySelector('.border-red-500');
    const problemStrong = problemBox.querySelector('strong');
    if (problemStrong) problemStrong.remove();
    problemBox.innerHTML = '';
    
    const [year, month, day] = problemDate.split('-');
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    const upcomingMessage = document.createElement('div');
    upcomingMessage.className = 'text-lg';
    upcomingMessage.innerHTML = `
        <span class="text-blue-600 font-semibold text-xl">📅 Coming Soon!</span>
        <p class="mt-3 text-gray-700">The problem for <strong>${formattedDate}</strong> will be posted on that day.</p>
        <p class="mt-2 text-gray-600">Topic: <strong class="text-blue-600">${formatTopicName(topicName)}</strong></p>
        <p class="mt-3 text-gray-500 italic">Please check back on ${day}-${month}-${year} to see the problem.</p>
    `;
    problemBox.appendChild(upcomingMessage);
    
    const solutionBox = document.getElementById('solution-box');
    if (solutionBox) solutionBox.style.display = 'none';
    const hintBox = document.getElementById('hint-box');
    if (hintBox) hintBox.style.display = 'none';
}

function displayProblem(problem, problemDate, topicName, currentProblems) {
    const problemBox = document.querySelector('.border-red-500');
    const problemStrong = problemBox.querySelector('strong');
    
    const parent = problemStrong.parentNode;
    const nextSiblings = [];
    let nextSibling = problemStrong.nextSibling;
    while (nextSibling) {
        nextSiblings.push(nextSibling);
        nextSibling = nextSibling.nextSibling;
    }
    nextSiblings.forEach(sibling => sibling.remove());
    
    const problemContainer = document.createElement('span');
    problemContainer.innerHTML = problem.problem;
    parent.appendChild(problemContainer);
    
    let tagsContainer = problemBox.querySelector('.mt-2');
    if (!tagsContainer) {
        tagsContainer = document.createElement('div');
        tagsContainer.className = 'mt-2';
        problemBox.appendChild(tagsContainer);
    }
    tagsContainer.innerHTML = '';
    
    if (problem.difficulty) {
        const difficultySpan = document.createElement('span');
        difficultySpan.innerHTML = getDifficultyBadge(problem.difficulty);
        difficultySpan.className = 'inline-block mr-2';
        tagsContainer.appendChild(difficultySpan);
    }
    
    if (problem.tags && Array.isArray(problem.tags)) {
        problem.tags.forEach(tag => {
            let tagUrl = tag.includes('(') ? tag.split('(')[0].trim() : tag;
            const tagLink = document.createElement('a');
            tagLink.href = `/miscellaneous/daily-problems/tags/?tag=${encodeURIComponent(tagUrl)}`;
            tagLink.target = '_blank';
            tagLink.className = 'inline-block bg-gray-200 text-blue-500 text-sm rounded px-2 py-1 my-1 hover:bg-blue-100 mr-2';
            tagLink.textContent = tag;
            tagsContainer.appendChild(tagLink);
        });
    }

    // MCQ options — rendered right after the tags row, before hint/solution/solved buttons
    const mcqOptions = createMcqOptions(problem);
    if (mcqOptions) {
        problemBox.appendChild(mcqOptions);
    }
    
    const hasHint = problem.hint && problem.hint.trim() !== '';
    const hasSolution = problem.solution && problem.solution.trim() !== '';
    const solutionVisible = isSolutionVisible(problemDate);
    
    let hintBox = document.getElementById('hint-box');
    if (hasHint) {
        const solutionBox = document.getElementById('solution-box');
        if (!hintBox) {
            hintBox = createHintBox(problem.hint);
            if (problemBox && solutionBox && solutionBox.parentNode) {
                solutionBox.parentNode.insertBefore(hintBox, solutionBox);
            }
        } else {
            updateHintBox(hintBox, problem.hint);
        }
        hintBox.style.display = '';
        hintBox.classList.add('hidden');
    } else if (hintBox) {
        hintBox.remove();
    }
    
    const solutionBox = document.getElementById('solution-box');
    if (solutionBox) {
        solutionBox.style.display = '';
        if (hasSolution && solutionVisible) {
            updateSolutionBox(solutionBox, problem.solution);
            solutionBox.classList.add('hidden');
        } else {
            const solutionContent = solutionBox.querySelector('.leading-relaxed');
            if (solutionContent) {
                solutionContent.innerHTML = `
                    <strong>Solution: </strong>
                    <span class="text-lg text-red-600">I encourage you to attempt to solve the problem today. You may use the comment box to write your solution. <br> The solution will be provided tomorrow. This will give you the opportunity to test your understanding of the problem and to improve your skills in solving similar problems in the future.</span>
                `;
            }
        }
    }
    
    createToggleButtons(problemBox, hasHint, hasSolution && solutionVisible, problemDate);
    displaySimilarProblems(problem, currentProblems, problemDate, topicName);
    
    const problemIdInput = document.getElementById('problemId');
    if (problemIdInput) {
        problemIdInput.value = problemDate;
        // Notify comment.js that the problem ID is now available.
        // comment.js listens for this event to initialize the Firebase collection.
        document.dispatchEvent(new CustomEvent('problemIdReady', { detail: { problemId: problemDate } }));
    }
    
    if (window.MathJax && MathJax.typesetPromise) {
        setTimeout(() => {
            MathJax.typesetPromise().catch(err => console.log('MathJax initial render error:', err));
        }, 100);
    }
}

function createToggleButtons(problemBox, hasHint, hasSolution, problemDate) {
    const existingButtons = problemBox.querySelectorAll('button[onclick*="toggle"]');
    existingButtons.forEach(btn => btn.remove());
    
    const allContainers = problemBox.querySelectorAll('.mt-2');
    allContainers.forEach(container => {
        if (container.querySelector('button')) container.remove();
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-2 flex flex-wrap items-center gap-2';
    
    if (hasHint) {
        const hintButton = document.createElement('button');
        hintButton.id = 'hint-button';
        hintButton.onclick = toggleHint;
        hintButton.className = 'bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600';
        hintButton.textContent = 'Show Hint';
        buttonContainer.appendChild(hintButton);
    }
    
    if (hasSolution) {
        const solutionButton = document.createElement('button');
        solutionButton.id = 'solution-button';
        solutionButton.onclick = toggleSolution;
        solutionButton.className = 'bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600';
        solutionButton.textContent = 'Show Solution';
        buttonContainer.appendChild(solutionButton);
    }
    
    buttonContainer.appendChild(createSolvedButton(problemDate));
    problemBox.appendChild(buttonContainer);
}

function createHintBox(hintText) {
    const hintBox = document.createElement('div');
    hintBox.id = 'hint-box';
    hintBox.className = 'border-l-4 border-yellow-500 mt-4 p-4 bg-yellow-50';
    hintBox.innerHTML = `
        <div class="leading-relaxed lg:text-lg md:text-base text-justify">
            <strong>Hint:</strong> ${hintText}
        </div>
    `;
    return hintBox;
}

function updateHintBox(hintBox, hintText) {
    const content = hintBox.querySelector('.leading-relaxed');
    if (content) content.innerHTML = `<strong>Hint:</strong> ${hintText}`;
}

function updateSolutionBox(solutionBox, solutionText) {
    const content = solutionBox.querySelector('.leading-relaxed');
    if (content) {
        content.innerHTML = '';
        const solutionLabel = document.createElement('strong');
        solutionLabel.textContent = 'Solution: ';
        content.appendChild(solutionLabel);
        const solutionContainer = document.createElement('div');
        solutionContainer.innerHTML = solutionText;
        content.appendChild(solutionContainer);
    }
}

function toggleHint() {
    const hintBox = document.getElementById('hint-box');
    const hintButton = document.getElementById('hint-button');
    if (hintBox && hintButton) {
        hintBox.classList.toggle('hidden');
        hintButton.textContent = hintBox.classList.contains('hidden') ? 'Show Hint' : 'Hide Hint';
        if (!hintBox.classList.contains('hidden') && window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([hintBox]).catch(err => console.log('MathJax hint render error:', err));
        }
    }
}

function toggleSolution() {
    const solutionBox = document.getElementById('solution-box');
    const solutionButton = document.getElementById('solution-button');
    if (solutionBox && solutionButton) {
        solutionBox.classList.toggle('hidden');
        solutionButton.textContent = solutionBox.classList.contains('hidden') ? 'Show Solution' : 'Hide Solution';
        if (!solutionBox.classList.contains('hidden') && window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([solutionBox]).catch(err => console.log('MathJax solution render error:', err));
        }
    }
}

function updateMetadata(problemDate, problem, topicName) {
    const baseURL = window.location.origin + buildDateURL(problemDate);
    
    let title;
    if (problem.title && problem.title.trim() !== '' && problem.title !== 'Problem of the Day') {
        title = topicName.toLowerCase() === 'miscellaneous'
            ? `Problem of the Day | ${problemDate} | ${problem.title} | Sachchidanand Prasad`
            : `Problem of the Day | ${problemDate} | ${topicName} - ${problem.title} | Sachchidanand Prasad`;
    } else {
        title = `Problem of the Day | ${problemDate} | ${topicName} | Sachchidanand Prasad`;
    }
    
    const description = problem.problem.length > 150 
        ? problem.problem.substring(0, 150).replace(/[^\w\s]/gi, '') + '...'
        : problem.problem.replace(/[^\w\s]/gi, '');
    
    document.title = title;
    
    const metaSelectors = [
        'meta[name="description"]', 'meta[property="og:title"]',
        'meta[property="og:description"]', 'meta[property="og:url"]',
        'meta[name="twitter:title"]', 'meta[name="twitter:description"]',
        'meta[name="linkedin:title"]', 'meta[name="linkedin:description"]'
    ];
    
    metaSelectors.forEach((selector, index) => {
        const el = document.querySelector(selector);
        if (el) {
            switch(index) {
                case 0: case 2: case 5: case 7: el.content = description; break;
                case 3: el.content = baseURL; break;
                default: el.content = title;
            }
        }
    });

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = baseURL;
    
    if (document.getElementById('shareLink')) {
        document.getElementById('shareLink').value = baseURL;
    }
    
    try {
        const structuredData = {
            "@context": "https://schema.org", "@type": "Article",
            "headline": title, "datePublished": problemDate,
            "author": { "@type": "Person", "name": "Sachchidanand Prasad" },
            "publisher": { "@type": "Organization", "name": "Sachchidanand Prasad",
                "logo": { "@type": "ImageObject", "url": "https://prasadsachchidanand.github.io/assets/img/favicon.png" }
            },
            "description": description,
            "image": "https://prasadsachchidanand.github.io/miscellaneous/daily-problems/img/daily-problem.png",
            "mainEntityOfPage": { "@type": "WebPage", "@id": baseURL }
        };
        let scriptTag = document.getElementById('structured-data');
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = 'structured-data';
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(structuredData, null, 2);
    } catch (error) {
        console.error('Error updating structured data:', error);
    }
}

function updateNavigationLinks(problemDate, currentTopic, currentProblems, isProblemVisible) {
    try {
        const [year, month, day] = problemDate.split('-').map(Number);
        const currentDate = new Date(Date.UTC(year, month - 1, day));
        
        const prevDate = new Date(currentDate);
        prevDate.setUTCDate(prevDate.getUTCDate() - 1);
        
        const nextDate = new Date(currentDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        
        const formatDate = (d) => {
            const y = d.getUTCFullYear();
            const m = String(d.getUTCMonth() + 1).padStart(2, '0');
            const dd = String(d.getUTCDate()).padStart(2, '0');
            return `${y}-${m}-${dd}`;
        };
        
        const prevLink = document.getElementById('prev-link');
        const nextLink = document.getElementById('next-link');
        
        if (prevLink) prevLink.href = buildDateURL(formatDate(prevDate));
        
        if (nextLink) {
            if (!isProblemVisible) {
                nextLink.href = 'javascript:void(0)';
                nextLink.style.cursor = 'not-allowed';
                nextLink.style.pointerEvents = 'none';
                nextLink.classList.remove('text-blue-500', 'hover:text-blue-800');
                nextLink.classList.add('text-gray-400');
            } else {
                nextLink.href = buildDateURL(formatDate(nextDate));
                nextLink.style.cursor = 'pointer';
                nextLink.style.pointerEvents = 'auto';
                nextLink.classList.remove('text-gray-400');
                nextLink.classList.add('text-blue-500', 'hover:text-blue-800');
            }
        }
        
        if (isCanonicalPage()) {
            setupTopicProblemsModal(currentTopic, currentProblems, problemDate);
            addTopicButton(currentTopic);
        }
        styleNavigationLinks();
        
    } catch (error) {
        console.error('Error updating navigation links:', error);
    }
}

function addTopicButton(topicName) {
    const navList = document.querySelector('nav ul');
    if (!navList) return;
    
    const existingTopicBtn = document.getElementById('topic-button-li');
    if (existingTopicBtn) existingTopicBtn.remove();
    
    const formattedTopic = formatTopicName(topicName);
    const nextButton = document.querySelector('#next-link').parentElement;
    
    const topicButtonLi = document.createElement('li');
    topicButtonLi.id = 'topic-button-li';
    topicButtonLi.className = 'page-item';
    topicButtonLi.innerHTML = `
        <a id="topic-link" href="#"
           class="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-blue-500 hover:text-blue-800 font-medium text-lg">
            <span class="hidden sm:inline">${formattedTopic}</span>
            <span class="sm:inline md:hidden">${getTopicShortName(topicName)}</span>
        </a>
    `;
    navList.insertBefore(topicButtonLi, nextButton);
}

function getTopicShortName(topicName) {
    const shortNames = {
        'linear-algebra': 'LA', 'real-analysis': 'RA', 'complex-analysis': 'CA',
        'abstract-algebra': 'AA', 'topology': 'Top', 'differential-equations': 'DE',
        'miscellaneous': 'Misc'
    };
    return shortNames[topicName] || topicName;
}

function setupTopicProblemsModal(topicName, problems, currentDate) {
    let modal = document.getElementById('topic-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'topic-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900" id="modal-topic-title">Problems</h3>
                        <p class="text-sm text-gray-600 mt-1" id="modal-solved-count"></p>
                    </div>
                    <button id="close-topic-modal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <div id="topic-modal-content" class="p-6"></div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-topic-modal').addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    }
    
    document.getElementById('modal-topic-title').textContent = `All ${formatTopicName(topicName)} Problems`;
    document.getElementById('modal-solved-count').innerHTML = `
        <span>${getSolvedCountForTopic(problems)} of ${problems.length} solved in this topic</span>
        <span class="ml-2 text-blue-600">•</span>
        <span class="ml-2 font-semibold">${getTotalSolvedCount()} total solved</span>
    `;
    
    const content = document.getElementById('topic-modal-content');
    const recentProblems = [...problems].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    
    content.innerHTML = recentProblems.map(problem => {
        const [year, month, day] = problem.date.split('-');
        const isCurrent = problem.date === currentDate;
        const isSolved = isProblemSolved(problem.date);
        return `
            <a href="${buildDateURL(problem.date)}" 
               class="block p-4 mb-2 rounded-lg border transition-all ${isCurrent ? 'bg-blue-50 border-blue-500 font-semibold' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'}">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <span class="text-gray-900">${day}-${month}-${year}</span>
                        ${problem.difficulty ? getDifficultyBadge(problem.difficulty) : ''}
                        ${isSolved ? '<span class="text-green-600 font-semibold text-sm">✓ Solved</span>' : ''}
                    </div>
                    ${isCurrent ? '<span class="text-blue-600 text-sm">● Current</span>' : ''}
                </div>
            </a>
        `;
    }).join('');
    
    if (problems.length > 4) {
        content.innerHTML += `
            <div class="text-center p-4 text-gray-500 border-t border-gray-200 mt-4">
                <p class="text-sm">Showing 4 most recent problems of ${problems.length} total</p>
                <p class="text-xs mt-1">For older problems, visit the calendar by clicking <a class="text-blue-500 hover:text-blue-800" href="/miscellaneous/daily-problems/#calendar">All</a></p>
            </div>
        `;
    }
    
    setTimeout(() => {
        const topicButton = document.getElementById('topic-link');
        if (topicButton) {
            topicButton.onclick = (e) => { e.preventDefault(); modal.classList.remove('hidden'); };
        }
    }, 100);
}

function displayError(message) {
    const problemBox = document.querySelector('.border-red-500');
    if (!problemBox) return;
    const problemStrong = problemBox.querySelector('strong');
    if (!problemStrong) return;
    const parent = problemStrong.parentNode;
    let nextSibling = problemStrong.nextSibling;
    while (nextSibling) {
        const toRemove = nextSibling;
        nextSibling = nextSibling.nextSibling;
        toRemove.remove();
    }
    const errorMsg = document.createElement('span');
    errorMsg.className = 'text-red-600';
    errorMsg.textContent = ` ${message}`;
    parent.appendChild(errorMsg);
}

function styleShareButton() {
    const shareButton = document.getElementById('shareButton');
    if (!shareButton) return;
    shareButton.className = 'flex items-center border border-indigo-300 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-500 font-medium mt-4 py-1.5 px-4 rounded-full text-sm transition-all duration-200';
}

function displaySimilarProblems(currentProblem, allProblems, currentDate, topicName) {
    const existing = document.getElementById('similar-problems');
    if (existing) existing.remove();

    const currentTags = currentProblem.tags || [];
    if (currentTags.length === 0) return;

    const similar = allProblems
        .filter(p => p.date !== currentDate && isProblemVisible(p.date) && (p.tags || []).some(tag => currentTags.includes(tag)))
        .map(p => ({ ...p, matchCount: (p.tags || []).filter(tag => currentTags.includes(tag)).length }))
        .sort((a, b) => b.matchCount - a.matchCount)
        .reduce((acc, curr) => {
            const last = acc[acc.length - 1];
            if (last && last[0].matchCount === curr.matchCount) last.push(curr);
            else acc.push([curr]);
            return acc;
        }, [])
        .flatMap(group => group.sort(() => Math.random() - 0.5))
        .slice(0, 3);

    if (similar.length === 0) return;

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    const section = document.createElement('div');
    section.id = 'similar-problems';
    section.className = 'mt-10';
    section.innerHTML = `
        <div class="flex items-center gap-3 mb-5">
            <h3 class="text-base font-semibold text-gray-700 uppercase tracking-widest">Similar Problems</h3>
            <div class="flex-1 h-px bg-gray-200"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${similar.map(p => {
                const [y, m, d] = p.date.split('-');
                const formattedDate = new Date(Number(y), Number(m)-1, Number(d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                const isSolved = isProblemSolved(p.date);
                const sharedTags = (p.tags || []).filter(tag => currentTags.includes(tag));
                const difficultyColors = { 'easy': 'bg-green-100 text-green-800', 'medium': 'bg-yellow-100 text-yellow-800', 'hard': 'bg-red-100 text-red-800' };
                const diffClass = difficultyColors[(p.difficulty || 'medium').toLowerCase()] || difficultyColors['medium'];
                const plainText = stripHtml(p.problem);
                const preview = plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
                return `
                    <a href="${buildDateURL(p.date)}"
                       class="flex flex-col justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all duration-200 group" target="_blank">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-medium text-gray-500">${formattedDate}</span>
                            ${isSolved ? '<span class="text-green-600 text-xs font-semibold">✓ Solved</span>' : ''}
                        </div>
                        <p class="text-sm text-gray-700 leading-relaxed flex-1 mb-3">${preview}</p>
                        <div class="flex flex-wrap items-center gap-1 mt-auto">
                            ${p.difficulty ? `<span class="text-sm font-semibold px-2 py-0.5 rounded ${diffClass}">${p.difficulty}</span>` : ''}
                            ${sharedTags.map(tag => `<span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">${tag}</span>`).join('')}
                        </div>
                    </a>
                `;
            }).join('')}
        </div>
    `;

    const shareDiv = document.querySelector('.relative.flex.justify-center');
    if (shareDiv) shareDiv.parentNode.insertBefore(section, shareDiv);
}

// ==================== MINI CALENDAR (original style) ====================

function createMiniCalendar(currentProblemDate, allDates) {
    const existing = document.getElementById('mini-calendar');
    if (existing) existing.remove();

    const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '{}');

    const [cy, cm] = currentProblemDate.split('-').map(Number);
    let viewYear = cy;
    let viewMonth = cm - 1;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const cal = document.createElement('div');
    cal.id = 'mini-calendar';
    cal.style.cssText = `
        position: fixed;
        top: 70px;
        right: 16px;
        width: 240px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        z-index: 9;
        font-family: inherit;
    `;

    const calStyle = document.createElement('style');
    calStyle.textContent = `
        @media (max-width: 1500px) { #mini-calendar { display: none; } }
        #mini-calendar .cal-day.has-problem:hover { background: #eef2ff; border-radius: 50%; }
    `;
    document.head.appendChild(calStyle);

    cal.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span id="cal-month-label" style="font-size:14px;font-weight:600;color:#111827;"></span>
            <div style="display:flex;gap:4px;">
                <button id="cal-prev" style="width:24px;height:24px;border:1px solid #e5e7eb;border-radius:6px;background:white;cursor:pointer;color:#374151;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;">‹</button>
                <button id="cal-next" style="width:24px;height:24px;border:1px solid #e5e7eb;border-radius:6px;background:white;cursor:pointer;color:#374151;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;">›</button>
            </div>
        </div>
        <div id="cal-day-headers" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:6px;"></div>
        <div id="cal-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;"></div>
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid #f3f4f6;display:flex;flex-wrap:wrap;gap:8px;">
            <span style="display:flex;align-items:center;gap:3px;font-size:10px;color:#6b7280;"><span style="width:8px;height:8px;background:#d1fae5;border-radius:50%;display:inline-block;"></span> Today</span>
            <span style="display:flex;align-items:center;gap:3px;font-size:10px;color:#6b7280;"><span style="width:8px;height:8px;background:#eef2ff;border-radius:50%;display:inline-block;"></span> Current</span>
            <span style="display:flex;align-items:center;gap:3px;font-size:10px;color:#6b7280;"><span style="width:4px;height:4px;background:#10b981;border-radius:50%;display:inline-block;"></span> Solved</span>
            <span style="display:flex;align-items:center;gap:3px;font-size:10px;color:#6b7280;"><span style="font-size:10px;color:#3b82f6;font-weight:600;">1</span> Available</span>
        </div>
    `;
    document.body.appendChild(cal);

    const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    const headersEl = document.getElementById('cal-day-headers');
    dayNames.forEach(d => {
        const el = document.createElement('div');
        el.style.cssText = 'text-align:center;font-size:11px;font-weight:600;color:#6b7280;padding:2px 0;';
        el.textContent = d;
        headersEl.appendChild(el);
    });

    document.getElementById('cal-prev').onclick = () => {
        if (viewYear === 2026 && viewMonth === 0) return;
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        renderDays();
    };
    document.getElementById('cal-next').onclick = () => {
        if (viewYear === today.getFullYear() && viewMonth === today.getMonth()) return;
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        renderDays();
    };

    function renderDays() {
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        document.getElementById('cal-month-label').textContent = `${monthNames[viewMonth]} ${viewYear}`;

        const isMinMonth = viewYear === 2026 && viewMonth === 0;
        const isMaxMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
        document.getElementById('cal-prev').style.color = isMinMonth ? '#d1d5db' : '#374151';
        document.getElementById('cal-prev').style.cursor = isMinMonth ? 'not-allowed' : 'pointer';
        document.getElementById('cal-next').style.color = isMaxMonth ? '#d1d5db' : '#374151';
        document.getElementById('cal-next').style.cursor = isMaxMonth ? 'not-allowed' : 'pointer';

        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const daysEl = document.getElementById('cal-days');
        daysEl.innerHTML = '';

        for (let i = 0; i < firstDay; i++) daysEl.appendChild(document.createElement('div'));

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const hasProblem = !!allDates[dateStr];
            const isToday   = dateStr === todayStr;
            const isCurrent = dateStr === currentProblemDate;
            const isSolved  = solvedProblems[dateStr] === true;
            const isFuture  = dateStr > todayStr;

            const cell = document.createElement('div');
            cell.style.cssText = 'text-align:center;padding:3px 0;border-radius:50%;';
            if (isToday)        cell.style.background = '#d1fae5';
            else if (isCurrent) cell.style.background = '#eef2ff';

            const numEl = document.createElement('span');
            numEl.style.cssText = `font-size:12px;font-weight:${(isToday || isCurrent) ? '600' : 'normal'};color:${
                isToday ? '#065f46' : isCurrent ? '#4338ca' : (hasProblem && !isFuture) ? '#3b82f6' : '#9ca3af'
            };display:block;`;
            numEl.textContent = d;
            cell.appendChild(numEl);

            const dot = document.createElement('span');
            dot.style.cssText = `display:block;width:4px;height:4px;border-radius:50%;margin:1px auto 0;background:${isSolved && !isToday ? '#10b981' : 'transparent'};`;
            cell.appendChild(dot);

            if (hasProblem && !isFuture) {
                cell.style.cursor = 'pointer';
                cell.classList.add('cal-day', 'has-problem');
                cell.onclick = () => { window.location.href = buildDateURL(dateStr); };
            } else {
                cell.classList.add('cal-day');
            }
            daysEl.appendChild(cell);
        }
    }

    renderDays();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProblem);