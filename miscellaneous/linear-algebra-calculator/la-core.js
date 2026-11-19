/*
 * Exact linear algebra for the linear algebra calculator.
 *
 *  - Q:  fractions n/d with BigInt, so there are no rounding errors and no overflow.
 *  - QS: numbers x + y·√d (x, y fractions, d a square-free integer; d < 0 gives complex numbers),
 *        so eigenvalues such as 1 ± √2 or 1 ± i have exact eigenvectors.
 *  - Row reduction with the list of row operations; rank, null space, inverse, determinant;
 *    characteristic polynomial (Faddeev–LeVerrier), eigenvalues, eigenvectors and diagonalization.
 * Matrices are arrays of rows. Every function works over Q or QS through the same operations.
 */

// ---------------------------------------------------------------- fractions
const babs = x => (x < 0n ? -x : x);
const bgcd = (a, b) => { a = babs(a); b = babs(b); while (b) [a, b] = [b, a % b]; return a; };

export class Q {
  constructor(n, d = 1n) {
    if (d === 0n) throw new Error('division by zero');
    if (d < 0n) { n = -n; d = -d; }
    const g = bgcd(n, d) || 1n;
    this.n = n / g;
    this.d = d / g;
  }
  static int(k) { return new Q(BigInt(k)); }
  // "3", "-3/4", "0.25", "1e-3", "−2" (minus sign) all read exactly
  static parse(s) {
    const t = String(s).trim().replace(/[−–]/g, '-');
    let m = t.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
    if (m) {
      if (BigInt(m[2]) === 0n) throw new Error(`“${t}” divides by zero`);
      return new Q(BigInt(m[1]), BigInt(m[2]));
    }
    m = t.match(/^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/);
    if (m && (m[2] || m[3])) {
      const frac = m[3] || '';
      let n = BigInt((m[2] || '0') + frac) * (m[1] === '-' ? -1n : 1n);
      let d = 10n ** BigInt(frac.length);
      const e = m[4] ? parseInt(m[4], 10) : 0;
      if (e > 0) n *= 10n ** BigInt(e); else if (e < 0) d *= 10n ** BigInt(-e);
      return new Q(n, d);
    }
    throw new Error(`“${t}” is not a number`);
  }
  add(b) { return new Q(this.n * b.d + b.n * this.d, this.d * b.d); }
  sub(b) { return new Q(this.n * b.d - b.n * this.d, this.d * b.d); }
  mul(b) { return new Q(this.n * b.n, this.d * b.d); }
  div(b) { if (b.n === 0n) throw new Error('division by zero'); return new Q(this.n * b.d, this.d * b.n); }
  neg() { return new Q(-this.n, this.d); }
  inv() { return Q.ONE.div(this); }
  isZero() { return this.n === 0n; }
  isOne() { return this.n === 1n && this.d === 1n; }
  isInt() { return this.d === 1n; }
  eq(b) { return b instanceof Q && this.n === b.n && this.d === b.d; }
  sign() { return this.n > 0n ? 1 : this.n < 0n ? -1 : 0; }
  num() { return Number(this.n) / Number(this.d); }
  isSum() { return false; }
  toTeX() {
    if (this.d === 1n) return this.n.toString();
    return `${this.n < 0n ? '-' : ''}\\frac{${babs(this.n)}}{${this.d}}`;
  }
  toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
}
Q.ZERO = new Q(0n);
Q.ONE = new Q(1n);
export const QF = { zero: () => Q.ZERO, one: () => Q.ONE, of: q => q, name: 'Q' };

// ---------------------------------------------------------------- x + y√d
function squareFree(n) {            // n = s² · k with k square-free; returns [s, k] (BigInt)
  let sign = n < 0n ? -1n : 1n, k = babs(n), s = 1n;
  for (let p = 2n; p * p <= k; p += (p === 2n ? 1n : 2n)) {
    while (k % (p * p) === 0n) { k /= p * p; s *= p; }
    if (p > 100000n) break;         // enough for the numbers of a classroom matrix
  }
  return [s, sign * k];
}

export class QS {
  constructor(x, y, d) { this.x = x; this.y = y; this.d = d; }   // x, y: Q; d: BigInt
  static field(d) {
    return { zero: () => new QS(Q.ZERO, Q.ZERO, d), one: () => new QS(Q.ONE, Q.ZERO, d), of: q => new QS(q, Q.ZERO, d), name: 'QS', d };
  }
  add(b) { return new QS(this.x.add(b.x), this.y.add(b.y), this.d); }
  sub(b) { return new QS(this.x.sub(b.x), this.y.sub(b.y), this.d); }
  mul(b) {
    const D = new Q(this.d);
    return new QS(this.x.mul(b.x).add(this.y.mul(b.y).mul(D)), this.x.mul(b.y).add(this.y.mul(b.x)), this.d);
  }
  div(b) {
    const D = new Q(this.d);
    const norm = b.x.mul(b.x).sub(b.y.mul(b.y).mul(D));      // never 0 for b ≠ 0, as d is not a square
    if (norm.isZero()) throw new Error('division by zero');
    const t = this.mul(new QS(b.x, b.y.neg(), this.d));
    return new QS(t.x.div(norm), t.y.div(norm), this.d);
  }
  neg() { return new QS(this.x.neg(), this.y.neg(), this.d); }
  inv() { return new QS(Q.ONE, Q.ZERO, this.d).div(this); }
  conj() { return new QS(this.x, this.y.neg(), this.d); }
  isZero() { return this.x.isZero() && this.y.isZero(); }
  isOne() { return this.x.isOne() && this.y.isZero(); }
  eq(b) { return b instanceof QS && this.x.eq(b.x) && this.y.eq(b.y) && this.d === b.d; }
  isSum() { return !this.x.isZero() && !this.y.isZero(); }
  num() {                              // [re, im]
    const r = Math.sqrt(Math.abs(Number(this.d)));
    return this.d > 0n ? [this.x.num() + this.y.num() * r, 0] : [this.x.num(), this.y.num() * r];
  }
  // 1 + √2, \frac{1 + \sqrt{5}}{2}, -\frac{\sqrt{3}}{2}, \frac{1 - i\sqrt{3}}{2}: one fraction bar over both parts
  toTeX() {
    if (this.y.isZero()) return this.x.toTeX();
    const ad = babs(this.d);
    const root = this.d > 0n ? `\\sqrt{${ad}}` : (ad === 1n ? 'i' : `i\\sqrt{${ad}}`);
    const L = this.x.d * this.y.d / bgcd(this.x.d, this.y.d);       // common denominator
    const a = this.x.n * (L / this.x.d), b = this.y.n * (L / this.y.d);
    const coef = babs(b) === 1n ? '' : babs(b).toString();
    let top;
    if (a === 0n) {
      top = `${coef}${root}`;
      return (b < 0n ? '-' : '') + (L === 1n ? top : `\\frac{${top}}{${L}}`);
    }
    top = `${a} ${b < 0n ? '-' : '+'} ${coef}${root}`;
    return L === 1n ? top : `\\frac{${top}}{${L}}`;
  }
}

// ---------------------------------------------------------------- matrices
export const parseMatrix = text => {
  const rows = String(text).trim().split(/\s*(?:\n|;)\s*/).filter(r => r.trim());
  if (!rows.length) throw new Error('Type a matrix first.');
  let bar = -1;
  const M = rows.map((r, i) => {
    const parts = r.split('|');
    if (parts.length > 2) throw new Error(`Row ${i + 1} has more than one “|”.`);
    const cells = parts.map(p => p.trim().split(/[\s,]+/).filter(Boolean));
    const here = parts.length === 2 ? cells[0].length : -1;
    if (i === 0) bar = here; else if (here !== bar) throw new Error('Put the “|” in the same place in every row, or in none.');
    return cells.flat().map(c => { try { return Q.parse(c); } catch (e) { throw new Error(`Row ${i + 1}: ${e.message}`); } });
  });
  const n = M[0].length;
  M.forEach((r, i) => { if (r.length !== n) throw new Error(`Row ${i + 1} has ${r.length} entries, but row 1 has ${n}.`); });
  return { M, bar };                  // bar: number of columns before “|”, or -1
};

export const identity = (n, F = QF) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? F.one() : F.zero())));
export const toField = (M, F) => M.map(r => r.map(v => (v instanceof Q && F.name === 'QS' ? F.of(v) : v)));
export const matMul = (A, B) => A.map(row => B[0].map((_, j) => row.reduce((s, v, k) => s.add(v.mul(B[k][j])), row[0].sub(row[0]))));
export const minusLambda = (A, lam) => A.map((row, i) => row.map((v, j) => (i === j ? v.sub(lam) : v)));
const snap = A => A.map(r => r.slice());

