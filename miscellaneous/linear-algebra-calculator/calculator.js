/*
 * Linear algebra calculator: echelon forms, rank, null space (Ax = 0) or Ax = b, inverse,
 * determinant, eigenvalues and eigenvectors, and diagonalization, with every step.
 * All arithmetic is exact (la-core.js); results are shown with MathJax and can be copied as LaTeX
 * or as Typst (typst.js converts the LaTeX).
 */
import * as L from './la-core.js';
import { documentToTypst } from './typst.js';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MAX = 8, MAX_EIGEN = 6;
const EXAMPLES = {
  inv: '2 1 1\n1 3 2\n1 0 0',
  rank: '1 2 0 3\n2 4 1 7\n3 6 1 10',
  sing: '1 2 3\n4 5 6\n7 8 9',
  diag: '4 -1 6\n2 1 6\n2 -1 8',
  notdiag: '2 4 3\n-4 -6 -3\n3 3 1',
  complex: '0.5 -0.6\n0.75 1.1',
  system: '1 2 -1 | 4\n2 1 1 | 5\n1 -1 2 | 1',
  fractions: '1/2 1/3\n1/4 1/5',
};

let parsed = null;          // { M, bar } of the box, or null
let tex = [];               // the LaTeX of the current answer, for "Copy LaTeX" (and "Copy Typst")

// ---------------------------------------------------------------- reading the matrix
function readMatrix() {
  const box = $('la-input').value;
  try {
    const { M, bar } = L.parseMatrix(box);
    if (M.length > MAX || M[0].length > MAX + 1) throw new Error(`Please use at most ${MAX} rows and ${MAX} columns.`);
    parsed = { M, bar };
    const m = M.length, n = bar >= 0 ? bar : M[0].length;
    $('la-size').textContent = bar >= 0 ? `[A | b] with A of size ${m} × ${n}` : `A is ${m} × ${n}${m === n ? ' (square)' : ''}`;
    $('la-size').dataset.kind = 'ok';
    $('la-preview').innerHTML = `\\[ ${bar >= 0 ? '[A \\mid b]' : 'A'} = ${L.texMatrix(M, bar)} \\]`;
    typeset($('la-preview'));
  } catch (e) {
    parsed = null;
    $('la-size').textContent = String(e.message || e);
    $('la-size').dataset.kind = 'error';
    $('la-preview').innerHTML = '';
  }
  $('la-solve').innerHTML = parsed && parsed.bar >= 0 ? '<i class="fas fa-equals"></i> Solve Ax = b' : '<i class="fas fa-equals"></i> Solve Ax = 0 (null space)';
  document.querySelectorAll('[data-op]').forEach(b => { b.disabled = !parsed; });
}

// ---------------------------------------------------------------- output helpers
const showSteps = () => $('la-steps').checked;
const disp = t => `\\[ ${t} \\]`;
function stepsHTML(steps, start, bar) {
  if (!steps.length) return '<p class="tl-muted">No row operations are needed.</p>';
  return `<ol class="la-steps">${steps.map(s => `<li>${disp(`\\xrightarrow{\\;${s.op}\\;} ${L.texMatrix(s.M, bar)}`)}</li>`).join('')}</ol>`;
}
function stepsTeX(steps, start, bar) {
  const lines = [`${L.texMatrix(start, bar)}`];
  steps.forEach(s => lines.push(`&\\xrightarrow{${s.op}} ${L.texMatrix(s.M, bar)}`));
  return `\\begin{align*}\n  ${lines.map((l, i) => (i === 0 ? '&' + l : l)).join(' \\\\\n  ')}\n\\end{align*}`;
}
function block(title, html) { return `<section class="la-block"><h3>${esc(title)}</h3>${html}</section>`; }
function details(summary, html, open) { return `<details class="la-details"${open ? ' open' : ''}><summary>${summary}</summary>${html}</details>`; }   // summary: HTML
const boxedPivots = (M, pivots) => M.map((r, i) => r.map((v, j) => (pivots.some(([pr, pc]) => pr === i && pc === j) ? { toTeX: () => `\\boxed{${v.toTeX()}}` } : v)));
const vecList = vs => vs.map(v => L.texVector(v)).join(',\\; ');
const xName = j => `x_{${j + 1}}`;
const PARAMS = ['s', 't', 'u', 'v', 'w', 'r', 'p', 'q'];

// x = s v1 + t v2 (+ p)
function generalSolution(basis, free, particular) {
  const parts = [];
  if (particular && particular.some(v => !v.isZero())) parts.push(L.texVector(particular));
  basis.forEach((v, k) => parts.push(`${free.length <= PARAMS.length ? PARAMS[k] : xName(free[k])}\\,${L.texVector(v)}`));
  return parts.length ? parts.join(' + ') : L.texVector((particular || basis[0]).map(() => L.Q.ZERO));
}
// clear denominators of a vector (any nonzero multiple of a basis vector is fine)
function integerMultiple(v) {
  if (!v.every(x => x instanceof L.Q)) return null;
  const lcm = v.reduce((l, x) => { const g = (a, b) => (b ? g(b, a % b) : a); return (l * x.d) / g(l, x.d); }, 1n);
  return lcm === 1n ? null : v.map(x => x.mul(new L.Q(lcm)));
}
const free = (n, pivots) => [...Array(n).keys()].filter(j => !pivots.some(p => p[1] === j));
// eigenvectors with the fractions cleared (any nonzero multiple of an eigenvector is one too)
function cleared(v) {
  const g = (a, b) => (b ? g(b, a % b) : (a < 0n ? -a : a));
  const dens = [];
  v.forEach(x => { if (x instanceof L.Q) dens.push(x.d); else { dens.push(x.x.d, x.y.d); } });
  const lcm = dens.reduce((l, d) => (l * d) / g(l, d), 1n);
  let w = v.map(x => x.mul(x instanceof L.Q ? new L.Q(lcm) : new L.QS(new L.Q(lcm), L.Q.ZERO, x.d)));
  if (w.every(x => x instanceof L.Q)) {
    const k = w.reduce((a, x) => g(a, x.n), 0n);
    if (k > 1n) w = w.map(x => x.div(new L.Q(k)));
  }
  return w;
}

// ---------------------------------------------------------------- the operations
function opEchelon(M, reduced) {
  const r = L.rowReduce(M, { reduced });
  const steps = reduced ? r.steps : r.steps.slice(0, r.forward);
  const name = reduced ? 'reduced row echelon form' : 'row echelon form';
  const R = reduced ? r.A : r.A;
  const pivCols = r.pivots.map(p => p[1] + 1).join(', ') || 'none';
  let html = block('Result', disp(`${reduced ? 'R' : 'U'} = ${L.texMatrix(boxedPivots(R, r.pivots))}`) +
    `<p>The pivots are boxed; they are in column${r.pivots.length === 1 ? '' : 's'} ${pivCols}.` +
    (reduced ? ' The reduced echelon form of a matrix is unique.' : ' An echelon form is not unique, but its pivot positions are.') + '</p>');
  if (showSteps()) html += block('Steps', details(`${steps.length} row operation${steps.length === 1 ? '' : 's'}`, disp(`A = ${L.texMatrix(M)}`) + stepsHTML(steps, M), true));
  tex = [`% The ${name} of A`, stepsTeX(steps, M)];
  return html;
}

function opRank(M) {
  const r = L.rowReduce(M, { reduced: true });
  const m = M.length, n = M[0].length, k = r.pivots.length;
  const cols = r.pivots.map(p => M.map(row => row[p[1]]));
  const rows = r.A.slice(0, k);
  let html = block('Result', disp(`\\operatorname{rank} A = ${k}, \\qquad \\dim \\operatorname{Nul} A = ${n} - ${k} = ${n - k}`) +
    `<p>The rank is the number of pivots in an echelon form. Rank–nullity: rank + nullity = ${n}, the number of columns.</p>` +
    (k ? `<p><b>Basis of the column space</b> (the pivot columns of A itself):</p>${disp(`\\left\\{ ${vecList(cols)} \\right\\}`)}` +
      `<p><b>Basis of the row space</b> (the nonzero rows of the reduced echelon form):</p>${disp(`\\left\\{ ${rows.map(rw => `\\begin{bmatrix}${rw.map(v => v.toTeX()).join(' & ')}\\end{bmatrix}`).join(',\\; ')} \\right\\}`)}` : '<p>A is the zero matrix.</p>'));
  if (showSteps()) html += block('Steps', details('Row reduce A', disp(`A = ${L.texMatrix(M)}`) + stepsHTML(r.steps, M) + disp(`R = ${L.texMatrix(boxedPivots(r.A, r.pivots))}`), false));
  tex = [`% rank A = ${k}, nullity = ${n - k}`, stepsTeX(r.steps, M)];
  return html;
}

function equationsTeX(R, pivots, n, withB) {
  const fr = free(n, pivots);
  return pivots.map(([r, c]) => {
    const terms = [];                         // { neg, body }
    if (withB && !R[r][n].isZero()) { const b = R[r][n]; terms.push({ neg: b.sign() < 0, body: (b.sign() < 0 ? b.neg() : b).toTeX() }); }
    fr.forEach(f => {
      const a = R[r][f].neg();
      if (a.isZero()) return;
      const neg = a.sign() < 0, abs = neg ? a.neg() : a;
      terms.push({ neg, body: `${abs.isOne() ? '' : abs.toTeX()}${xName(f)}` });
    });
    const rhs = terms.length ? terms.map((t, i) => (i === 0 ? (t.neg ? '-' : '') + t.body : `${t.neg ? '-' : '+'} ${t.body}`)).join(' ') : '0';
    return `${xName(c)} &= ${rhs}`;
  }).join(' \\\\ ');
}

function opSolve(M, bar) {
  if (bar >= 0) {
    const n = bar, s = L.solve(M, n);
    let html;
    if (!s.consistent) {
      html = block('Result', '<p>The system is <b>inconsistent</b> (no solution): the reduced echelon form has a row [0 … 0 | c] with c ≠ 0, which says 0 = c.</p>' + disp(L.texMatrix(s.R, bar)));
    } else {
      const fr = s.free;
      html = block('Result', `<p>The system is consistent${fr.length ? `; ${fr.map(xName).map(x => `\\(${x}\\)`).join(', ')} ${fr.length === 1 ? 'is a free variable' : 'are free variables'}, so there are infinitely many solutions` : ' and has exactly one solution'}.</p>` +
        (s.pivots.length ? disp(`\\begin{aligned} ${equationsTeX(s.R, s.pivots, n, true)} \\end{aligned}`) : '') +
        `<p>${fr.length ? 'General solution (one parameter for each free variable):' : 'Solution:'}</p>` +
        disp(`x = ${generalSolution(s.basis, fr, s.particular)}`));
    }
    if (showSteps()) html += block('Steps', details('Row reduce [A | b]', disp(`[A \\mid b] = ${L.texMatrix(M, bar)}`) + stepsHTML(s.steps, M, bar), true));
    tex = ['% Solve Ax = b', stepsTeX(s.steps, M, bar)];
    return html;
  }
  const n = M[0].length, ns = L.nullSpace(M);
  let html;
  if (!ns.basis.length) {
    html = block('Result', `<p>Every column has a pivot, so the only solution of \\(Ax = 0\\) is \\(x = 0\\): \\(\\operatorname{Nul} A = \\{0\\}\\) and the columns of A are linearly independent.</p>`);
  } else {
    const ints = ns.basis.map(integerMultiple);
    html = block('Result', `<p>The free variables are ${ns.free.map(xName).map(x => `\\(${x}\\)`).join(', ')}. From the reduced echelon form:</p>` +
      (ns.pivots.length ? disp(`\\begin{aligned} ${equationsTeX(ns.R, ns.pivots, n, false)} \\end{aligned}`) : '') +
      '<p>General solution:</p>' + disp(`x = ${generalSolution(ns.basis, ns.free, null)}`) +
      `<p><b>Basis of \\(\\operatorname{Nul} A\\)</b> (dimension ${ns.basis.length}):</p>` + disp(`\\left\\{ ${vecList(ns.basis)} \\right\\}`) +
      (ints.some(Boolean) ? `<p>Clearing fractions also gives a basis:</p>${disp(`\\left\\{ ${vecList(ns.basis.map((v, i) => ints[i] || v))} \\right\\}`)}` : ''));
  }
  if (showSteps()) html += block('Steps', details('Row reduce A', disp(`A = ${L.texMatrix(M)}`) + stepsHTML(ns.steps, M) + disp(`R = ${L.texMatrix(boxedPivots(ns.R, ns.pivots))}`), true));
  tex = ['% Solve Ax = 0', stepsTeX(ns.steps, M)];
  return html;
}

function needSquare(M, what) {
  if (M.length !== M[0].length) throw new Error(`${what} needs a square matrix; A is ${M.length} × ${M[0].length}.`);
}

function opInverse(M) {
  needSquare(M, 'The inverse');
  const n = M.length, r = L.inverse(M);
  const aug = M.map((row, i) => [...row, ...L.identity(n)[i]]);
  let html = r.invertible
    ? block('Result', disp(`A^{-1} = ${L.texMatrix(r.inv)}`) + `<p>Row reducing \\([A \\mid I]\\) turned the left half into \\(I\\); the right half is \\(A^{-1}\\).</p>`)
    : block('Result', `<p><b>A is not invertible</b>: its rank is ${r.rank} &lt; ${n}, so the left half of \\([A \\mid I]\\) cannot be reduced to \\(I\\) (equivalently, \\(\\det A = 0\\)).</p>`);
  if (showSteps()) html += block('Steps', details('Row reduce [A | I]', disp(`[A \\mid I] = ${L.texMatrix(aug, n)}`) + stepsHTML(r.steps, aug, n), true));
  tex = ['% Row reduce [A | I]', stepsTeX(r.steps, aug, n)];
  return html;
}

