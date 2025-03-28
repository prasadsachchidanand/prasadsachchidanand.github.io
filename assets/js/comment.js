// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyAwRQ-Ww7pUkoTaEzPZ09un4XTudBkgoRI",
	authDomain: "comment-system-e4f85.firebaseapp.com",
	projectId: "comment-system-e4f85",
	storageBucket: "comment-system-e4f85.firebasestorage.app",
	messagingSenderId: "177501444225",
	appId: "1:177501444225:web:0cc93010e9952c6f111580",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Get the problem identifier from the hidden input field
const problemId = document.getElementById("problemId").value;

// Reference to the problem-specific comments collection
const commentsCollection = db.collection(`problems/${problemId}/comments`);

// DOM Elements
const commentNameInput = document.getElementById("commentName");
const commentContentInput = document.getElementById("commentContent");
const showPreviewCheckbox = document.getElementById("showPreview");
const previewSection = document.getElementById("previewSection");
const previewContent = document.getElementById("previewContent");
const submitCommentButton = document.getElementById("submitComment");
const commentsList = document.getElementById("commentsList");
const formattingToolbar = document.getElementById("formattingToolbar") || createFormattingToolbar();

// Create formatting toolbar if it doesn't exist
function createFormattingToolbar() {
	const toolbar = document.createElement("div");
	toolbar.id = "formattingToolbar";
	toolbar.className = "flex flex-wrap gap-2 mb-2 border-b pb-2";

	const buttons = [{
			label: "B",
			format: "**",
			title: "Bold"
		},
		{
			label: "I",
			format: "*",
			title: "Italic"
		},
		{
			label: "~~",
			format: "~~",
			title: "Strikethrough"
		},
		{
			label: "H1",
			format: "# ",
			title: "Heading 1",
			block: true
		},
		{
			label: "H2",
			format: "## ",
			title: "Heading 2",
			block: true
		},
		{
			label: "Link",
			format: "[text](url)",
			title: "Link",
			isLink: true
		},
		{
			label: "Code",
			format: "`",
			title: "Inline Code"
		},
		{
			label: "```",
			format: "```\n\n```",
			title: "Code Block",
			block: true,
			multiline: true
		},
		{
			label: "Math",
			format: "$",
			title: "Inline Math"
		},
		{
			label: "List",
			format: "- ",
			title: "Bullet List",
			block: true,
			list: true
		}
	];

	buttons.forEach(btn => {
		const button = document.createElement("button");
		button.type = "button";
		button.textContent = btn.label;
		button.title = btn.title;
		button.className = "px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium";

		button.addEventListener("click", () => {
			applyFormatting(commentContentInput, btn.format, btn.block, btn.isLink, btn.multiline, btn.list);
		});

		toolbar.appendChild(button);
	});

	// Insert toolbar before the comment text area
	commentContentInput.parentNode.insertBefore(toolbar, commentContentInput);
	return toolbar;
}

// Apply formatting to text
// Modify the applyFormatting function to correctly handle heading and list formatting
function applyFormatting(textarea, format, isBlock = false, isLink = false, isMultiline = false, isList = false) {
	// Save current scroll position
	const scrollPos = textarea.scrollTop;

	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);
	const beforeText = textarea.value.substring(0, start);
	const afterText = textarea.value.substring(end);

	let newText;
	let cursorPos;

	if (isLink) {
		const url = prompt("Enter URL:", "https://");
		if (url) {
			newText = `[${selectedText || 'link text'}](${url})`;
			cursorPos = start + newText.length;
		} else {
			return;
		}
	} else if (isBlock && isList) {
		// For lists, add a dash at the beginning of each line
		if (selectedText) {
			// Apply list formatting to each line of the selected text
			const lines = selectedText.split('\n');
			const formattedLines = lines.map(line => `- ${line}`).join('\n');
			newText = formattedLines;
			cursorPos = start + newText.length;
		} else {
			// Check if we need to add a newline first (if not at start of line)
			const needsNewline = beforeText.length > 0 && !beforeText.endsWith('\n');
			newText = needsNewline ? '\n- ' : '- ';
			cursorPos = start + newText.length;
		}
	} else if (isBlock) {
		// Handle block formatting (headings)
		if (selectedText) {
			// If we have selected text and it's a block format, add the format at the beginning
			// Make sure there's a space after the hash
			newText = format + (format.endsWith(' ') ? '' : ' ') + selectedText;
			cursorPos = start + newText.length;
		} else {
			// Check if we need to add a newline first (if not at start of line)
			const needsNewline = beforeText.length > 0 && !beforeText.endsWith('\n');

			if (isMultiline) {
				// For multiline formats like code blocks
				const formattedText = needsNewline ? '\n' + format : format;
				const splitPos = formattedText.indexOf('\n\n');
				if (splitPos !== -1) {
					newText = formattedText;
					cursorPos = start + splitPos + 1 + (needsNewline ? 1 : 0);
				} else {
					newText = formattedText;
					cursorPos = start + formattedText.length;
				}
			} else {
				// Regular block format (like headings)
				newText = needsNewline ? '\n' + format : format;
				cursorPos = start + newText.length;
			}
		}
	} else {
		// For inline elements
		if (selectedText) {
			newText = format + selectedText + format;
			cursorPos = start + newText.length;
		} else {
			newText = format + format;
			cursorPos = start + format.length;
		}
	}

	textarea.value = beforeText + newText + afterText;

	// Set cursor position
	textarea.focus();
	textarea.selectionStart = textarea.selectionEnd = cursorPos;

	// Restore scroll position
	textarea.scrollTop = scrollPos;

	// Update preview if it's active
	if (showPreviewCheckbox && showPreviewCheckbox.checked) {
		previewContent.innerHTML = renderContent(textarea.value);
		processMathJax();
	}
}