// coefficient in a row operation: "3", "\frac{1}{2}", "(1 + \sqrt{2})"
const factorTeX = f => (f.isSum() ? `\\left(${f.toTeX()}\\right)` : f.toTeX());
function addRowTeX(i, f, r) {                      // R_i -> R_i - f R_r
  const neg = f instanceof Q ? f.sign() < 0 : (!f.isSum() && (f.x.sign() < 0 || (f.x.isZero() && f.y.sign() < 0)));
  const a = neg ? f.neg() : f;
  const c = a.isOne() ? '' : factorTeX(a);
  return `R_{${i + 1}} \\to R_{${i + 1}} ${neg ? '+' : '-'} ${c}R_{${r + 1}}`;
}
const isUnit = v => v.isOne() || v.neg().isOne();

// Gaussian elimination. Forward phase: echelon form. With reduced: leading 1s and zeros above them.
// cols: how many columns may hold pivots (for [A | b] or [A | I]).
export function rowReduce(M, { reduced = true, cols, F = QF } = {}) {
  const A = snap(M);
  const m = A.length, n = cols == null ? A[0].length : cols;
  const steps = [], pivots = [];
  let r = 0, swaps = 0;
  for (let c = 0; c < n && r < m; c++) {
    let p = -1;
    for (let i = r; i < m; i++) {
      if (A[i][c].isZero()) continue;
      if (p === -1) p = i;
      if (isUnit(A[i][c])) { p = i; break; }     // a pivot ±1 keeps the numbers simple
    }
    if (p === -1) continue;
    if (p !== r) { [A[p], A[r]] = [A[r], A[p]]; swaps++; steps.push({ op: `R_{${r + 1}} \\leftrightarrow R_{${p + 1}}`, M: snap(A) }); }
    for (let i = r + 1; i < m; i++) {
      if (A[i][c].isZero()) continue;
      const f = A[i][c].div(A[r][c]);
      A[i] = A[i].map((v, j) => v.sub(f.mul(A[r][j])));
      steps.push({ op: addRowTeX(i, f, r), M: snap(A) });
    }
    pivots.push([r, c]);
    r++;
  }
  const forward = steps.length;
  if (reduced) {
    for (let k = pivots.length - 1; k >= 0; k--) {
      const [pr, pc] = pivots[k];
      if (!A[pr][pc].isOne()) {
        const s = F.one().div(A[pr][pc]);
        A[pr] = A[pr].map(v => v.mul(s));
        steps.push({ op: `R_{${pr + 1}} \\to ${factorTeX(s)}\\,R_{${pr + 1}}`, M: snap(A) });
      }
      for (let i = pr - 1; i >= 0; i--) {
        if (A[i][pc].isZero()) continue;
        const f = A[i][pc];
        A[i] = A[i].map((v, j) => v.sub(f.mul(A[pr][j])));
        steps.push({ op: addRowTeX(i, f, pr), M: snap(A) });
      }
    }
  }
  return { A, steps, pivots, swaps, forward };
}

export function rank(M) {
  const { A, steps, pivots } = rowReduce(M, { reduced: false });
  return { rank: pivots.length, A, steps, pivots };
}

// Basis of {x : Mx = 0}, from the reduced echelon form
export function nullSpace(M, F = QF) {
  const { A, steps, pivots } = rowReduce(M, { reduced: true, F });
  const n = M[0].length;
  const pivotCols = new Set(pivots.map(p => p[1]));
  const free = [...Array(n).keys()].filter(j => !pivotCols.has(j));
  const basis = free.map(f => {
    const v = Array.from({ length: n }, () => F.zero());
    v[f] = F.one();
    pivots.forEach(([r, c]) => { v[c] = A[r][f].neg(); });
    return v;
  });
  return { R: A, steps, pivots, free, basis };
}

// Solve [A | b]
export function solve(Aug, cols) {
  const { A, steps, pivots } = rowReduce(Aug, { reduced: true, cols });
  const n = cols;
  const consistent = !A.some(row => row.slice(0, n).every(v => v.isZero()) && !row[n].isZero());
  if (!consistent) return { consistent, R: A, steps, pivots };
  const pivotCols = new Set(pivots.map(p => p[1]));
  const free = [...Array(n).keys()].filter(j => !pivotCols.has(j));
  const particular = Array.from({ length: n }, () => Q.ZERO);
  pivots.forEach(([r, c]) => { particular[c] = A[r][n]; });
  const basis = free.map(f => {
    const v = Array.from({ length: n }, () => Q.ZERO);
    v[f] = Q.ONE;
    pivots.forEach(([r, c]) => { v[c] = A[r][f].neg(); });
    return v;
  });
  return { consistent, R: A, steps, pivots, free, particular, basis };
}

