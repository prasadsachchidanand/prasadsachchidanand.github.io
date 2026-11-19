// Checks questions.tex the way the practice page reads it. In this folder, run
//   node check-questions.mjs
// It prints the number of questions in each topic and anything the page could not read; the exit code
// is 1 if a question would be left out of the page.
import { readFileSync } from 'node:fs';
import { parseQuestions } from './questions-tex.js';

const source = readFileSync(new URL('./questions.tex', import.meta.url), 'utf8');
const { topics, questions, problems } = parseQuestions(source);
const plain = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

for (const t of topics) {
  const qs = questions.filter(q => q.topic === t.id);
  const n = type => qs.filter(q => q.type === type).length;
  console.log(`${t.id.padEnd(8)} ${String(qs.length).padStart(3)} questions  (MCQ ${n('mcq')}, MSQ ${n('msq')}, NAT ${n('nat')})  ${plain(t.name)}`);
}
console.log(`${'all'.padEnd(8)} ${String(questions.length).padStart(3)} questions`);

const fatal = problems.filter(p => p.fatal), warnings = problems.filter(p => !p.fatal);
if (fatal.length) {
  console.log(`\nLeft out of the page (${fatal.length}):`);
  for (const p of fatal) console.log(`  ${p.where}: ${p.message}`);
}
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}); these questions are on the page, but check them:`);
  for (const p of warnings) console.log(`  ${p.where}: ${p.message}`);
}
if (!problems.length) console.log('\nNo problems found.');
process.exitCode = fatal.length ? 1 : 0;
