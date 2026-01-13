// problem-loader.js
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

// Get problem date from URL path
function getProblemDateFromURL() {
    const path = window.location.pathname;
    // Match date pattern in the path (e.g., /2026-01-07/)
    const match = path.match(/\/(\d{4}-\d{2}-\d{2})\//);
    return match ? match[1] : null;
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

// Load problem data and populate HTML
async function loadProblem() {
    try {
        const problemDate = getProblemDateFromURL();
        
        if (!problemDate) {
            displayError('Unable to determine problem date from URL');
            return;
        }
        
        // Update page title date display in dd-mm-yyyy format
        const [year, month, day] = problemDate.split('-');
        const formattedDate = `${day}-${month}-${year}`;
        document.getElementById('problem-date-title').textContent = formattedDate;
        
        const topic = getTopicFromDate(problemDate);
        const jsonPath = `../data/${topic}.json`;
        
        console.log(`Loading ${topic} data for ${problemDate} from ${jsonPath}`);
        
        // Fetch the JSON data
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${topic} data (${response.status})`);
        }
        
        const data = await response.json();
        
        // Find the problem matching this date
        const problem = data.problems.find(p => p.date === problemDate);
        
        if (!problem) {
            displayError(`No problem found for date ${problemDate} in ${topic}`);
            return;
        }
        
        // Populate the page
        displayProblem(problem, problemDate, data.topic);
        
        // Update metadata with problem info
        updateMetadata(problemDate, problem, data.topic);
        
        // Update navigation links
        updateNavigationLinks(problemDate);
        
    } catch (error) {
        console.error('Error loading problem:', error);
        displayError('Failed to load problem data. Please check console for details.');
    }
}

// Display the problem on the page
function displayProblem(problem, problemDate, topicName) {
    // Update problem text
    const problemBox = document.querySelector('.border-red-500');
    const problemStrong = problemBox.querySelector('strong');
    
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
    
    // IMPORTANT: Create a container div to hold the HTML content
    const problemContainer = document.createElement('div');
    problemContainer.innerHTML = problem.problem; // Use innerHTML instead of textContent
    
    // Append the container after the "Problem: " text
    parent.appendChild(problemContainer);
    
    // Update tags - Create tags container if it doesn't exist
    let tagsContainer = problemBox.querySelector('.mt-2');
    if (!tagsContainer) {
        tagsContainer = document.createElement('div');
        tagsContainer.className = 'mt-2';
        problemBox.appendChild(tagsContainer);
    }
    
    tagsContainer.innerHTML = ''; // Clear existing tags
    
    if (problem.tags && Array.isArray(problem.tags)) {
        problem.tags.forEach(tag => {
            // Special handling for Herstein tag
            let tagUrl = tag;
            if (tag.includes('herstein-abstract-algebra')) {
                tagUrl = 'abstract-algebra-herstein';
            } else if (tag.includes('herstein')) {
                tagUrl = 'herstein';
            }
            
            const tagLink = document.createElement('a');
            tagLink.href = `/miscellaneous/daily-problems/tags/?tag=${encodeURIComponent(tagUrl)}`;
            tagLink.target = '_blank';
            tagLink.className = 'inline-block bg-gray-200 text-blue-500 text-sm rounded px-2 py-1 my-1 hover:bg-blue-100 mr-2';
            tagLink.textContent = tag;
            tagsContainer.appendChild(tagLink);
        });
    }
    
    // Handle hint and solution
    const hasHint = problem.hint && problem.hint.trim() !== '';
    const hasSolution = problem.solution && problem.solution.trim() !== '';
    
    // Handle hint box (create separate div for hint)
    let hintBox = document.getElementById('hint-box');
    if (hasHint) {
        // Check if hint box already exists in the right place (between problem and solution)
        const problemBox = document.querySelector('.border-red-500');
        const solutionBox = document.getElementById('solution-box');
        
        if (!hintBox) {
            hintBox = createHintBox(problem.hint);
            
            // Insert hint box between problem box and solution box
            if (problemBox && solutionBox && solutionBox.parentNode) {
                solutionBox.parentNode.insertBefore(hintBox, solutionBox);
            }
        } else {
            updateHintBox(hintBox, problem.hint);
        }
        hintBox.classList.add('hidden'); // Always hide initially
    } else if (hintBox) {
        hintBox.remove();
    }
    
    // Handle solution box (always hidden initially)
    const solutionBox = document.getElementById('solution-box');
    if (solutionBox) {
        if (hasSolution) {
            updateSolutionBox(solutionBox, problem.solution);
            solutionBox.classList.add('hidden'); // Always hide initially
        } else {
            const solutionContent = solutionBox.querySelector('.leading-relaxed');
            if (solutionContent) {
                solutionContent.innerHTML = `
                    <strong>Solution: </strong>
                    <span class="text-lg text-red-600">I encourage you to attempt to solve the problem today. The solution will be provided tomorrow. This will give you the opportunity to test your understanding of the problem and to improve your skills in solving similar problems in the future.</span>
                `;
            }
        }
    }
    
    // Create buttons inside the problem box
    createToggleButtons(problemBox, hasHint, hasSolution);
    
    // Update problem ID for comments
    const problemIdInput = document.getElementById('problemId');
    if (problemIdInput) {
        problemIdInput.value = problemDate;
    }
    
    // Trigger MathJax to render the content
    if (window.MathJax && MathJax.typesetPromise) {
        setTimeout(() => {
            MathJax.typesetPromise().catch(err => console.log('MathJax initial render error:', err));
        }, 100);
    }
}

// Create toggle buttons for hint and solution
function createToggleButtons(problemBox, hasHint, hasSolution) {
    // Remove existing buttons if any
    const existingButtons = problemBox.querySelectorAll('button[onclick*="toggle"]');
    existingButtons.forEach(btn => btn.remove());
    
    // Also remove any existing button containers (look for containers with buttons)
    const allContainers = problemBox.querySelectorAll('.mt-2');
    allContainers.forEach(container => {
        if (container.querySelector('button')) {
            container.remove();
        }
    });
    
    if (!hasHint && !hasSolution) {
        return;
    }
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-2';
    
    if (hasHint) {
        const hintButton = document.createElement('button');
        hintButton.id = 'hint-button';
        hintButton.onclick = function() { toggleHint(); };
        hintButton.className = 'bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2';
        hintButton.textContent = 'Show Hint';
        buttonContainer.appendChild(hintButton);
    }
    
    if (hasSolution) {
        const solutionButton = document.createElement('button');
        solutionButton.id = 'solution-button';
        solutionButton.onclick = function() { toggleSolution(); };
        solutionButton.className = 'bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600';
        solutionButton.textContent = 'Show Solution';
        buttonContainer.appendChild(solutionButton);
    }
    
    // Append buttons to the problem box (after tags)
    problemBox.appendChild(buttonContainer);
}

// Create hint box (separate div, not inside problem box)
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

// Update existing hint box
function updateHintBox(hintBox, hintText) {
    const content = hintBox.querySelector('.leading-relaxed');
    if (content) {
        content.innerHTML = `<strong>Hint:</strong> ${hintText}`;
    }
}

// Update solution box
function updateSolutionBox(solutionBox, solutionText) {
    // Find the parent container (the one with .leading-relaxed class)
    const content = solutionBox.querySelector('.leading-relaxed');
    if (content) {
        // Clear the entire content div
        content.innerHTML = '';
        
        // Create the "Solution:" label
        const solutionLabel = document.createElement('strong');
        solutionLabel.textContent = 'Solution: ';
        content.appendChild(solutionLabel);
        
        // Create a container for the solution content
        const solutionContainer = document.createElement('div');
        solutionContainer.innerHTML = solutionText;
        
        // Append the solution container after the label
        content.appendChild(solutionContainer);
    }
}

// Toggle hint visibility
function toggleHint() {
    const hintBox = document.getElementById('hint-box');
    const hintButton = document.getElementById('hint-button');
    
    if (hintBox && hintButton) {
        hintBox.classList.toggle('hidden');
        hintButton.textContent = hintBox.classList.contains('hidden') ? 'Show Hint' : 'Hide Hint';
        
        // Re-render MathJax when showing hint
        if (!hintBox.classList.contains('hidden') && window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([hintBox]).catch(err => console.log('MathJax hint render error:', err));
        }
    }
}

// Toggle solution visibility
function toggleSolution() {
    const solutionBox = document.getElementById('solution-box');
    const solutionButton = document.getElementById('solution-button');
    
    if (solutionBox && solutionButton) {
        solutionBox.classList.toggle('hidden');
        solutionButton.textContent = solutionBox.classList.contains('hidden') ? 'Show Solution' : 'Hide Solution';
        
        // Re-render MathJax when showing solution
        if (!solutionBox.classList.contains('hidden') && window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([solutionBox]).catch(err => console.log('MathJax solution render error:', err));
        }
    }
}

// Update metadata
function updateMetadata(problemDate, problem, topicName) {
    const baseURL = window.location.origin + window.location.pathname;
    
    // Generate title with problem title if available
    let title;
    if (problem.title && problem.title.trim() !== '' && problem.title !== 'Problem of the Day') {
        title = `Problem of the Day | ${problemDate} | ${problem.title} | Sachchidanand Prasad`;
    } else {
        title = `Problem of the Day | ${problemDate} | ${topicName} | Sachchidanand Prasad`;
    }
    
    const description = problem.problem.length > 150 
        ? problem.problem.substring(0, 150).replace(/[^\w\s]/gi, '') + '...'
        : problem.problem.replace(/[^\w\s]/gi, '');
    
    // Update page title
    document.title = title;
    
    // Update meta tags
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const linkedinTitle = document.querySelector('meta[name="linkedin:title"]');
    const linkedinDesc = document.querySelector('meta[name="linkedin:description"]');
    
    if (metaDesc) metaDesc.content = description;
    if (ogTitle) ogTitle.content = title;
    if (ogDesc) ogDesc.content = description;
    if (ogUrl) ogUrl.content = baseURL;
    if (twitterTitle) twitterTitle.content = title;
    if (twitterDesc) twitterDesc.content = description;
    if (linkedinTitle) linkedinTitle.content = title;
    if (linkedinDesc) linkedinDesc.content = description;
    
    // Update share link
    if (document.getElementById('shareLink')) {
        document.getElementById('shareLink').value = baseURL;
    }
    
    // Update JSON-LD structured data
    try {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "datePublished": problemDate,
            "author": {
                "@type": "Person",
                "name": "Sachchidanand Prasad"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Sachchidanand Prasad",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://prasadsachchidanand.github.io/assets/img/favicon.png"
                }
            },
            "description": description,
            "image": "https://prasadsachchidanand.github.io/miscellaneous/daily-problems/img/daily-problem.png",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": baseURL
            }
        };
        
        const scriptTag = document.getElementById('structured-data');
        if (scriptTag) {
            scriptTag.textContent = JSON.stringify(structuredData, null, 2);
        }
    } catch (error) {
        console.error('Error updating structured data:', error);
    }
}

// Update navigation links
function updateNavigationLinks(problemDate) {
    try {
        // Parse the date string (YYYY-MM-DD)
        const [year, month, day] = problemDate.split('-').map(Number);
        
        // Create date using UTC to avoid timezone issues
        const currentDate = new Date(Date.UTC(year, month - 1, day));
        
        // Calculate previous and next dates
        const prevDate = new Date(currentDate);
        prevDate.setUTCDate(prevDate.getUTCDate() - 1);
        
        const nextDate = new Date(currentDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        
        // Format dates as YYYY-MM-DD
        const formatDate = (d) => {
            const y = d.getUTCFullYear();
            const m = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };
        
        const prevLink = document.getElementById('prev-link');
        const nextLink = document.getElementById('next-link');
        
        if (prevLink) {
            prevLink.href = `../${formatDate(prevDate)}/`;
        }
        if (nextLink) {
            nextLink.href = `../${formatDate(nextDate)}/`;
        }
        
    } catch (error) {
        console.error('Error updating navigation links:', error);
    }
}

// Display error message
function displayError(message) {
    const problemBox = document.querySelector('.border-red-500');
    if (problemBox) {
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
            
            // Add error message
            const errorMsg = document.createElement('span');
            errorMsg.className = 'text-red-600';
            errorMsg.textContent = ` ${message}`;
            parent.appendChild(errorMsg);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProblem);