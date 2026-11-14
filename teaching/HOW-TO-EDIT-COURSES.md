# How to edit the course pages

Every course page is drawn from one file: `course-data.json` in that course's folder.
You never need to touch `index.html` or `course-template.js`.

## Add a lecture, homework, quiz, …

1. Put the PDF in the course folder, for example `teaching/linear-algebra/lecture/lec-05.pdf`.
2. Open `teaching/linear-algebra/course-data.json` and add one entry to the right list:

```json
"lectures": { "items": [
  { "number": 4, "title": "Vector spaces", "date": "September 1, 2026", "file": "lecture/lec-04.pdf" },
  { "number": 5, "title": "Subspaces and span", "date": "September 3, 2026", "file": "lecture/lec-05.pdf" }
] }
```

That is all. A section (and its card) appears on the page as soon as it has one entry.

**The sections you can use** (title, icon and colour are automatic):

| Key in `sections` | Shown as | Heading of each entry |
|---|---|---|
| `lectures` | Lecture Notes | Lecture 1, Lecture 2, … |
| `tutorials` | Tutorials | Tutorial 1, … |
| `homeworks` | Homework and Assignments | Homework 1, … |
| `assignments` | Assignments | Assignment 1, … |
| `practice` | Practice Problems | Problem Set 1, … |
| `quizzes` | Quizzes | Quiz 1, … |
| `presentations` | Student Presentations | the entry's `title` |
| `exams` | Examinations | the entry's `title` |

**What an entry can have** (leave out anything you don't need):

| Field | Meaning |
|---|---|
| `number` | 1, 2, 3, … gives the heading "Lecture 1" etc. |
| `title` | Topic, shown under the heading (or as the heading for presentations and exams) |
| `description` | A short line of text |
| `date` or `deadline` | Shown with a calendar icon, e.g. `"August 19, 2025"` or `"No deadline, not graded"` |
| `file` | The PDF. Use `null` to show a locked "Coming soon" button until it is ready |
| `solution` | The solution PDF. Use `null` to show a locked "Solution" button; leave the field out for no solution button |
| `links` | Extra buttons: `[ { "label": "Video", "url": "https://…" } ]` |

**To release a solution later**, change `"solution": null` to `"solution": "quiz/quiz-01-sol.pdf"`.

## The other parts of a course page

All optional; a part only appears if it is in the file.

```json
{
  "courseCode": "MTH100",                     // leave "" if the course has no code
  "courseTitle": "Linear Algebra",
  "semester": "Monsoon Semester 2026 · Section A",
  "schedule": [ { "day": "Mon & Wed", "time": "11:00–11:50 AM" } ],
  "location": "IIIT Delhi",

  "classroom": { "text": "Materials are on Google Classroom …", "url": "https://classroom.google.com/c/…" },
  "about": { "text": "What the course covers …", "link": { "label": "Official course description", "url": "https://…" } },
  "documents": [ { "title": "Lecture notes", "description": "The complete notes", "file": "notes.pdf" } ],
  "weeklyPlan": { "note": "…", "units": [ { "title": "Vector spaces", "reading": "Lay, Chapter 4", "weeks": [ [4, "Vector spaces and subspaces"] ] } ] },
  "people": [ { "role": "Instructor", "name": "…", "office": "…", "email": "…", "hours": ["Monday, 4:00–5:00 PM"] } ],

  "grading": { "Quizzes": 30, "Midterm": 25, "End Sem": 40, "Tutorials": 5 },
  "gradingNotes": [ "Three quizzes of 10 marks each." ],
  "gradeScale": [ { "grade": "A", "range": "X ≥ 90" } ],
  "policies": [ { "title": "Electronic devices", "text": "…" } ],

  "referencesTitle": "Recommended books",      // default "References"
  "references": [ { "author": "David C. Lay", "title": "Linear Algebra and Its Applications", "publisher": "Pearson", "link": "https://… (optional)" } ],

  "sections": { "lectures": { "items": [] }, "quizzes": { "items": [] } }
}
```

(The `//` comments above are only for explanation; JSON files cannot contain comments.)

Grading names with their own colours: Assignments, Homework, Quizzes, Presentation, Midterm, Mid Sem, End Sem,
Projects, Tutorials, Test. Any other name is shown in grey.

**Never put Google Classroom class codes in these files.** The pages are public.

## Add a new course

1. Create a folder in `teaching/`, e.g. `teaching/real-analysis/`.
2. Copy `index.html` from any other course folder into it, unchanged.
3. Copy a `course-data.json` from another course and change the details.
4. Add the course to `teaching/courses-data.json` (this is the list on the Teaching page):

```json
{ "code": "MTH 201", "title": "Real Analysis", "abbreviation": "RA", "semester": "Winter 2027", "year": "2027",
  "location": "IIIT Delhi", "status": "ongoing", "tags": ["analysis"], "url": "real-analysis/" }
```

`"status": "ongoing"` puts the course in "Teaching now" on the homepage and at the top of the Teaching menu.
Change it to `"completed"` when the semester ends.

## If a page shows "could not be loaded"

There is a typo in `course-data.json`, almost always a missing or extra comma, or a missing quote.
VS Code underlines the exact spot in red. Text must be in "double quotes", and the last entry in a list has no comma after it.