//   like dislike function

function renderLikeDislikeButtons(comment) {
	// Get the like/dislike counts (default to 0 if not present)
	const likes = comment.likes || 0;
	const dislikes = comment.dislikes || 0;

	// Check if the current user has liked or disliked
	// We'll use local storage to track this
	const commentInteractions = JSON.parse(localStorage.getItem('commentInteractions') || '{}');
	const userInteraction = commentInteractions[comment.id] || 'none'; // 'liked', 'disliked', or 'none'

	return `
      <div class="flex items-center space-x-4 mt-3">
        <button class="like-btn flex items-center space-x-1 text-sm ${userInteraction === 'liked' ? 'text-blue-600 font-medium' : 'text-gray-500'}" 
                data-id="${comment.id}" data-action="like">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span class="like-count">${likes}</span>
        </button>
        
        <button class="dislike-btn flex items-center space-x-1 text-sm ${userInteraction === 'disliked' ? 'text-red-600 font-medium' : 'text-gray-500'}" 
                data-id="${comment.id}" data-action="dislike">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
          <span class="dislike-count">${dislikes}</span>
        </button>
      </div>
    `;
}

// old function
/* function renderContent(text) {
	// Configure marked options
	marked.setOptions({
		breaks: true, // Convert line breaks to <br>
		gfm: true, // Enable GitHub Flavored Markdown
		headerIds: true, // Create header IDs for linking
		mangle: false, // Don't mangle header IDs
		smartLists: true, // Better list detection
		renderer: createCustomRenderer(), // Custom renderer for links
		highlight: function(code, language) {
			// Use highlight.js for syntax highlighting
			if (language && hljs.getLanguage(language)) {
				try {
					return hljs.highlight(code, {
						language
					}).value;
				} catch (err) {
					console.error('Error highlighting code:', err);
				}
			}
			return hljs.highlightAuto(code).value;
		}
	});

	// Process the markdown
	const renderedContent = marked.parse(text);

	return renderedContent;
}*/

// Enhance the renderContent function to ensure proper Markdown parsing
function renderContent(text) {
    // Configure marked options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        smartLists: true,
        renderer: createCustomRenderer(),
        highlight: function(code, language) {
            if (language && hljs.getLanguage(language)) {
                try {
                    return hljs.highlight(code, { language }).value;
                } catch (err) {
                    console.error('Error highlighting code:', err);
                }
            }
            return hljs.highlightAuto(code).value;
        }
    });

    // Convert single backslashes to double in matrix environments
    const processedText = text.replace(
        /\\begin{(pmatrix|bmatrix|matrix|array)}([\s\S]*?)\\end{\1}/g,
        function(match, env, content) {
            // Replace single backslashes with double backslashes in matrix content
            const fixedContent = content.replace(/([^\\])\\([^\\])/g, '$1\\\\$2');
            return `\\begin{${env}}${fixedContent}\\end{${env}}`;
        }
    );

    // Protect all LaTeX blocks from marked processing
    const protectedText = processedText.replace(
        /(\$\$[\s\S]*?\$\$|\\begin\{.*?\}[\s\S]*?\\end\{.*?\}|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g,
        function(match) {
            return `\x1BLATEX\x1B${btoa(unescape(encodeURIComponent(match)))}\x1BLATEX\x1B`;
        }
    );

    // Process with marked
    let renderedContent = marked.parse(protectedText);

    // Restore LaTeX blocks
    renderedContent = renderedContent.replace(
        /\x1BLATEX\x1B([^\x1B]+)\x1BLATEX\x1B/g,
        function(match, p1) {
            return decodeURIComponent(escape(atob(p1)));
        }
    );

    return renderedContent;
}

// Create a custom renderer for links
function createCustomRenderer() {
	const renderer = new marked.Renderer();

	// Override the link renderer
	renderer.link = function(href, title, text) {
		const titleAttr = title ? ` title="${title}"` : '';
		return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-800 text-decoration-line: none;">${text}</a>`;
	};

	return renderer;
}
// Function to apply highlight.js to code blocks
function applyCodeHighlighting() {
	// Apply highlighting to all code blocks
	document.querySelectorAll('pre code').forEach((block) => {
		// Add a class to pre elements for styling
		if (block.parentNode.tagName === 'PRE') {
			block.parentNode.classList.add('code-block');
		}

		try {
			hljs.highlightElement(block);
		} catch (err) {
			console.error('Error highlighting code block:', err);
		}
	});
}