function opDet(M) {
  needSquare(M, 'The determinant');
  const n = M.length, r = L.determinant(M);
  const diag = r.U.map((row, i) => row[i]);
  const factors = diag.map(v => (v.toTeX().startsWith('-') || v.toTeX().includes('frac') ? `\\left(${v.toTeX()}\\right)` : v.toTeX())).join(' \\cdot ');
  const sign = r.swaps ? `(-1)^{${r.swaps}} \\cdot ` : '';
  let html = block('Result', disp(`\\det A = ${sign}${factors} = ${r.det.toTeX()}`) +
    `<p>Row replacements do not change the determinant and each row interchange changes its sign (${r.swaps} interchange${r.swaps === 1 ? '' : 's'} here). The echelon form is triangular, so its determinant is the product of its diagonal entries.${r.det.isZero() ? ' Since det A = 0, A is not invertible.' : ' Since det A ≠ 0, A is invertible.'}</p>`);
  if (showSteps()) html += block('Steps', details('Reduce A to an echelon form, without scaling rows', disp(`A = ${L.texMatrix(M)}`) + stepsHTML(r.steps, M), true));
  tex = [`% det A = ${r.det}`, stepsTeX(r.steps, M)];
  return html;
}

// eigenvalue as TeX, exact or approximate
const lamTeX = v => (v.exact ? v.value.toTeX() : L.texApprox(v.approx).replace('\\approx ', ''));
function factoredTeX(ev) {
  const n = ev.n, parts = [];
  ev.factors.forEach(f => {
    let base;
    if (f.kind === 'linear') {
      const r = f.root;
      base = r.isZero() ? '\\lambda' : `(\\lambda ${r.sign() < 0 ? '+' : '-'} ${(r.sign() < 0 ? r.neg() : r).toTeX()})`;
    } else base = `(${L.texPoly(f.kind === 'quadratic' ? [f.c, f.b, L.Q.ONE] : f.poly)})`;
    parts.push(f.mult > 1 ? `${base}^{${f.mult}}` : base);
  });
  return (n % 2 ? '-' : '') + parts.join('');
}

// ---------------------------------------------------------------- det(A − λI) by cofactor expansion, with steps
// The steps are a list of parts, shown as HTML and copied as LaTeX:
// { p: text } | { note: text } | { m: rows of an aligned display } | { summary, open, parts }.
// Texts use only \( \) for maths, so the same string is valid HTML and LaTeX.
const LAM = '\\lambda';
const SHOWN = 40;           // at most this many determinants of size ≥ 3 are expanded on the page
const NARROW = window.matchMedia('(max-width: 640px)');    // a phone: the displays are laid out narrower
const isConst = p => p.length === 1;
function monos(p) {         // the terms of a polynomial, highest power first
  const out = [];
  for (let k = p.length - 1; k >= 0; k--) {
    if (p[k].isZero()) continue;
    const neg = p[k].sign() < 0, a = neg ? p[k].neg() : p[k];
    out.push({ neg, body: (k > 0 && a.isOne() ? '' : a.toTeX()) + (k === 0 ? '' : k === 1 ? LAM : `${LAM}^{${k}}`) });
  }
  return out;
}
const joinMonos = (ms, lead) => (ms.length ? ms.map((t, i) => (i === 0 && !lead ? (t.neg ? '-' : '') : (t.neg ? '- ' : '+ ')) + t.body).join(' ') : '0');
const polyTeX = p => joinMonos(monos(p));
// an entry of A − λI, constant term first: 4 - \lambda, -\lambda, \frac{1}{2}
function entryTeX(p) {
  if (isConst(p)) return p[0].toTeX();
  const [c, a] = p, neg = a.sign() < 0, abs = neg ? a.neg() : a;
  const l = (abs.isOne() ? '' : abs.toTeX()) + LAM;
  return c.isZero() ? (neg ? '-' : '') + l : `${c.toTeX()} ${neg ? '-' : '+'} ${l}`;
}
const paren = t => (t.startsWith('-') || / [+-] /.test(t) ? (t.includes('\\frac') ? `\\left(${t}\\right)` : `(${t})`) : t);
// a product, constants first: 2(8 - \lambda), (1 - \lambda)(8 - \lambda), 6 \cdot (-1)
function mulTeX(fs) {       // fs: [{ tex, c }], c: is it a constant
  let xs = [...fs.filter(f => f.c), ...fs.filter(f => !f.c)];
  if (xs.some(f => !f.c)) xs = xs.filter(f => f.tex !== '1');        // 1(8 - \lambda) is (8 - \lambda); 1 \cdot 1 stays
  return xs.reduce((s, f, i) => (i === 0 ? f.tex : s + (xs[i - 1].c && f.c ? ' \\cdot ' : '') + f.tex), '');
}
const entryF = p => ({ tex: paren(entryTeX(p)), c: isConst(p) });
const valueF = p => (isConst(p) ? { tex: paren(polyTeX(p)), c: true } : { tex: `(${polyTeX(p)})`, c: false });
const vmat = B => `\\begin{vmatrix}${B.map(r => r.map(entryTeX).join(' & ')).join(' \\\\ ')}\\end{vmatrix}`;
// ad - bc, leaving out a product with a zero factor
function twoTeX(B) {
  const ad = L.zeroP(B[0][0]) || L.zeroP(B[1][1]) ? '' : mulTeX([entryF(B[0][0]), entryF(B[1][1])]);
  const bc = L.zeroP(B[0][1]) || L.zeroP(B[1][0]) ? '' : mulTeX([entryF(B[0][1]), entryF(B[1][0])]);
  return ad && bc ? `${ad} - ${bc}` : ad || (bc ? `-${bc}` : '0');
}
// (−1)^{i+j} b_ij as written: (4 - \lambda), - (-1), + 6, - (an entry 1 is left out)
function coefTeX(t, first) {
  const sgn = t.sign < 0 ? '- ' : first ? '' : '+ ';
  return sgn + (isConst(t.entry) && t.entry[0].isOne() ? '' : paren(entryTeX(t.entry)));
}
// the same term with the minor's value put in, sign and constant entry combined: 6(2\lambda - 4)
function valueTermTeX(t, first) {
  const fs = [valueF(t.sub.value)];
  let neg = t.sign < 0;
  if (isConst(t.entry)) {
    const c = t.entry[0].mul(L.Q.int(t.sign));
    neg = c.sign() < 0;
    fs.unshift({ tex: (neg ? c.neg() : c).toTeX(), c: true });
  } else fs.unshift(entryF(t.entry));
  return (neg ? '- ' : first ? '' : '+ ') + mulTeX(fs);
}
// an aligned display: lhs = line 1 = line 2 = …, each line a list of pieces (the terms)
const rows = (lhs, lines, long) => ({ lhs, lines: lines.filter(Boolean), long });
// Its rows. A line gets one row per piece when long (or when the line itself is marked long).
// narrow (a phone): the left-hand side on a row of its own, every row starting at the left, and
// one row per piece always.
function rowsTeX({ lhs, lines, long }, narrow) {
  const out = [];
  let last = null;
  lines.forEach(ps => {
    const one = ps.join(' ');
    if (one === last) return;
    last = one;
    if ((long || ps.long || narrow) && ps.length > 1) ps.forEach((p, i) => out.push(i === 0 ? `&= ${p}` : `&\\quad {} ${p}`));
    else out.push(`&= ${one}`);
  });
  if (lhs && narrow) out.unshift(`&${lhs}`);
  else if (lhs) out[0] = `${lhs} ${out[0]}`;
  return out.join(' \\\\\n');
}
function lineText(node) {
  const { row, index, zeros } = node.line;
  const signs = Array.from({ length: node.k }, (_, t) => ((index + t) % 2 ? '-' : '+')).join(', ');
  const where = `${row ? 'row' : 'column'} ${index + 1}`;
  return (zeros ? `Expand along ${where}, which has ${zeros} zero entr${zeros === 1 ? 'y' : 'ies'} (no row or column has more); the terms with a zero entry drop out.`
    : 'No row or column has a zero entry, so expand along row 1.') + ` The signs \\((-1)^{i+j}\\) along ${where} are \\(${signs}\\).`;
}
// how deep the expansion is shown: all of it, unless that is more than SHOWN determinants
function shownDepth(tree) {
  const count = [];
  (function walk(node, d) { if (node.k < 3) return; count[d] = (count[d] || 0) + 1; (node.terms || []).forEach(t => walk(t.sub, d + 1)); })(tree, 0);
  let total = 0, depth = 0;
  for (let d = 0; d < count.length; d++) { total += count[d]; if (total > SHOWN) break; depth = d; }
  return depth;
}
// lhs: the left-hand side; top: the matrix is A − λI; tail: rows added at the end (the factored form)
function derive(node, lhs, top, depth, maxDepth, tail = []) {
  const parts = [], vm = top ? [vmat(node.B)] : null, value = [polyTeX(node.value)];
  if (node.kind === 'one') return [{ m: rows(lhs, [[entryTeX(node.B[0][0])], ...tail]) }];
  if (node.kind === 'two') {
    if (top) parts.push({ p: 'For a \\(2 \\times 2\\) matrix, \\(\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc\\).' });
    parts.push({ m: rows(lhs, [vm, [twoTeX(node.B)], value, ...tail]) });
    return parts;
  }
  if (node.kind === 'triangular') {
    const what = node.upper && node.lower ? 'diagonal' : node.upper ? 'upper triangular' : 'lower triangular';
    parts.push({ p: `${top ? '\\(A - \\lambda I\\)' : 'This matrix'} is ${what}, so its determinant is the product of its diagonal entries.` });
    parts.push({ m: rows(lhs, [vm, [mulTeX(node.B.map((r, i) => entryF(r[i])))], value, ...tail]) });
    return parts;
  }
  if (!node.terms.length) {
    parts.push({ p: `${node.line.row ? 'Row' : 'Column'} ${node.line.index + 1} is zero, so the determinant is 0.` });
    parts.push({ m: rows(lhs, [vm, ['0'], ...tail]) });
    return parts;
  }
  const long = node.k >= 4;
  const expansion = node.terms.map((t, n) => coefTeX(t, n === 0) + vmat(t.sub.B));
  const values = node.terms.map((t, n) => valueTermTeX(t, n === 0));
  const products = node.terms.filter(t => !L.zeroP(t.value)).map((t, n) => joinMonos(monos(t.value), n > 0));
  parts.push({ p: lineText(node) });
  if (node.k === 3) {      // the 2 × 2 minors are worked out in the same display
    const brackets = node.terms.map((t, n) => `${coefTeX(t, n === 0)}\\left[${twoTeX(t.sub.B)}\\right]`);
    brackets.long = brackets.length > 2;     // the widest row: one term per row
    parts.push({ m: rows(lhs, [vm, expansion, brackets, values, products.length ? products : ['0'], value, ...tail]) });
    return parts;
  }
  parts.push({ m: rows(lhs, [vm, expansion], long) });
  const size = `\\(${node.k - 1} \\times ${node.k - 1}\\)`;
  if (depth < maxDepth) {
    parts.push({ p: `The ${size} determinants, each expanded by cofactors in the same way:` });
    node.terms.forEach(t => parts.push({
      summary: `Entry \\((${t.i + 1}, ${t.j + 1})\\): delete row ${t.i + 1} and column ${t.j + 1}`,
      open: depth === 0,
      parts: derive(t.sub, vmat(t.sub.B), false, depth + 1, maxDepth),
    }));
  } else {
    parts.push({ p: `The ${size} determinants:` });
    node.terms.forEach(t => parts.push({ m: rows(vmat(t.sub.B), [[polyTeX(t.sub.value)]]) }));
    parts.push({ note: 'They are expanded by cofactors in the same way; that would be too many steps to show here.' });
  }
  parts.push({ p: 'Putting in their values:' });
  parts.push({ m: rows(top ? lhs : '', [values, products.length ? products : ['0'], value, ...tail], long) });
  return parts;
}
const partsHTML = (ps, narrow) => ps.map(x => (x.m != null ? disp(`\\begin{aligned} ${rowsTeX(x.m, narrow)} \\end{aligned}`)
  : x.summary ? details(x.summary, partsHTML(x.parts, narrow), x.open)
  : `<p${x.note ? ' class="tl-muted"' : ''}>${x.p || x.note}</p>`)).join('');
const partsTeX = ps => ps.map(x => (x.m != null ? `\\begin{align*}\n${rowsTeX(x.m, false)}\n\\end{align*}`
  : x.summary ? `\\medskip\\noindent ${x.summary}\n\n${partsTeX(x.parts)}`
  : `${x.p || x.note}\n`)).join('\n');

function charPolySteps(M, ev) {
  const n = M.length, tree = L.cofactorTree(L.charMatrix(M));
  const factored = ev.factors.length > 1 || ev.factors.some(f => f.mult > 1);
  const parts = [];
  if (n >= 3) parts.push({ p: 'Cofactor expansion along row \\(i\\): \\(\\det B = \\sum_{j} (-1)^{i+j}\\, b_{ij} \\det B_{ij}\\), where \\(B_{ij}\\) is \\(B\\) with row \\(i\\) and column \\(j\\) deleted; down a column it is the same with the roles of \\(i\\) and \\(j\\) exchanged. A row or column with many zeros saves work.' });
  parts.push(...derive(tree, '\\det(A - \\lambda I)', true, 0, shownDepth(tree), factored ? [[factoredTeX(ev)]] : []));
  const mult = k => (k === 2 ? ' (a double root)' : k === 3 ? ' (a triple root)' : k > 3 ? ` (a root of multiplicity ${k})` : '');
  const roots = ev.values.map(v => `\\(\\lambda ${v.exact ? '=' : '\\approx'} ${lamTeX(v)}\\)${mult(v.alg)}`);
  parts.push({ p: `The eigenvalues are the roots of this polynomial: ${roots.length > 1 ? `${roots.slice(0, -1).join(', ')} and ${roots[roots.length - 1]}` : roots[0]}.` });
  return { html: partsHTML(parts, NARROW.matches), tex: partsTeX(parts), value: tree.value };
}