export function inverse(M) {
  const n = M.length;
  const aug = M.map((row, i) => [...row, ...identity(n)[i]]);
  const { A, steps, pivots } = rowReduce(aug, { reduced: true, cols: n });
  if (pivots.length < n) return { invertible: false, R: A, steps, rank: pivots.length };
  return { invertible: true, inv: A.map(r => r.slice(n)), R: A, steps };
}

// Determinant from the echelon form: (-1)^(row swaps) times the product of the diagonal
export function determinant(M) {
  const { A, steps, swaps, pivots } = rowReduce(M, { reduced: false });
  let d = swaps % 2 ? Q.ONE.neg() : Q.ONE;
  for (let i = 0; i < M.length; i++) d = d.mul(A[i][i]);
  return { det: d, U: A, steps, swaps, rank: pivots.length };
}

// ---------------------------------------------------------------- polynomials over Q (coefficients low → high)
const trimP = p => { const q = p.slice(); while (q.length > 1 && q[q.length - 1].isZero()) q.pop(); return q; };
const degree = p => trimP(p).length - 1;
const evalP = (p, x) => p.reduceRight((acc, c) => acc.mul(x).add(c), Q.ZERO);
function divmod(a, b) {                       // a = q·b + r with deg r < deg b
  a = trimP(a); b = trimP(b);
  const db = b.length - 1, lead = b[db];
  if (db === 0 && lead.isZero()) throw new Error('division by the zero polynomial');
  const r = a.slice();
  const q = Array.from({ length: Math.max(1, a.length - db) }, () => Q.ZERO);
  for (let k = a.length - 1 - db; k >= 0; k--) {
    const f = r[k + db].div(lead);
    q[k] = f;
    if (!f.isZero()) for (let i = 0; i <= db; i++) r[i + k] = r[i + k].sub(f.mul(b[i]));
  }
  return [trimP(q), trimP(db === 0 ? [Q.ZERO] : r.slice(0, db))];
}
const isZeroP = p => trimP(p).every(c => c.isZero());
const monic = p => { const t = trimP(p); const l = t[t.length - 1]; return t.map(c => c.div(l)); };
function gcdP(a, b) { a = trimP(a); b = trimP(b); while (!isZeroP(b)) { const [, r] = divmod(a, b); a = b; b = r; } return monic(a); }
const derivP = p => (p.length <= 1 ? [Q.ZERO] : p.slice(1).map((c, i) => c.mul(Q.int(i + 1))));
const divides = (b, a) => isZeroP(divmod(a, b)[1]);
function multiplicity(p, f) { let k = 0, q = trimP(p); while (degree(q) >= degree(f) && divides(f, q)) { q = divmod(q, f)[0]; k++; } return [k, q]; }

// numeric roots (Durand–Kerner) of a polynomial with simple roots
function numericRoots(p) {
  const c = monic(p).map(x => x.num()), n = c.length - 1;
  if (n < 1) return [];
  const ev = z => { let re = 1, im = 0; for (let i = n - 1; i >= 0; i--) { const nr = re * z[0] - im * z[1] + c[i], ni = re * z[1] + im * z[0]; re = nr; im = ni; } return [re, im]; };
  const bound = 1 + Math.max(...c.slice(0, n).map(Math.abs));
  let z = Array.from({ length: n }, (_, k) => [bound * Math.cos(2 * Math.PI * k / n + 0.4), bound * Math.sin(2 * Math.PI * k / n + 0.4)]);
  for (let it = 0; it < 2000; it++) {
    let move = 0;
    z = z.map((zi, i) => {
      let den = [1, 0];
      z.forEach((zj, j) => { if (i !== j) { const a = zi[0] - zj[0], b = zi[1] - zj[1]; den = [den[0] * a - den[1] * b, den[0] * b + den[1] * a]; } });
      const f = ev(zi), m2 = den[0] * den[0] + den[1] * den[1] || 1e-300;
      const d = [(f[0] * den[0] + f[1] * den[1]) / m2, (f[1] * den[0] - f[0] * den[1]) / m2];
      move = Math.max(move, Math.hypot(d[0], d[1]));
      return [zi[0] - d[0], zi[1] - d[1]];
    });
    if (move < 1e-14 * bound) break;
  }
  return z;
}
// the fraction with denominator ≤ maxDen closest to x (continued fractions)
function toFraction(x, maxDen = 100000) {
  if (!isFinite(x)) return null;
  let h0 = 0, h1 = 1, k0 = 1, k1 = 0, v = x;
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(v), h2 = a * h1 + h0, k2 = a * k1 + k0;
    if (k2 > maxDen) break;
    h0 = h1; h1 = h2; k0 = k1; k1 = k2;
    if (Math.abs(v - a) < 1e-12) break;
    v = 1 / (v - a);
  }
  return new Q(BigInt(h1), BigInt(k1));
}

// Characteristic polynomial det(xI − A), low → high (Faddeev–LeVerrier, exact)
export function charPoly(A) {
  const n = A.length;
  const c = Array(n + 1).fill(Q.ZERO);
  c[n] = Q.ONE;
  let M = A.map(r => r.map(() => Q.ZERO));
  for (let k = 1; k <= n; k++) {
    M = matMul(A, M).map((row, i) => row.map((v, j) => (i === j ? v.add(c[n - k + 1]) : v)));
    const AM = matMul(A, M);
    let tr = Q.ZERO;
    for (let i = 0; i < n; i++) tr = tr.add(AM[i][i]);
    c[n - k] = tr.div(Q.int(k)).neg();
  }
  return c;
}

// Factor the characteristic polynomial over Q: linear factors, quadratic factors (roots x ± y√d)
// and what is left (roots only approximately)
export function factorCharPoly(p) {
  const factors = [];          // { kind: 'linear', root } | { kind: 'quadratic', b, c, roots: [QS, QS], d } | { kind: 'other', poly, approx }
  let rest = trimP(p);
  const squareFreePart = divmod(rest, gcdP(rest, derivP(rest)))[0];
  let s = monic(squareFreePart);
  // rational roots
  for (const z of numericRoots(s)) {
    if (Math.abs(z[1]) > 1e-6 * (1 + Math.abs(z[0]))) continue;
    const r = toFraction(z[0]);
    if (!r || !evalP(s, r).isZero()) continue;
    const lin = [r.neg(), Q.ONE];
    const [k, q] = multiplicity(rest, lin);
    if (k) { factors.push({ kind: 'linear', root: r, mult: k }); rest = q; s = divmod(s, lin)[0]; }
  }
  // quadratic factors with rational coefficients
  const tryQuad = (b, c) => {
    const quad = [c, b, Q.ONE];
    if (degree(s) < 2 || !divides(quad, s)) return false;
    const [k, q] = multiplicity(rest, quad);
    if (!k) return false;
    rest = q; s = divmod(s, quad)[0];
    const D = b.mul(b).sub(c.mul(Q.int(4)));             // roots (-b ± √D)/2
    const [sq, d] = squareFree(D.n * D.d);              // √D = √(n·d)/d = sq·√d' / d
    const y = new Q(sq, D.d).div(Q.int(2)), x = b.neg().div(Q.int(2));
    if (d === 1n) {                                       // the roots are rational after all
      factors.push({ kind: 'linear', root: x.add(y), mult: k }, { kind: 'linear', root: x.sub(y), mult: k });
      return true;
    }
    factors.push({ kind: 'quadratic', b, c, d, mult: k, roots: [new QS(x, y, d), new QS(x, y.neg(), d)] });
    return true;
  };
  let changed = true;
  while (changed && degree(s) >= 2) {
    changed = false;
    const z = numericRoots(s);
    outer: for (let i = 0; i < z.length; i++) for (let j = i + 1; j < z.length; j++) {
      const sum = z[i][0] + z[j][0], sumIm = z[i][1] + z[j][1];
      const prodRe = z[i][0] * z[j][0] - z[i][1] * z[j][1], prodIm = z[i][0] * z[j][1] + z[i][1] * z[j][0];
      if (Math.abs(sumIm) > 1e-6 || Math.abs(prodIm) > 1e-6) continue;
      const b = toFraction(-sum), c = toFraction(prodRe);
      if (b && c && tryQuad(b, c)) { changed = true; break outer; }
    }
  }
  if (degree(rest) >= 1) {
    const sf = monic(divmod(rest, gcdP(rest, derivP(rest)))[0]);
    const [k] = multiplicity(rest, sf);
    factors.push({ kind: 'other', poly: sf, mult: k, approx: numericRoots(sf) });
  }
  return factors;
}

// ---------------------------------------------------------------- eigenvalues and eigenvectors
export function eigen(A) {
  const n = A.length;
  const p = charPoly(A);
  const factors = factorCharPoly(p);
  const values = [];       // { value (Q or QS), tex, alg, geo, basis, field, real, exact }
  factors.forEach(f => {
    if (f.kind === 'linear') {
      const ns = nullSpace(minusLambda(A, f.root));
      values.push({ value: f.root, alg: f.mult, geo: ns.basis.length, basis: ns.basis, steps: ns, real: true, exact: true });
    } else if (f.kind === 'quadratic') {
      const F = QS.field(f.d);
      const AF = toField(A, F);
      f.roots.forEach(root => {
        const ns = nullSpace(minusLambda(AF, root), F);
        values.push({ value: root, alg: f.mult, geo: ns.basis.length, basis: ns.basis, steps: ns, real: f.d > 0n, exact: true, field: F });
      });
    } else {
      f.approx.forEach(z => values.push({ approx: z, alg: f.mult, geo: f.mult === 1 ? 1 : null, real: Math.abs(z[1]) < 1e-9, exact: false }));
    }
  });
  const sum = values.reduce((s, v) => s + v.alg, 0);
  const allExact = values.every(v => v.exact);
  const geoKnown = values.every(v => v.geo != null);
  const diagonalizable = geoKnown ? values.every(v => v.geo === v.alg) : null;
  const allReal = values.every(v => v.real);
  return { p, factors, values, n, check: sum === n, allExact, diagonalizable, allReal };
}

// A v = λ v for each eigenvector (a self-check used by the tests)
export function verifyEigen(A, ev) {
  return ev.values.filter(v => v.exact).every(v => {
    const AF = v.field ? toField(A, v.field) : A;
    return v.basis.every(x => {
      const Ax = AF.map(row => row.reduce((s, a, j) => s.add(a.mul(x[j])), v.field ? v.field.zero() : Q.ZERO));
      return Ax.every((y, i) => y.sub(v.value.mul(x[i])).isZero());
    });
  });
}

// ---------------------------------------------------------------- TeX
export const texMatrix = (M, bar = -1) => {
  if (bar >= 0) {
    const spec = 'c'.repeat(bar) + '|' + 'c'.repeat(M[0].length - bar);
    return `\\left[\\begin{array}{${spec}}${M.map(r => r.map(v => v.toTeX()).join(' & ')).join(' \\\\ ')}\\end{array}\\right]`;
  }
  return `\\begin{bmatrix}${M.map(r => r.map(v => v.toTeX()).join(' & ')).join(' \\\\ ')}\\end{bmatrix}`;
};
export const texVector = v => `\\begin{bmatrix}${v.map(x => x.toTeX()).join(' \\\\ ')}\\end{bmatrix}`;

// characteristic polynomial det(A − λI) = (−1)^n det(λI − A), expanded
export function texPoly(p, sign = 1, x = '\\lambda') {
  const terms = [];
  for (let k = p.length - 1; k >= 0; k--) {
    let c = sign < 0 ? p[k].neg() : p[k];
    if (c.isZero()) continue;
    const neg = c.sign() < 0, a = neg ? c.neg() : c;
    const pow = k === 0 ? '' : k === 1 ? x : `${x}^{${k}}`;
    const coef = k > 0 && a.isOne() ? '' : a.toTeX();
    terms.push({ neg, body: coef + pow });
  }
  if (!terms.length) return '0';
  return terms.map((t, i) => (i === 0 ? (t.neg ? '-' : '') + t.body : `${t.neg ? '-' : '+'} ${t.body}`)).join(' ');
}

// numbers given only approximately: 1.2599 or 0.5 + 0.866i
export function texApprox(z) {
  const f = x => (Math.abs(x) < 5e-13 ? '0' : x.toFixed(4).replace(/\.?0+$/, ''));
  if (Math.abs(z[1]) < 1e-9) return `\\approx ${f(z[0])}`;
  return `\\approx ${f(z[0])} ${z[1] < 0 ? '-' : '+'} ${f(Math.abs(z[1]))}i`;
}