// Add these styles to properly render headings and lists
function addCustomStyles() {
	const style = document.createElement('style');
	style.textContent = `
      .prose h1 {
        font-size: 1.8em;
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 0.5em;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.3em;
      }
      
      .prose h2 {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 0.5em;
      }
      
      .prose ul {
        list-style-type: disc;
        padding-left: 2em;
        margin: 0.8em 0;
      }
      
      .prose li {
        margin-bottom: 0.3em;
      }
      
      /* Make sure preview section shows formatting properly */
      #previewContent h1, #previewContent h2, #previewContent ul {
        display: block;
      }
      
      #previewContent ul {
        list-style-type: disc;
        padding-left: 2em;
      }
      
      #previewContent a {
        color: #3b82f6;
        transition: color 0.2s;
    }
    
    #previewContent a:hover {
      color: #1e40af;
    }
      /* Code block styling */
      .prose pre {
        background-color: #f6f8fa;
        border-radius: 6px;
        padding: 16px;
        overflow: auto;
        margin: 1em 0;
        border: 1px solid #ddd;
      }
      
      .prose code {
        background-color: rgba(175, 184, 193, 0.2);
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
        font-size: 0.9em;
      }
      
      .prose pre code {
        background-color: transparent;
        padding: 0;
        display: block;
        overflow-x: auto;
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
        font-size: 0.9em;
        line-height: 1.5;
      }

      .prose a {
        color: #3b82f6; /* text-blue-500 */
        transition: color 0.2s;
      }
        
      .prose a:hover {
        color: #1e40af; /* text-blue-800 */
      }
      
      .code-block {
        position: relative;
      }
    `;
	document.head.appendChild(style);
}

function enhanceFormattingToolbar() {
	const toolbar = document.getElementById("formattingToolbar");
	if (!toolbar) return;

	// Add language selection for code blocks
	const codeBlockBtn = Array.from(toolbar.children).find(btn => btn.textContent === '```');
	if (codeBlockBtn) {
		codeBlockBtn.addEventListener('click', (e) => {
			// Prevent the default code block insertion
			e.preventDefault();
			e.stopPropagation();

			// Ask for the language
			const language = prompt("Enter language for syntax highlighting (js, python, java, etc.):", "");
			if (language !== null) { // User didn't cancel
				const textarea = commentContentInput;
				const start = textarea.selectionStart;
				const end = textarea.selectionEnd;
				const selectedText = textarea.value.substring(start, end);
				const beforeText = textarea.value.substring(0, start);
				const afterText = textarea.value.substring(end);

				// Only add the language if it's not empty
				const langPart = language.trim() ? language : '';
				const formattedCode = `\`\`\`${langPart}\n${selectedText}\n\`\`\``;

				textarea.value = beforeText + formattedCode + afterText;

				// Set cursor position inside the code block
				const cursorPos = start + langPart.length + 4;
				textarea.selectionStart = textarea.selectionEnd = cursorPos;
				textarea.focus();

				// Update preview if active
				if (showPreviewCheckbox && showPreviewCheckbox.checked) {
					previewContent.innerHTML = renderContent(textarea.value);
					processMathJax();
				}
			}
		});
	}
}

// Call this function on page load
document.addEventListener("DOMContentLoaded", function() {
	configureMarked();
	loadComments();
	addCustomStyles();
	enhanceFormattingToolbar();

	// Ensure marked library is configured correctly
	if (typeof marked !== "undefined") {
		marked.setOptions({
			breaks: true,
			gfm: true,
			headerIds: true,
			mangle: false,
			smartLists: true,
			// renderer: createCustomRenderer(),
			highlight: function(code, language) {
				if (language && hljs.getLanguage(language)) {
					try {
						return hljs.highlight(code, {
							language
						}).value;
					} catch (err) {}
				}
				return hljs.highlightAuto(code).value;
			}
		});
	}

	// Ensure highlight.js is ready
	if (typeof hljs !== "undefined") {
		//   console.log("highlight.js is loaded");
	} else {
		console.warn("highlight.js is not loaded");
	}
});

// Add user mention functionality

// Store users who have commented
let activeUsers = [];

// Function to update the active users list
function updateActiveUsersList() {
	// Get unique users from the comments
	commentsCollection.get().then((snapshot) => {
		const userSet = new Set();
		snapshot.forEach((doc) => {
			const comment = doc.data();
			if (comment.name) {
				userSet.add(comment.name);
			}
		});

		activeUsers = Array.from(userSet);
		// console.log("Active users updated:", activeUsers);
	});
}

// Add a mention button to the toolbar
function addMentionButton() {
	const toolbar = document.getElementById("formattingToolbar");
	if (!toolbar) return;

	const mentionButton = document.createElement("button");
	mentionButton.type = "button";
	mentionButton.textContent = "@";
	mentionButton.title = "Mention User";
	mentionButton.className = "px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium";

	mentionButton.addEventListener("click", () => {
		showMentionSelector();
	});

	toolbar.appendChild(mentionButton);
}

// Create a mention selector popover
function showMentionSelector() {
	console.log("Showing mention selector");
	// Remove any existing popover
	const existingPopover = document.getElementById("mentionPopover");
	if (existingPopover) {
		existingPopover.remove();
	}

	// Create the popover
	const popover = document.createElement("div");
	popover.id = "mentionPopover";
	popover.className = "absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg p-2 max-h-48 overflow-y-auto";

	// Position the popover near the textarea
	const textareaRect = commentContentInput.getBoundingClientRect();
	popover.style.top = `${textareaRect.top + window.scrollY + 40}px`;
	popover.style.left = `${textareaRect.left + window.scrollX}px`;

	// Add a search input
	const searchInput = document.createElement("input");
	searchInput.type = "text";
	searchInput.placeholder = "Search users...";
	searchInput.className = "w-full border border-gray-300 rounded px-2 py-1 mb-2 text-sm";
	popover.appendChild(searchInput);

	// Add the users list
	const usersList = document.createElement("div");
	usersList.className = "users-list";
	popover.appendChild(usersList);

	// Function to render users
	function renderUsers(query = "") {
		usersList.innerHTML = "";

		if (activeUsers.length === 0) {
			usersList.innerHTML = '<div class="text-gray-500 p-2 text-sm">No users found</div>';
			return;
		}

		const filteredUsers = query ?
			activeUsers.filter(user => user.toLowerCase().includes(query.toLowerCase())) :
			activeUsers;

		if (filteredUsers.length === 0) {
			usersList.innerHTML = '<div class="text-gray-500 p-2 text-sm">No matching users</div>';
			return;
		}

		filteredUsers.forEach(user => {
			const userItem = document.createElement("div");
			userItem.className = "user-item p-2 hover:bg-gray-100 cursor-pointer text-sm";
			userItem.textContent = user;

			userItem.addEventListener("click", () => {
				insertMention(user);
				popover.remove();
			});

			usersList.appendChild(userItem);
		});
	}

	// Listen for input in the search box
	searchInput.addEventListener("input", () => {
		renderUsers(searchInput.value);
	});

	// Initial render
	renderUsers();

	// Add the popover to the document
	document.body.appendChild(popover);

	// Focus the search input
	searchInput.focus();

	// Close the popover when clicking outside
	document.addEventListener("click", function closePopover(e) {
		if (!popover.contains(e.target) && e.target !== mentionButton) {
			popover.remove();
			document.removeEventListener("click", closePopover);
		}
	});
}

function addMentionButton() {
	const toolbar = document.getElementById("formattingToolbar");
	if (!toolbar) return;

	const mentionButton = document.createElement("button");
	mentionButton.type = "button";
	mentionButton.textContent = "@";
	mentionButton.title = "Mention User";
	mentionButton.className = "px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium";
	mentionButton.id = "mentionButton";

	mentionButton.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		showMentionSelector();
	});

	toolbar.appendChild(mentionButton);
}
// Insert a user mention into the textarea
function insertMention(username) {
	const textarea = commentContentInput;
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const beforeText = textarea.value.substring(0, start);
	const afterText = textarea.value.substring(end);

	// Insert the mention
	const mention = `@${username} `;
	textarea.value = beforeText + mention + afterText;

	// Set cursor position after the mention
	const cursorPos = start + mention.length;
	textarea.selectionStart = textarea.selectionEnd = cursorPos;
	textarea.focus();

	// Update preview if active
	if (showPreviewCheckbox && showPreviewCheckbox.checked) {
		previewContent.innerHTML = renderContent(textarea.value);
		processMathJax();
	}
}

// Configure marked to safely handle HTML and properly integrate with highlight.js
function configureMarked() {
	if (typeof marked !== "undefined") {
		marked.setOptions({
			breaks: true, // Convert line breaks to <br>
			gfm: true, // Enable GitHub Flavored Markdown
			headerIds: true, // Create header IDs for linking
			mangle: false, // Don't mangle header IDs
			smartLists: true, // Better list detection
			sanitize: false, // Don't sanitize HTML (we'll handle it differently)
			highlight: function(code, lang) {
				if (!lang) {
					return code; // No language specified
				}

				// Sanitize the language attribute
				const sanitizedLang = lang.replace(/[^\w-]/g, '');

				if (hljs.getLanguage(sanitizedLang)) {
					try {
						return hljs.highlight(code, {
							language: sanitizedLang
						}).value;
					} catch (err) {
						console.error('Highlight.js error:', err);
						return code;
					}
				}

				// If language isn't supported, just return the code
				return code;
			}
		});
	}
}

// Add styles for mentions
function addMentionStyles() {
	const style = document.createElement('style');
	style.textContent = `
    .user-mention {
      background-color: rgba(88, 166, 255, 0.1);
      color: #0969da;
      border-radius: 2px;
      padding: 0 2px;
      font-weight: 500;
    }
    
    /* Mention popover styles */
    #mentionPopover {
      width: 220px;
    }
    
    .user-item {
      border-radius: 4px;
    }
    
    .user-item:hover {
      background-color: #f0f4f8;
    }
  `;
	document.head.appendChild(style);
}

// Listen for @ key press to trigger mention
commentContentInput.addEventListener("keydown", function(e) {
	if (e.key === '@') {
		// Get the cursor position
		const start = this.selectionStart;
		const text = this.value.substring(0, start);

		// Check if the @ is at the start of a word (preceded by a space or at the beginning)
		if (start === 0 || text[start - 1] === ' ' || text[start - 1] === '\n') {
			// Let the @ be typed, then show the mention selector
			setTimeout(() => {
				showMentionSelector();
			}, 10);
		}
	}
});

// Initialize the user mention functionality when the page loads
document.addEventListener("DOMContentLoaded", function() {
	// Call the original init functions
	configureMarked();
	loadComments();
	addCustomStyles();
	enhanceFormattingToolbar();
	updateActiveUsersList();
	addMentionButton();
	addMentionStyles();
	addLikeDislikeStyles();

	// Add our new functionality
	repositionCommentForm();

	// Ensure that like/dislike events are set up after comments load
	const originalLoadComments = window.loadComments;
	window.loadComments = function() {
		originalLoadComments();
		setupLikeDislikeHandlers();
	};
});

function addLikeDislikeStyles() {
	const style = document.createElement('style');
	style.textContent = `
      .like-btn, .dislike-btn {
        transition: all 0.2s ease;
        padding: 2px 6px;
        border-radius: 4px;
      }
      
      .like-btn:hover, .dislike-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .like-btn.active {
        color: #3b82f6;
      }
      
      .dislike-btn.active {
        color: #ef4444;
      }
    `;
	document.head.appendChild(style);
}

// Update active users list when comments are loaded
const originalLoadComments = loadComments;
window.loadComments = function() {
	originalLoadComments();
	updateActiveUsersList();
};