function opEigen(M, diagonalize) {
  needSquare(M, diagonalize ? 'Diagonalization' : 'Eigenvalues');
  if (M.length > MAX_EIGEN) throw new Error(`For eigenvalues, please use at most ${MAX_EIGEN} × ${MAX_EIGEN}.`);
  const ev = L.eigen(M), n = M.length;
  ev.values.forEach(v => { if (v.exact) v.shown = v.basis.map(cleared); });
  const sign = n % 2 ? -1 : 1;
  let html = '';
  const poly = disp(`\\det(A - \\lambda I) = ${L.texPoly(ev.p, sign)}${ev.factors.length > 1 || ev.factors.some(f => f.mult > 1) ? ` = ${factoredTeX(ev)}` : ''}`);
  const rows = ev.values.map(v => `<tr><td>\\(${v.exact ? '' : '\\approx '}${lamTeX(v)}\\)</td><td>${v.alg}</td><td>${v.geo == null ? '?' : v.geo}</td><td>${v.exact ? `\\(${vecList(v.shown)}\\)` : '<span class="tl-muted">only approximate</span>'}</td></tr>`).join('');
  const table = `<div class="la-table"><table><thead><tr><th>Eigenvalue \\(\\lambda\\)</th><th>Algebraic multiplicity</th><th>Geometric multiplicity</th><th>Basis of the eigenspace</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  const notes = ['The eigenvectors are scaled to clear fractions; any nonzero multiple of an eigenvector is again an eigenvector.'];
  if (!ev.allExact) notes.push('Some eigenvalues are roots of a polynomial that does not factor over the rationals into factors of degree 1 or 2, so they are shown only approximately.');
  if (!ev.allReal) notes.push('Complex eigenvalues of a real matrix come in conjugate pairs, and so do their eigenvectors.');
  if (!diagonalize) {
    html += block('Characteristic polynomial', poly);
    html += block('Eigenvalues and eigenvectors', table + notes.map(t => `<p class="tl-muted">${esc(t)}</p>`).join(''));
  } else {
    html += block('Characteristic polynomial', poly + table);
  }
  // diagonalization
  let verdict, pdTeX = '';
  const bad = ev.values.find(v => v.geo != null && v.geo < v.alg);
  if (bad) verdict = `<p><b>A is not diagonalizable.</b> For \\(\\lambda = ${lamTeX(bad)}\\) the algebraic multiplicity is ${bad.alg} but the eigenspace has dimension only ${bad.geo}, so A does not have ${n} linearly independent eigenvectors.</p>`;
  else if (ev.diagonalizable === null) verdict = '<p>Some eigenvalues are repeated and known only approximately, so diagonalizability is not decided here.</p>';
  else {
    const over = ev.allReal ? '' : ' over \\(\\mathbb{C}\\), but not over \\(\\mathbb{R}\\) (some eigenvalues are not real)';
    verdict = `<p><b>A is diagonalizable${over}.</b> ${ev.values.every(v => v.alg === 1) ? `It has ${n} distinct eigenvalues.` : 'For every eigenvalue the eigenspace has dimension equal to its multiplicity.'}</p>`;
    if (ev.allExact) {
      const cols = [], lams = [];
      ev.values.forEach(v => v.shown.forEach(b => { cols.push(b); lams.push(v.value); }));
      const P = cols[0].map((_, i) => cols.map(c => c[i]));
      const D = lams.map((l, i) => lams.map((_, j) => (i === j ? l : L.Q.ZERO)));
      pdTeX = `\\[ A = PDP^{-1}, \\qquad P = ${L.texMatrix(P)}, \\quad D = ${L.texMatrix(D)} \\]`;
      verdict += disp(`A = PDP^{-1}, \\qquad P = ${L.texMatrix(P)}, \\quad D = ${L.texMatrix(D)}`) +
        '<p class="tl-muted">The columns of P are the eigenvectors above, in the same order as the eigenvalues on the diagonal of D.</p>';
    }
  }
  if (diagonalize || bad || ev.diagonalizable !== null) html += block(diagonalize ? 'Diagonalization' : 'Is A diagonalizable?', verdict);
  const cp = charPolySteps(M, ev);
  if (showSteps()) {
    const per = ev.values.filter(v => v.exact && v.steps).map(v => details(`\\(\\lambda = ${lamTeX(v)}\\): solve \\((A - \\lambda I)x = 0\\)`,
      disp(`A - (${lamTeX(v)})I = ${L.texMatrix(L.minusLambda(v.field ? L.toField(M, v.field) : M, v.value))}`) +
      stepsHTML(v.steps.steps, null) + `<p>Basis of the eigenspace:</p>` + disp(`\\left\\{ ${vecList(v.basis)} \\right\\}`), false));
    html += block('Steps', `<p>The eigenvalues are the roots of the characteristic polynomial \\(\\det(A - \\lambda I)\\).</p>` +
      details('The characteristic polynomial \\(\\det(A - \\lambda I)\\), by cofactor expansion', cp.html, true) +
      `<p>For each eigenvalue, the eigenvectors are the nonzero solutions of \\((A - \\lambda I)x = 0\\):</p>` + per.join(''));
  }
  tex = [`% det(A - \\lambda I) = ${L.texPoly(ev.p, sign)}`, `% eigenvalues: ${ev.values.map(lamTeX).join(', ')}`, '% The characteristic polynomial, by cofactor expansion', cp.tex];
  if (pdTeX) tex.push(pdTeX);
  return html;
}

// ---------------------------------------------------------------- run
const OPS = {
  ref: M => opEchelon(M, false),
  rref: M => opEchelon(M, true),
  rank: M => opRank(M),
  solve: (M, bar) => opSolve(M, bar),
  inverse: M => opInverse(M),
  det: M => opDet(M),
  eigen: M => opEigen(M, false),
  diag: M => opEigen(M, true),
};
const TITLES = { ref: 'Row echelon form', rref: 'Reduced row echelon form', rank: 'Rank, column space and row space', solve: 'Solving the system', inverse: 'Inverse', det: 'Determinant', eigen: 'Eigenvalues and eigenvectors', diag: 'Diagonalization' };

function run(op, scroll = true) {
  if (!parsed) return;
  const { M, bar } = parsed;
  const A = bar >= 0 && op !== 'solve' ? M.map(r => r.slice(0, bar)) : M;
  let html;
  try {
    html = OPS[op](A, op === 'solve' ? bar : -1);
    if (bar >= 0 && op !== 'solve') html = '<p class="tl-muted">The column after “|” is ignored here; only A is used.</p>' + html;
  } catch (e) {
    html = `<p class="tl-status" data-kind="error">${esc(e.message || e)}</p>`;
    tex = [];
  }
  document.querySelectorAll('[data-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.op === op)));
  $('la-title').textContent = TITLES[op];
  $('la-output').innerHTML = html;
  $('la-result').hidden = false;
  $('la-copy').hidden = $('la-copy-typst').hidden = !tex.length;
  typeset($('la-output'));
  if (scroll) $('la-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function typeset(el) {
  const mj = window.MathJax;
  if (mj && mj.startup && mj.startup.promise && mj.typesetPromise) mj.startup.promise.then(() => mj.typesetPromise([el])).catch(() => {});
}

const PAGE = 'https://prasadsachchidanand.github.io/miscellaneous/linear-algebra-calculator/';
function copyTeX(typst) {
  const text = typst
    ? `// Linear algebra calculator, ${PAGE}\n${documentToTypst(tex.join('\n'))}\n`
    : `% Linear algebra calculator, ${PAGE}\n% Needs \\usepackage{amsmath}\n${tex.join('\n')}\n`;
  const b = $(typst ? 'la-copy-typst' : 'la-copy');
  const done = () => { const old = b.innerHTML; b.innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { b.innerHTML = old; }, 1500); };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => {});
}

function start() {
  let t;
  $('la-input').addEventListener('input', () => { clearTimeout(t); t = setTimeout(readMatrix, 250); });
  $('la-example').addEventListener('change', e => { if (EXAMPLES[e.target.value]) { $('la-input').value = EXAMPLES[e.target.value]; readMatrix(); } e.target.value = ''; });
  document.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => run(b.dataset.op)));
  $('la-copy').addEventListener('click', () => copyTeX(false));
  $('la-copy-typst').addEventListener('click', () => copyTeX(true));
  $('la-steps').addEventListener('change', () => { const on = document.querySelector('[data-op][aria-pressed="true"]'); if (on) run(on.dataset.op); });
  // the eigenvalue steps are laid out for the width of the screen: lay them out again when it changes
  NARROW.addEventListener('change', () => { const on = document.querySelector('[data-op][aria-pressed="true"]'); if (on && /^(eigen|diag)$/.test(on.dataset.op)) run(on.dataset.op, false); });
  readMatrix();
}

start();
