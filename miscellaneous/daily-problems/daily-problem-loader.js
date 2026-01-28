// daily-problem-loader.js
// Place this file in: /miscellaneous/daily-problems/daily-problem-loader.js
// Include in main daily-problems page AFTER MathJax configuration

// Map day of week to topic/JSON file (same as problem-loader.js)
const topicMap = {
    0: 'linear-algebra',          // Sunday
    1: 'real-analysis',           // Monday
    2: 'complex-analysis',        // Tuesday
    3: 'abstract-algebra',        // Wednesday
    4: 'topology',                // Thursday
    5: 'differential-equations',  // Friday
    6: 'miscellaneous'            // Saturday
};

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date from YYYY-MM-DD to DD-MM-YYYY
function formatDateForDisplay(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

// Determine which JSON file to load based on date
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

// Get difficulty badge HTML (same as problem-loader.js)
function getDifficultyBadge(difficulty) {
    const difficultyLower = (difficulty || 'medium').toLowerCase();
    const colorMap = {
        'easy': 'bg-green-100 text-green-800 border-green-300',
        'medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'hard': 'bg-red-100 text-red-800 border-red-300'
    };
    
    const color = colorMap[difficultyLower] || colorMap['medium'];
    const displayText = difficulty || 'Medium';
    
    return `<span class="inline-block ${color} text-sm font-semibold rounded px-3 py-1 border">${displayText}</span>`;
}

// Find the most recent problem across all topics
async function findMostRecentProblem() {
    const allTopics = Object.values(topicMap);
    let mostRecentProblem = null;
    let mostRecentDate = null;
    
    for (const topic of allTopics) {
        try {
            const response = await fetch(`data/${topic}.json`);
            if (!response.ok) continue;
            
            const data = await response.json();
            
            // Find the most recent problem in this topic
            if (data.problems && data.problems.length > 0) {
                const sortedProblems = [...data.problems].sort((a, b) => 
                    b.date.localeCompare(a.date)
                );
                
                const latestInTopic = sortedProblems[0];
                
                if (!mostRecentDate || latestInTopic.date > mostRecentDate) {
                    mostRecentDate = latestInTopic.date;
                    mostRecentProblem = latestInTopic;
                }
            }
        } catch (error) {
            console.error(`Error loading ${topic}:`, error);
        }
    }
    
    return mostRecentProblem;
}

// Load today's problem and display it
async function loadTodayProblem() {
    try {
        const todayDate = getTodayDate();
        const topic = getTopicFromDate(todayDate);
        const jsonPath = `data/${topic}.json`;
        
        console.log(`Loading today's problem: ${todayDate} (${topic})`);
        
        // Fetch the JSON data
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${topic} data (${response.status})`);
        }
        
        const data = await response.json();
        
        // Find the problem matching today's date
        const problem = data.problems.find(p => p.date === todayDate);
        
        if (!problem) {
            console.log('No problem for today, loading most recent problem...');
            const mostRecentProblem = await findMostRecentProblem();
            
            if (mostRecentProblem) {
                displayTodayProblem(mostRecentProblem, mostRecentProblem.date, true);
            } else {
                displayNoProblems(todayDate);
            }
            return;
        }
        
        // Display the problem
        displayTodayProblem(problem, todayDate, false);
        
    } catch (error) {
        console.error('Error loading today\'s problem:', error);
        displayError('Failed to load today\'s problem. Please check console for details.');
    }
}

// Display today's problem on the main page
function displayTodayProblem(problem, problemDate, isOldProblem = false) {
    // Update the title link
    const titleElement = document.querySelector('#problem-of-the-day a');
    if (titleElement) {
        const formattedDate = formatDateForDisplay(problemDate);
        if (isOldProblem) {
            titleElement.textContent = `Latest problem (${formattedDate})`;
        } else {
            titleElement.textContent = `Problem of the day (${formattedDate})`;
        }
        titleElement.href = `${problemDate}/`;
    }
    
    // Get the problem box
    const problemBox = document.querySelector('.border-red-500');
    if (!problemBox) {
        console.error('Problem box not found');
        return;
    }
    
    // Update problem content
    const problemStrong = problemBox.querySelector('strong');
    if (problemStrong) {
        // Clear existing content after "Problem: "
        const parent = problemStrong.parentNode;
        const nextSiblings = [];
        let nextSibling = problemStrong.nextSibling;
        
        while (nextSibling) {
            nextSiblings.push(nextSibling);
            nextSibling = nextSibling.nextSibling;
        }
        
        // Remove all siblings
        nextSiblings.forEach(sibling => sibling.remove());
        
        // IMPORTANT: Create a container span to hold the HTML content inline
        const problemContainer = document.createElement('span');
        problemContainer.innerHTML = problem.problem; // Use innerHTML to render HTML tags
        
        // Append the container after the "Problem: " text (inline)
        parent.appendChild(problemContainer);
        
        // Create tags container on a new line
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'mt-2';
        problemBox.appendChild(tagsContainer);
        
        // Add difficulty badge FIRST if it exists
        if (problem.difficulty) {
            const difficultySpan = document.createElement('span');
            difficultySpan.innerHTML = getDifficultyBadge(problem.difficulty);
            difficultySpan.className = 'inline-block mr-2';
            tagsContainer.appendChild(difficultySpan);
        }
        
        // Then add regular tags
        if (problem.tags && Array.isArray(problem.tags)) {
            problem.tags.forEach(tag => {
                // Extract base tag name for URL (remove content in parentheses and trim)
                let tagUrl = tag;
                if (tag.includes('(')) {
                    tagUrl = tag.split('(')[0].trim();
                }
                
                const tagLink = document.createElement('a');
                tagLink.href = `/miscellaneous/daily-problems/tags/?tag=${encodeURIComponent(tagUrl)}`;
                tagLink.target = '_blank';
                tagLink.className = 'inline-block bg-gray-200 text-blue-500 text-sm rounded px-2 py-1 my-1 hover:bg-blue-100 mr-2';
                tagLink.textContent = tag;
                tagsContainer.appendChild(tagLink);
            });
        }
    }
    
    // Trigger MathJax to render the new content
    if (window.MathJax && MathJax.typesetPromise) {
        setTimeout(() => {
            MathJax.typesetPromise([problemBox]).catch(err => 
                console.log('MathJax render error:', err)
            );
        }, 100);
    }
}

// Display message when no problem exists at all
function displayNoProblems(todayDate) {
    const titleElement = document.querySelector('#problem-of-the-day a');
    if (titleElement) {
        const formattedDate = formatDateForDisplay(todayDate);
        titleElement.textContent = `Problem of the day (${formattedDate})`;
        titleElement.href = '#';
        titleElement.style.pointerEvents = 'none';
        titleElement.style.color = '#6b7280'; // gray color
    }
    
    const problemBox = document.querySelector('.border-red-500');
    if (problemBox) {
        const problemStrong = problemBox.querySelector('strong');
        
        if (problemStrong) {
            // Clear existing content
            const parent = problemStrong.parentNode;
            const nextSiblings = [];
            let nextSibling = problemStrong.nextSibling;
            
            while (nextSibling) {
                nextSiblings.push(nextSibling);
                nextSibling = nextSibling.nextSibling;
            }
            
            nextSiblings.forEach(sibling => sibling.remove());
            
            // Add message
            const message = document.createElement('span');
            message.className = 'text-gray-600';
            message.textContent = ' No problems available yet. Check back soon!';
            parent.appendChild(message);
        }
    }
}

// Display error message
function displayError(message) {
    const problemBox = document.querySelector('.border-red-500');
    if (problemBox) {
        const problemStrong = problemBox.querySelector('strong');
        
        if (problemStrong) {
            // Clear existing content
            const parent = problemStrong.parentNode;
            const nextSiblings = [];
            let nextSibling = problemStrong.nextSibling;
            
            while (nextSibling) {
                nextSiblings.push(nextSibling);
                nextSibling = nextSibling.nextSibling;
            }
            
            nextSiblings.forEach(sibling => sibling.remove());
            
            // Add error message
            const errorMsg = document.createElement('span');
            errorMsg.className = 'text-red-600';
            errorMsg.textContent = ` ${message}`;
            parent.appendChild(errorMsg);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadTodayProblem);