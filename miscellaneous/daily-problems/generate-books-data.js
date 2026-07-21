#!/usr/bin/env node
/**
 * generate-books-data.js
 *
 * Lives in miscellaneous/daily-problems/ (next to generate-tags.js) and
 * scans every topic JSON file in ./data, building
 * miscellaneous/books/booksData.js — a nested book -> chapter -> problem[]
 * structure, derived from problem "tags" that reference a book + exercise
 * number. (books/ is a sibling of daily-problems/, not nested inside it.)
 *
 * USAGE (run from miscellaneous/daily-problems/):
 *   node generate-books-data.js
 *
 * WHEN YOU ADD A NEW BOOK:
 *   Add an entry to BOOK_REGISTRY below (key, title, author, aliases).
 *   `aliases` should list every raw tag-prefix you've ever used for that
 *   book (lowercase, without the " (x.y.z)" suffix) — this is what lets the
 *   script merge historical naming drift into one canonical book.
 *
 * COVER IMAGES (optional):
 *   Drop an image file named exactly "<book-key>.jpg" (or .png/.webp/.jpeg)
 *   into miscellaneous/books/covers/ and re-run this script — it's picked
 *   up automatically, no config needed. A book with no matching file just
 *   keeps the plain spine-card look. Only use cover images you have the
 *   rights to use (e.g. photos of your own copy) — book cover art is
 *   normally copyrighted.
 *
 * DEDICATED PER-BOOK PROBLEM FILES (optional):
 *   You don't have to post a problem as a daily problem to get it into a
 *   book's solution set. Drop a file into miscellaneous/books/data/ (name it
 *   after the book, e.g. "abstract-algebra-herstein.json") using the exact
 *   same entry shape as a daily-problems/data/*.json file — date, title,
 *   difficulty, problem, hint, solution, tags (including the usual book
 *   tag, e.g. "abstract-algebra-herstein (1.3.2)"). Using the same shape
 *   means you can move a problem to/from a daily-problems file later just by
 *   copy-pasting the same JSON object — no reformatting needed.
 *   These merge into the same book as anything tagged from the daily-problem
 *   JSON files. If the same exercise number shows up in both places, the
 *   dedicated file here wins (with a console note explaining why) — handy if
 *   you posted something as a daily problem first and later gave it a
 *   proper standalone entry here.
 *
 * TAGGING CONVENTION GOING FORWARD (please use this for all new problems):
 *   "<book-key> (<chapter>.<section>.<problem>)"
 *   e.g. "abstract-algebra-herstein (2.3.14)"
 *   Keep <book-key> IDENTICAL (same casing/hyphenation/order) every time.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
// books/ now lives as a sibling of daily-problems/ (i.e. miscellaneous/books/),
// not inside it — so we go up one level from this script's location.
const OUT_FILE = path.join(__dirname, '..', 'books', 'booksData.js');
// Drop a cover image named exactly "<book-key>.jpg" (or .png/.webp/.jpeg) in
// miscellaneous/books/covers/ and it's picked up automatically — no config
// needed. A book with no matching file just keeps the plain spine-card look.
const COVERS_DIR = path.join(__dirname, '..', 'books', 'covers');
const COVER_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
// NEW: dedicated per-book problem files. Each file is named "<book-key>.json"
// and contains problems that belong to that book directly — no daily-problem
// date or tags required. These merge into the same book as anything picked
// up from tags in the daily-problem JSON files; if a number exists in both
// places, the dedicated file here wins (see the merge step below).
const BOOKS_SOURCE_DIR = path.join(__dirname, '..', 'books', 'data');

function findCoverImage(bookKey) {
  for (const ext of COVER_EXTENSIONS) {
    if (fs.existsSync(path.join(COVERS_DIR, `${bookKey}${ext}`))) {
      return `covers/${bookKey}${ext}`; // relative path, as used from books/index.html
    }
  }
  return null;
}

// ---- 1. Canonical book registry -------------------------------------------
const BOOK_REGISTRY = [
  {
    key: 'abstract-algebra-herstein',
    title: 'Topics in Algebra',
    author: 'I. N. Herstein',
    shortName: 'Herstein',
    color: 'rose',
    // covers both naming variants seen historically in the data:
    aliases: ['abstract-algebra-herstein', 'herstein-abstract-algebra'],
  },
  {
    key: 'real-analysis-rudin',
    title: 'Principles of Mathematical Analysis',
    author: 'Walter Rudin',
    shortName: 'Rudin',
    color: 'sky',
    aliases: ['real-analysis-rudin'],
  },
  {
    key: 'real-analysis-bartle-sherbert',
    title: 'Introduction to Real Analysis',
    author: 'Bartle & Sherbert',
    shortName: 'Bartle',
    color: 'amber',
    aliases: ['real-analysis-bartle-sherbert'],
  },
  {
    key: 'linear-algebra-hoffman-kunze',
    title: 'Linear Algebra',
    author: 'Hoffman & Kunze',
    shortName: 'Hoffman',
    color: 'emerald',
    aliases: ['linear-algebra-hoffman-kunze'],
  },
  {
    key: 'topology-munkres',
    title: 'Topology',
    author: 'James Munkres',
    shortName: 'Munkres',
    color: 'violet',
    aliases: ['topology-munkres'],
  },
  {
    key: 'complex-variables-brown-and-churchill',
    title: 'Complex Variables and Applications',
    author: 'Brown and Churchill',
    shortName: 'Brown and Churchill',
    color: 'indigo',
    aliases: ['complex-variables-brown-and-churchill'],
  },
  
  {
    key: 'complex-analysis-gamelin',
    title: 'Complex Analysis',
    author: 'T. Gamelin',
    shortName: 'Gamelin',
    color: 'teal',
    aliases: ['complex-analysis-gamelin'],
  },
];

const aliasToKey = {};
BOOK_REGISTRY.forEach(book => {
  book.aliases.forEach(a => { aliasToKey[a.toLowerCase()] = book.key; });
});
const bookMeta = {};
BOOK_REGISTRY.forEach(book => {
  bookMeta[book.key] = {
    title: book.title,
    author: book.author,
    shortName: book.shortName,
    color: book.color,
    cover: findCoverImage(book.key),
  };
});

// ---- 2. Tag parsers ---------------------------------------------------------
// Pattern A (preferred): "some-book-key (2.3.6)"
const PATTERN_PARENS = /^(.*?)\s*\(([\d]+(?:\.\d+)*)\)$/;
// Pattern B (legacy Rudin format): "Real-Analysis-Rudin-3.11"
const PATTERN_INLINE_RUDIN = /^Real-Analysis-Rudin-([\d]+(?:\.\d+)*)$/i;

function parseBookTag(rawTag) {
  let m = rawTag.match(PATTERN_PARENS);
  if (m) {
    const slug = m[1].trim().toLowerCase();
    const canonicalKey = aliasToKey[slug];
    if (canonicalKey) return { key: canonicalKey, number: m[2] };
  }
  m = rawTag.match(PATTERN_INLINE_RUDIN);
  if (m) return { key: 'real-analysis-rudin', number: m[1] };
  return null;
}

// ---- 3. Natural sort for dotted numbers, e.g. "2.3.9" < "2.3.13" -----------
function compareDotted(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x !== y) return x - y;
  }
  return 0;
}

function splitNumber(number) {
  const parts = number.split('.');
  // 3+ parts, e.g. "2.3.6"  -> chapter "2", section "3"  (problem "2.3.6")
  // 2 parts,   e.g. "3.7"   -> chapter "3", no section   (problem "3.7")
  // 1 part,    e.g. "5"     -> chapter "5", no section
  if (parts.length >= 3) {
    return { chapter: parts[0], section: parts[1] };
  }
  return { chapter: parts[0], section: null };
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// ---- 4. Scan problem files (daily-problems/data/*.json AND books/data/*.json)
// Both use the *exact same* entry shape (date, title, difficulty, problem,
// hint, solution, tags: [...]) — books/data/ files are just a place to keep
// book-only problems before/without ever posting them as a daily problem.
// Since the shape is identical, the same tag-parsing logic handles both; the
// only difference is which "source" a match came from.
const flat = {}; // flat[bookKey][number] = entry
const unmatched = new Set();
const sourceDates = {}; // "bookKey|number" -> [{ source, date }, ...] (for duplicate detection)
const overrides = []; // { bookKey, number, date } — daily entries superseded by a book-native one

if (!fs.existsSync(DATA_DIR)) {
  console.error(`❌ Could not find data directory at ${DATA_DIR}`);
  console.error('   Run this script from miscellaneous/daily-problems/, or edit DATA_DIR at the top of the script.');
  process.exit(1);
}

function scanProblemFiles(dir, sourceLabel) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

  files.forEach(file => {
    const fileSlug = file.replace(/\.json$/, '');
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    } catch (e) {
      console.error(`Skipping ${file}: invalid JSON (${e.message})`);
      return;
    }

    (data.problems || []).forEach(problem => {
      (problem.tags || []).forEach(tag => {
        const parsed = parseBookTag(tag);
        if (!parsed) {
          if (/\(\s*[\d.]+\s*\)$/.test(tag) || /-\d+(\.\d+)*$/.test(tag)) {
            unmatched.add(tag);
          }
          return;
        }
        const { key, number } = parsed;

        const trackKey = `${key}|${number}`;
        if (!sourceDates[trackKey]) sourceDates[trackKey] = [];
        sourceDates[trackKey].push({ source: sourceLabel, date: problem.date });

        if (!flat[key]) flat[key] = {};
        const existing = flat[key][number];

        // A book-native entry always supersedes a daily one for the same
        // number — report it, but it's a deliberate override, not an error.
        if (sourceLabel === 'book' && existing && existing.source === 'daily') {
          overrides.push({ bookKey: key, number, date: existing.date });
        }

        // First entry for a given number wins within a source; a second
        // daily entry or second book entry with the same number is exactly
        // what the duplicate-number warning below is for. A book entry only
        // overwrites an *existing daily* entry, never another book entry.
        const shouldSet = !existing || (sourceLabel === 'book' && existing.source === 'daily');
        if (shouldSet) {
          flat[key][number] = {
            number,
            source: sourceLabel, // 'daily' | 'book'
            date: problem.date,
            topic: fileSlug, // which file (under this source's base dir) to fetch from later
            title: problem.title || '',
            difficulty: problem.difficulty || '',
            // Full problem statement (not a truncated preview) so it can be
            // read directly in the chapter/section listing without an extra
            // fetch.
            problem: problem.problem || '',
          };
        }
      });
    });
  });
}

scanProblemFiles(DATA_DIR, 'daily');
scanProblemFiles(BOOKS_SOURCE_DIR, 'book');

// ---- 4b. Turn the flat map into the nested chapter -> section -> problem tree
const books = {};
Object.entries(flat).forEach(([key, numbersMap]) => {
  if (!books[key]) books[key] = { ...bookMeta[key], chapters: {} };
  Object.values(numbersMap).forEach(entry => {
    const { chapter, section } = splitNumber(entry.number);
    if (!books[key].chapters[chapter]) books[key].chapters[chapter] = { problems: [], sections: {} };
    const chapterNode = books[key].chapters[chapter];
    const bucket = section
      ? (chapterNode.sections[section] || (chapterNode.sections[section] = { problems: [] }))
      : chapterNode;
    bucket.problems.push(entry);
  });
});

Object.values(books).forEach(book => {
  Object.values(book.chapters).forEach(ch => {
    ch.problems.sort((a, b) => compareDotted(a.number, b.number));
    Object.values(ch.sections).forEach(sec => {
      sec.problems.sort((a, b) => compareDotted(a.number, b.number));
    });
  });
});

// ---- 5. Write output ----------------------------------------------------------
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

const header = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated on: ${new Date().toISOString()}
// Run "node generate-books-data.js" (from miscellaneous/daily-problems/) to regenerate
`;

fs.writeFileSync(OUT_FILE, header + `\nconst booksData = ${JSON.stringify(books, null, 2)};\n`);

console.log(`✅ Wrote ${OUT_FILE}`);
console.log(`   Books found: ${Object.keys(books).length}`);
Object.entries(books).forEach(([key, b]) => {
  const chapterCount = Object.keys(b.chapters).length;
  let problemCount = 0;
  Object.values(b.chapters).forEach(ch => {
    problemCount += ch.problems.length;
    Object.values(ch.sections).forEach(sec => { problemCount += sec.problems.length; });
  });
  console.log(`   - ${key}: ${chapterCount} chapters, ${problemCount} problems${b.cover ? ` (cover: ${b.cover})` : ' (no cover image found)'}`);
});

if (unmatched.size > 0) {
  console.log('\n⚠️  Tags that look like book references but did not match a known book/alias:');
  unmatched.forEach(t => console.log(`   - "${t}"`));
  console.log('   → Add the missing alias to BOOK_REGISTRY in this script, or fix the tag at the source.');
}

const duplicateDailyNumbers = [];
const duplicateBookNumbers = [];
Object.entries(sourceDates).forEach(([trackKey, entries]) => {
  const dailyDates = [...new Set(entries.filter(e => e.source === 'daily').map(e => e.date))];
  const bookDates = [...new Set(entries.filter(e => e.source === 'book').map(e => e.date))];
  if (dailyDates.length > 1) duplicateDailyNumbers.push([trackKey, dailyDates]);
  if (bookDates.length > 1) duplicateBookNumbers.push([trackKey, bookDates]);
});

if (duplicateDailyNumbers.length > 0) {
  console.log('\n🚨 The same exercise number is tagged on more than one daily problem — this breaks');
  console.log('   next/prev navigation for that number (the page can\'t tell them apart).');
  duplicateDailyNumbers.forEach(([trackKey, dates]) => {
    const [bookKey, number] = trackKey.split('|');
    console.log(`   - "${bookKey}" exercise ${number}: dates ${dates.join(', ')}`);
  });
  console.log('   → Open those dates\' entries in your data/*.json and give one of them its correct exercise number.');
}

if (duplicateBookNumbers.length > 0) {
  console.log('\n🚨 The same exercise number appears more than once within books/data/*.json:');
  duplicateBookNumbers.forEach(([trackKey, dates]) => {
    const [bookKey, number] = trackKey.split('|');
    console.log(`   - "${bookKey}" exercise ${number}: dates ${dates.join(', ')}`);
  });
  console.log('   → Only the first one found is being used; fix the duplicate exercise number in that file.');
}

if (overrides.length > 0) {
  console.log('\nℹ️  Book-native entries (books/data/*.json) superseded a daily-tagged problem with the same number:');
  overrides.forEach(o => {
    console.log(`   - "${o.bookKey}" exercise ${o.number} (was daily-tagged on ${o.date}) — now serving books/data/${o.bookKey}.json's version instead.`);
  });
}