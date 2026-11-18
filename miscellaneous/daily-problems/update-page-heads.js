#!/usr/bin/env node
/**
 * update-page-heads.js
 *
 * Writes the page title, description, link-preview tags and structured data of every
 * dated problem folder (yyyy-mm-dd/index.html) from the problem data in data/*.json,
 * in plain text without LaTeX ("closed in $\mathbb{R}^2$" becomes "closed in ℝ²").
 *
 * Search engines and link previews (WhatsApp, LinkedIn, …) read these tags from the
 * HTML file itself, so they must be in the file, not only set by problem-loader.js
 * when the page opens. Both use the same code: the "PLAIN-TEXT TITLES" part of
 * problem-loader.js.
 *
 * Run it after changing the title or statement of a problem that has its own folder
 * (dates up to LAST_FOLDER_DATE in problem-loader.js):
 *     node update-page-heads.js          (writes the files)
 *     node update-page-heads.js --check  (only reports what would change)
 * Folders dated after today are left alone, so scheduled problems stay hidden.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const CHECK_ONLY = process.argv.includes('--check');

// The plain-text code shared with the problem pages
const loader = fs.readFileSync(path.join(DIR, 'problem-loader.js'), 'utf8');
const begin = loader.indexOf('// ==================== PLAIN-TEXT TITLES (begin)');
const end = loader.indexOf('// ==================== PLAIN-TEXT TITLES (end)');
if (begin < 0 || end < 0) throw new Error('PLAIN-TEXT TITLES section not found in problem-loader.js');
const { problemPageText } = new Function(loader.slice(begin, end) + '\nreturn { problemPageText };')();

// Same weekday → topic file as problem-loader.js; a problem filed under another topic is found too
const TOPIC_BY_WEEKDAY = ['linear-algebra', 'real-analysis', 'complex-analysis', 'abstract-algebra',
    'topology', 'differential-equations', 'miscellaneous'];
const byTopic = {};
for (const file of fs.readdirSync(path.join(DIR, 'data')).filter(f => f.endsWith('.json'))) {
    byTopic[file.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(DIR, 'data', file), 'utf8'));
}
function findProblem(date) {
    const [y, m, d] = date.split('-').map(Number);
    const preferred = TOPIC_BY_WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
    for (const key of [preferred, ...Object.keys(byTopic)]) {
        const data = byTopic[key];
        const problem = data && data.problems.find(p => p.date === date);
        if (problem) return { problem, topic: data.topic };
    }
    return null;
}

const escapeAttr = t => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const today = new Date().toLocaleDateString('en-CA');   // yyyy-mm-dd, local time
const folders = fs.readdirSync(DIR).filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f) && fs.existsSync(path.join(DIR, f, 'index.html'))).sort();
let changed = 0, unchanged = 0;
const skipped = [], problems = [];

for (const date of folders) {
    if (date > today) { skipped.push(date + ' (scheduled)'); continue; }
    const found = findProblem(date);
    if (!found) { skipped.push(date + ' (no problem in data/)'); continue; }
    const { title, description } = problemPageText(date, found.problem, found.topic);

    const file = path.join(DIR, date, 'index.html');
    const before = fs.readFileSync(file, 'utf8');
    let html = before;
    const replaceOnce = (re, value, label) => {
        let count = 0;
        html = html.replace(re, (m, open, close) => { count++; return open + value + close; });
        if (count !== 1) problems.push(`${date}: ${label} found ${count} times`);
    };
    replaceOnce(/(<title>)[\s\S]*?(<\/title>)/g, escapeText(title), '<title>');
    for (const [attr, name, value] of [
        ['name', 'description', description], ['property', 'og:title', title], ['property', 'og:description', description],
        ['name', 'twitter:title', title], ['name', 'twitter:description', description],
        ['name', 'linkedin:title', title], ['name', 'linkedin:description', description]]) {
        replaceOnce(new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(">)`, 'g'), escapeAttr(value), name);
    }
    // Structured data: same headline and description (one "image", as problem-loader.js writes it)
    let blocks = 0;
    html = html.replace(/(<script type="application\/ld\+json" id="structured-data">\s*)([\s\S]*?)(\s*<\/script>)/g, (m, open, body, close) => {
        blocks++;
        const data = JSON.parse(body);   // a repeated "image" key: the last one wins
        data.headline = title;
        data.description = description;
        return open + JSON.stringify(data, null, 2).replace(/</g, '\\u003c').replace(/\n/g, '\n  ') + close;
    });
    if (blocks !== 1) problems.push(`${date}: structured data found ${blocks} times`);

    if (html === before) { unchanged++; continue; }
    changed++;
    if (!CHECK_ONLY) fs.writeFileSync(file, html);
}

console.log(`${CHECK_ONLY ? 'Would update' : 'Updated'} ${changed} pages; ${unchanged} already up to date.`);
if (skipped.length) console.log(`Skipped ${skipped.length}: ${skipped.join(', ')}`);
if (problems.length) { console.log('Problems:\n  ' + problems.join('\n  ')); process.exitCode = 1; }
