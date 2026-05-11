// calendar.js
// Place this file wherever your main daily-problems page includes it.

// =====================================================================
// CUTOFF DATE — must match the value in problem-loader.js
// Dates UP TO AND INCLUDING this date have a real folder (yyyy-mm-dd/).
// Dates AFTER this date use the canonical page (/problem/?date=yyyy-mm-dd).
// =====================================================================
const CALENDAR_LAST_FOLDER_DATE = '2025-12-31';

// Build the correct URL for a given date string
function buildCalendarDateURL(dateString) {
    if (dateString <= CALENDAR_LAST_FOLDER_DATE) {
        return `../daily-problems/${dateString}/`;
    } else {
        return `../daily-problems/problem/?date=${dateString}`;
    }
}

// Set of all dates that have problems, populated asynchronously
var availableProblemDates = new Set();
var problemDatesLoaded = false;

// Topic map (must match daily-problem-loader.js)
const calendarTopicMap = {
    0: 'linear-algebra',
    1: 'real-analysis',
    2: 'complex-analysis',
    3: 'abstract-algebra',
    4: 'topology',
    5: 'differential-equations',
    6: 'miscellaneous'
};

// Load all problem dates from all JSON files upfront
async function loadAllProblemDates() {
    const allTopics = Object.values(calendarTopicMap);
    for (const topic of allTopics) {
        try {
            const response = await fetch(`data/${topic}.json`);
            if (!response.ok) continue;
            const data = await response.json();
            if (data.problems && Array.isArray(data.problems)) {
                data.problems.forEach(p => {
                    if (p.date) availableProblemDates.add(p.date);
                });
            }
        } catch (e) {
            // silently skip missing files
        }
    }
    problemDatesLoaded = true;
    // Re-run links() so calendar cells update with correct colors
    links();
}

function generate_year_range(start, end) {
    var years = "";
    for (var year = start; year <= end; year++) {
        years += "<option value='" + year + "'>" + year + "</option>";
    }
    return years;
}

var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();
var selectYear = document.getElementById("year");
var selectMonth = document.getElementById("month");

var createYear = generate_year_range(2023, currentYear);
document.getElementById("year").innerHTML = createYear;

var calendar = document.getElementById("calendar");
var lang = calendar.getAttribute('data-lang');

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var dayHeader = "<tr>";
for (day in days) {
    dayHeader += "<th data-days='" + days[day] + "'>" + days[day] + "</th>";
}
dayHeader += "</tr>";

document.getElementById("thead-month").innerHTML = dayHeader;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

updateNavigationButtons();

// Kick off async load of all problem dates
loadAllProblemDates();

function next() {
    if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        return;
    }
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
    links();
    updateNavigationButtons();
}

function previous() {
    if (currentMonth !== 0 || currentYear !== 2023) {
        currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        showCalendar(currentMonth, currentYear);
        links();
        updateNavigationButtons();
    }
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
    links();
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const nextButton = document.querySelector('button[onclick="next()"]');
    const prevButton = document.querySelector('button[onclick="previous()"]');

    if (nextButton) {
        if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
            nextButton.disabled = true;
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
            nextButton.style.pointerEvents = 'auto';
            nextButton.disabled = false;
        }
    }

    if (prevButton) {
        if (currentMonth === 0 && currentYear === 2023) {
            prevButton.style.opacity = '0.5';
            prevButton.style.cursor = 'not-allowed';
            prevButton.style.pointerEvents = 'none';
            prevButton.disabled = true;
        } else {
            prevButton.style.opacity = '1';
            prevButton.style.cursor = 'pointer';
            prevButton.style.pointerEvents = 'auto';
            prevButton.disabled = false;
        }
    }

    console.log('Next button found:', nextButton);
    console.log('Prev button found:', prevButton);
}

function showCalendar(month, year) {
    let firstDay = new Date(year, month, 1).getDay();
    console.log(`First day of ${months[month]} ${year}:`, firstDay);

    let tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";

    monthAndYear.innerHTML = `${months[month]} ${year}`;
    selectYear.value = year;

    selectMonth.innerHTML = "";
    months.forEach((m, index) => {
        if (year === today.getFullYear() && index > today.getMonth()) return;
        selectMonth.innerHTML += `<option value='${index}'>${m}</option>`;
    });
    selectMonth.value = month;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                cell.innerHTML = "";
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                cell.setAttribute("data-date", date);
                cell.setAttribute("data-month", month + 1);
                cell.setAttribute("data-year", year);
                cell.className = "date-picker";

                let span = document.createElement("span");
                span.textContent = date;

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("selected");
                }

                cell.appendChild(span);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
    }

    links();
    updateNavigationButtons();
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function links() {
    document.querySelectorAll('td.date-picker > span').forEach(element => {
        let parent = element.parentElement;
        let year = parseInt(parent.getAttribute('data-year'));
        let month = parent.getAttribute('data-month').padStart(2, '0');
        let day = element.textContent.padStart(2, '0');
        let date = new Date(year, parseInt(month) - 1, parseInt(day));

        if (date > today) {
            element.style.color = "#737272";
            element.style.cursor = "not-allowed";
        } else {
            const dateString = `${year}-${month}-${day}`;

            // For dates from 2026 onwards, check if a problem exists in JSON
            const isMissingProblem = year >= 2026 && problemDatesLoaded && !availableProblemDates.has(dateString);

            let link = document.createElement('a');

            // ── KEY CHANGE: use buildCalendarDateURL instead of a hardcoded template ──
            link.href = buildCalendarDateURL(dateString);
            link.target = "_blank";
            link.textContent = element.textContent;

            if (isMissingProblem) {
                link.style.color = "#9ca3af";
                link.title = "No problem available for this date";
            }

            element.innerHTML = "";
            element.appendChild(link);
        }
    });
}

links();