// Generate unique ID for comments
function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date
function formatDate(timestamp) {
	const date = new Date(timestamp);
	const options = {
		day: "numeric",
		month: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	return date.toLocaleString("en-GB", options).replace(",", " at");
}

// Render markdown and LaTeX
function renderContent(text) {
	return marked.parse(text);
}

// Process MathJax
function processMathJax() {
	// Apply code highlighting first
	applyCodeHighlighting();

	// Then process MathJax
	if (typeof MathJax !== "undefined" && MathJax.typesetPromise) {
		MathJax.typesetPromise()
			.then(() => {
				//   console.log("MathJax typesetting complete");
			})
			.catch((err) => {
				console.error("MathJax typesetting error:", err);
			});
	} else {
		console.log("MathJax not loaded yet");
		setTimeout(processMathJax, 500); // Retry after a delay
	}
}


// Toggle preview
if (showPreviewCheckbox) {
	showPreviewCheckbox.addEventListener("change", function() {
		if (this.checked) {
			previewSection.classList.remove("hidden");
			previewContent.innerHTML = renderContent(commentContentInput.value);
			processMathJax();
		} else {
			previewSection.classList.add("hidden");
		}
	});
}

// Live preview update
commentContentInput.addEventListener("input", function() {
	if (showPreviewCheckbox && showPreviewCheckbox.checked) {
		previewContent.innerHTML = renderContent(this.value);
		processMathJax();
	}
});

// Submit comment (either new comment or reply)
submitCommentButton.addEventListener("click", function() {
	const name = commentNameInput.value.trim();
	const content = commentContentInput.value.trim();
	const replyToId = commentContentInput.getAttribute("data-reply-to") || null;

	if (!name || !content) {
		alert("Please enter your name and comment");
		return;
	}

	const userId = firebase.auth().currentUser?.uid || "anonymous";

	const newComment = {
		id: generateId(),
		name: name,
		content: content,
		timestamp: Date.now(),
		edited: false,
		replyToId: replyToId,
		replies: [], 
		userId: userId, 
	};

	commentsCollection
		.doc(newComment.id)
		.set(newComment)
		.then(() => {
			// If this is a reply, update the parent comment's replies array
			if (replyToId) {
				commentsCollection.doc(replyToId).update({
					replies: firebase.firestore.FieldValue.arrayUnion(newComment.id)
				});

				// Reset the reply state
				resetReplyForm();
			} else {
				commentNameInput.value = "";
				commentContentInput.value = "";
				if (previewContent) previewContent.innerHTML = "";
				if (showPreviewCheckbox) {
					showPreviewCheckbox.checked = false;
					previewSection.classList.add("hidden");
				}
			}

			loadComments();
		})
		.catch((error) => {
			console.error("Error adding comment:", error);
			alert("Failed to add comment. Please try again.");
		});
});

// Reset reply form to normal comment state
function resetReplyForm() {
	const replyingToInfo = document.getElementById("replyingToInfo");
	if (replyingToInfo) {
		replyingToInfo.remove();
	}

	commentContentInput.value = "";
	commentContentInput.removeAttribute("data-reply-to");
	submitCommentButton.textContent = "Submit Comment";
	if (previewContent) previewContent.innerHTML = "";
	if (showPreviewCheckbox) {
		showPreviewCheckbox.checked = false;
		previewSection.classList.add("hidden");
	}
}

// Handle starting a reply
function startReply(commentId, authorName) {
	// Scroll to comment form
	const commentForm = document.querySelector(".comment-form");
	if (commentForm) {
		commentForm.scrollIntoView({
			behavior: "smooth"
		});
	}

	// Show reply indicator
	let replyingToInfo = document.getElementById("replyingToInfo");
	if (!replyingToInfo) {
		replyingToInfo = document.createElement("div");
		replyingToInfo.id = "replyingToInfo";
		replyingToInfo.className = "flex items-center justify-between text-sm text-blue-600 bg-blue-50 p-2 mb-2 rounded";
		commentContentInput.parentNode.insertBefore(replyingToInfo, commentContentInput);
	}

	replyingToInfo.innerHTML = `
    <span>Replying to <strong>${authorName}</strong></span>
    <button type="button" id="cancelReply" class="text-xs underline">Cancel</button>
  `;

	// Set up cancel button
	document.getElementById("cancelReply").addEventListener("click", resetReplyForm);

	// Set data attribute on the textarea to mark we're replying
	commentContentInput.setAttribute("data-reply-to", commentId);

	// Change submit button text
	submitCommentButton.textContent = "Submit Reply";

	// Focus the textarea
	commentContentInput.focus();
}

// Load comments from Firestore
function loadComments() {
	commentsCollection
		.orderBy("timestamp", "desc")
		.get()
		.then((snapshot) => {
			commentsList.innerHTML = "";

			if (snapshot.empty) {
				commentsList.innerHTML =
					'<p class="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>';
				return;
			}

			// Convert snapshot to array of comments
			const comments = [];
			snapshot.forEach((doc) => {
				comments.push(doc.data());
			});

			// First, render only the top-level comments (those without replyToId)
			const topLevelComments = comments.filter(comment => !comment.replyToId);

			topLevelComments.forEach(comment => {
				renderComment(comment, comments, commentsList);
			});

			processMathJax();
			setupCommentActions();
		})
		.catch((error) => {
			console.error("Error loading comments:", error);
			commentsList.innerHTML =
				'<p class="text-red-500 text-center py-4">Failed to load comments. Please refresh the page.</p>';
		});
}

// Render a single comment and its replies
function renderComment(comment, allComments, container, isReply = false) {
    const commentElement = document.createElement("div");
    commentElement.classList.add(
        "bg-white",
        "p-4",
        "rounded-lg",
        "shadow-sm",
        "border",
        "border-gray-200",
        isReply ? "ml-8" : "mb-4"
    );
    commentElement.id = `comment-${comment.id}`;

    // Get the current user's UID
    const currentUserId = firebase.auth().currentUser?.uid || "anonymous";

    // Only show delete button if the current user is the comment creator
    const deleteButton = comment.userId === currentUserId ?
        `<button class="delete-btn text-xs text-red-600 hover:text-red-800" data-id="${comment.id}">Delete</button>` :
        "";

    const commentHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="flex items-center">
                <!-- Avatar -->
                <img src="https://www.gravatar.com/avatar/${comment.id}?d=identicon&s=40" alt="Avatar" class="w-8 h-8 rounded-full mr-2">
                <div>
                    <h4 class="font-semibold text-gray-900">${comment.name}</h4>
                    <p class="text-xs text-gray-500">
                        ${formatDate(comment.timestamp)}
                        ${comment.edited ? ' (edited)' : ''}
                        ${comment.replyToId ? ' <span class="text-blue-500">(reply)</span>' : ''}
                    </p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button class="reply-btn text-xs text-green-600 hover:text-green-800" data-id="${comment.id}" data-author="${comment.name}">Reply</button>
                <button class="edit-btn text-xs text-blue-600 hover:text-blue-800" data-id="${comment.id}">Edit</button>
                ${deleteButton}
            </div>
        </div>
        <div class="comment-content prose max-w-none">
            ${renderContent(comment.content)}
        </div>
        ${renderLikeDislikeButtons(comment)}
        <div class="edit-form hidden mt-3 space-y-3">
            <div id="edit-toolbar-${comment.id}" class="flex flex-wrap gap-2 mb-2"></div>
            <textarea class="edit-textarea w-full px-3 py-2 border border-gray-300 rounded-md">${comment.content}</textarea>
            <div class="flex justify-end space-x-2">
                <button class="cancel-edit-btn px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm">Cancel</button>
                <button class="save-edit-btn px-3 py-1 bg-blue-600 text-white rounded-md text-sm" data-id="${comment.id}">Save</button>
            </div>
        </div>
    `;

    commentElement.innerHTML = commentHTML;
    container.appendChild(commentElement);

    // Render replies if any
    if (comment.replies && comment.replies.length > 0) {
        const repliesContainer = document.createElement("div");
        repliesContainer.classList.add("replies-container", "mt-2");

        const replies = allComments.filter(c => c.replyToId === comment.id);
        replies.forEach(reply => {
            renderComment(reply, allComments, repliesContainer, true);
        });

        commentElement.appendChild(repliesContainer);
    }
}

function setupLikeDislikeHandlers() {
	// Like button handlers
	document.querySelectorAll(".like-btn").forEach((button) => {
		button.addEventListener("click", function() {
			handleLikeDislike(this.getAttribute("data-id"), 'like');
		});
	});

	// Dislike button handlers
	document.querySelectorAll(".dislike-btn").forEach((button) => {
		button.addEventListener("click", function() {
			handleLikeDislike(this.getAttribute("data-id"), 'dislike');
		});
	});
}

// Handle like or dislike action
function handleLikeDislike(commentId, action) {
	// Get the current user's interactions from local storage
	const commentInteractions = JSON.parse(localStorage.getItem('commentInteractions') || '{}');
	const currentInteraction = commentInteractions[commentId] || 'none';

	// Get a reference to the comment
	const commentRef = commentsCollection.doc(commentId);

	// Get the current comment data
	commentRef.get().then((doc) => {
		if (doc.exists) {
			const comment = doc.data();
			let likes = comment.likes || 0;
			let dislikes = comment.dislikes || 0;

			// Determine the update based on current interaction and new action
			if (currentInteraction === 'none') {
				// No previous interaction
				if (action === 'like') {
					likes += 1;
					commentInteractions[commentId] = 'liked';
				} else {
					dislikes += 1;
					commentInteractions[commentId] = 'disliked';
				}
			} else if (currentInteraction === 'liked') {
				// Previously liked
				if (action === 'like') {
					// Unlike
					likes -= 1;
					commentInteractions[commentId] = 'none';
				} else {
					// Switch to dislike
					likes -= 1;
					dislikes += 1;
					commentInteractions[commentId] = 'disliked';
				}
			} else if (currentInteraction === 'disliked') {
				// Previously disliked
				if (action === 'like') {
					// Switch to like
					dislikes -= 1;
					likes += 1;
					commentInteractions[commentId] = 'liked';
				} else {
					// Remove dislike
					dislikes -= 1;
					commentInteractions[commentId] = 'none';
				}
			}

			// Update localStorage
			localStorage.setItem('commentInteractions', JSON.stringify(commentInteractions));

			// Update the comment in Firestore
			return commentRef.update({
				likes: likes,
				dislikes: dislikes
			}).then(() => {
				// Update the UI without reloading all comments
				updateLikeDislikeUI(commentId, likes, dislikes, commentInteractions[commentId]);
			});
		}
	}).catch((error) => {
		console.error("Error updating likes/dislikes:", error);
		alert("Failed to update. Please try again.");
	});
}

// Update the UI for likes/dislikes without reloading all comments
function updateLikeDislikeUI(commentId, likes, dislikes, userInteraction) {
	const commentElement = document.getElementById(`comment-${commentId}`);
	if (commentElement) {
		const likeBtn = commentElement.querySelector(".like-btn");
		const dislikeBtn = commentElement.querySelector(".dislike-btn");
		const likeCount = commentElement.querySelector(".like-count");
		const dislikeCount = commentElement.querySelector(".dislike-count");

		// Update counts
		likeCount.textContent = likes;
		dislikeCount.textContent = dislikes;

		// Update styling
		likeBtn.className = likeBtn.className.replace(/text-blue-600 font-medium|text-gray-500/g, '');
		dislikeBtn.className = dislikeBtn.className.replace(/text-red-600 font-medium|text-gray-500/g, '');

		if (userInteraction === 'liked') {
			likeBtn.classList.add('text-blue-600', 'font-medium');
			dislikeBtn.classList.add('text-gray-500');
		} else if (userInteraction === 'disliked') {
			dislikeBtn.classList.add('text-red-600', 'font-medium');
			likeBtn.classList.add('text-gray-500');
		} else {
			likeBtn.classList.add('text-gray-500');
			dislikeBtn.classList.add('text-gray-500');
		}
	}
}
// Setup event listeners for comment actions (edit/delete/reply)
function setupCommentActions() {
	// Reply button handlers
	document.querySelectorAll(".reply-btn").forEach((button) => {
		button.addEventListener("click", function() {
			const commentId = this.getAttribute("data-id");
			const authorName = this.getAttribute("data-author");
			startReply(commentId, authorName);
		});
	});

	// Edit button handlers
	document.querySelectorAll(".edit-btn").forEach((button) => {
		button.addEventListener("click", function() {
			const commentId = this.getAttribute("data-id");
			const commentElement = document.getElementById(`comment-${commentId}`);
			commentElement.querySelector(".comment-content").classList.add("hidden");
			const editForm = commentElement.querySelector(".edit-form");
			editForm.classList.remove("hidden");

			// Create a toolbar for the edit form if it doesn't exist
			const editToolbar = document.getElementById(`edit-toolbar-${commentId}`);
			if (editToolbar && editToolbar.children.length === 0) {
				const buttons = [{
						label: "B",
						format: "**",
						title: "Bold"
					},
					{
						label: "I",
						format: "*",
						title: "Italic"
					},
					{
						label: "~~",
						format: "~~",
						title: "Strikethrough"
					},
					{
						label: "H1",
						format: "# ",
						title: "Heading 1",
						block: true
					},
					{
						label: "H2",
						format: "## ",
						title: "Heading 2",
						block: true
					},
					{
						label: "List",
						format: "- ",
						title: "Bullet List",
						block: true,
						list: true
					}
				];

				buttons.forEach(btn => {
					const button = document.createElement("button");
					button.type = "button";
					button.textContent = btn.label;
					button.title = btn.title;
					button.className = "px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium";

					button.addEventListener("click", () => {
						const textarea = editForm.querySelector(".edit-textarea");
						applyFormatting(textarea, btn.format, btn.block, btn.isLink, btn.multiline, btn.list);
					});

					editToolbar.appendChild(button);
				});
			}
		});
	});

	// Cancel edit button handlers
	document.querySelectorAll(".cancel-edit-btn").forEach((button) => {
		button.addEventListener("click", function() {
			const commentElement = this.closest('[id^="comment-"]');
			commentElement.querySelector(".comment-content").classList.remove("hidden");
			commentElement.querySelector(".edit-form").classList.add("hidden");
		});
	});

	// Save edit button handlers
	document.querySelectorAll(".save-edit-btn").forEach((button) => {
		button.addEventListener("click", function() {
			const commentId = this.getAttribute("data-id");
			const commentElement = document.getElementById(`comment-${commentId}`);
			const newContent = commentElement.querySelector(".edit-textarea").value.trim();

			if (!newContent) {
				alert("Comment cannot be empty");
				return;
			}

			// Update in Firestore with the new timestamp
			commentsCollection
				.doc(commentId)
				.update({
					content: newContent,
					edited: true,
					timestamp: Date.now(), // Update the timestamp to the current time
				})
				.then(() => {
					loadComments(); // Reload all comments to refresh the view
				})
				.catch((error) => {
					console.error("Error updating comment:", error);
					alert("Failed to update comment. Please try again.");
				});
		});
	});

	// Delete button handlers
	document.querySelectorAll(".delete-btn").forEach((button) => {
		button.addEventListener("click", function () {
			const commentId = this.getAttribute("data-id");
	
			// Get the current user's UID
			const currentUserId = firebase.auth().currentUser?.uid || "anonymous";
	
			// Fetch the comment to check the userId
			commentsCollection
				.doc(commentId)
				.get()
				.then((doc) => {
					if (doc.exists) {
						const comment = doc.data();
	
						// Check if the current user is the comment creator
						if (comment.userId === currentUserId) {
							if (confirm("Are you sure you want to delete this comment?")) {
								deleteCommentAndReplies(commentId);
							}
						} else {
							alert("You are not authorized to delete this comment.");
						}
					}
				})
				.catch((error) => {
					console.error("Error fetching comment:", error);
					alert("Failed to delete comment. Please try again.");
				});
		});
	});

	// Setup like/dislike handlers
	setupLikeDislikeHandlers();
}

// Function to reposition the comment form below the comments list
function repositionCommentForm() {
	const commentsContainer = document.getElementById("commentsContainer");

	if (!commentsContainer) {
		// Create a container div if it doesn't exist
		const container = document.createElement("div");
		container.id = "commentsContainer";
		container.className = "mb-6";

		// Find the comments list and comment form
		const commentsList = document.getElementById("commentsList");
		const commentForm = document.querySelector(".comment-form");

		if (commentsList && commentForm) {
			// Get the parent of both elements
			const parent = commentsList.parentNode;

			// Create the container and move elements into it
			parent.insertBefore(container, commentsList);
			container.appendChild(commentsList);
			container.appendChild(commentForm);

			// Add some spacing between comments and form
			commentForm.classList.add("mt-6", "pt-6", "border-t", "border-gray-200");
		}
	}
}


// Function to delete a comment and all its replies recursively
function deleteCommentAndReplies(commentId) {
    // Get the current user's UID
    const currentUserId = firebase.auth().currentUser?.uid || "anonymous";

    // Fetch the comment to verify ownership
    commentsCollection
        .doc(commentId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const comment = doc.data();

                // Check if the current user is the comment creator
                if (comment.userId === currentUserId) {
                    // Proceed with deletion
                    if (comment.replies && comment.replies.length > 0) {
                        const deletePromises = comment.replies.map(replyId => {
                            return deleteCommentAndReplies(replyId);
                        });

                        return Promise.all(deletePromises).then(() => {
                            return commentsCollection.doc(commentId).delete();
                        });
                    } else {
                        return commentsCollection.doc(commentId).delete();
                    }
                } else {
                    throw new Error("Unauthorized: You are not the comment creator.");
                }
            }
        })
        .then(() => {
            loadComments();
        })
        .catch((error) => {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment. You are not authorized.");
        });
}