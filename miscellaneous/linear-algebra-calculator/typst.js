/*
 * LaTeX → Typst, for "Copy Typst" in the linear algebra calculator.
 *
 * Not a general converter: it knows what calculator.js and la-core.js write. That is matrices
 * (bmatrix, vmatrix, and array with a bar for [A | b]), \frac, \sqrt, \xrightarrow for row
 * operations, align* displays, % comments, and sentences with \( \) maths in them.
 * For example, \frac{1}{2}\begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix} becomes
 * frac(1, 2) mat(delim: "[", 1, 2; 3, 4).
 */

const SYMBOLS = {
  lambda: 'lambda', cdot: 'dot', times: 'times', det: 'det', to: '->', rightarrow: '->', leftrightarrow: '<->',
  approx: 'approx', quad: 'quad', qquad: 'wide', sum: 'sum', mid: 'bar.v', pm: 'plus.minus', mp: 'minus.plus',
  dots: 'dots', ldots: 'dots', cdots: 'dots.c', infty: 'infinity', ne: '!=', neq: '!=', le: '<=', leq: '<=',
  ge: '>=', geq: '>=', in: 'in', checkmark: 'checkmark', prime: 'prime',
  ',': 'thin', ':': 'med', ';': 'thick', '!': '', ' ': ' ', '{': '{', '}': '}', '|': 'bar.v.double',
};
const DELIMS = { bmatrix: '"["', pmatrix: '"("', vmatrix: '"|"', Vmatrix: '"||"', Bmatrix: '"{"', matrix: '#none' };

// Maths. ctx: 'align' (& and \\ make an aligned display) or 'matrix' (they separate entries and rows).
export function mathToTypst(src, ctx = 'align') {
  let i = 0;
  const ws = () => { while (i < src.length && /\s/.test(src[i])) i++; };
  const command = () => {                       // at a backslash: the command's name
    i++;
    const m = /^[a-zA-Z]+/.exec(src.slice(i));
    if (m) { i += m[0].length; return m[0]; }
    return src[i++];
  };
  const raw = () => {                           // {text}, unconverted
    ws();
    if (src[i] !== '{') return '';
    const j = src.indexOf('}', i);
    const s = src.slice(i + 1, j);
    i = j + 1;
    return s;
  };
  const group = c => {                          // the argument of a command, converted
    ws();
    if (src[i] === '{') { i++; const s = seq(c, '}'); i++; return s.trim(); }
    if (src[i] === '\\') return cmd(command(), c).trim();
    return src[i++];
  };
  const endEnv = () => { command(); raw(); };   // \end{...}

  function cmd(name, c) {
    switch (name) {
      case 'frac': { const a = group(null), b = group(null); return ` frac(${a}, ${b})`; }
      case 'sqrt': return ` sqrt(${group(null)})`;
      case 'xrightarrow': return ` stretch(->)^(${group(null)}) `;
      case 'text': case 'mathrm': case 'textrm': return ` "${raw()}" `;
      case 'operatorname': return ` op("${raw()}") `;
      case 'mathbb': { const l = raw(); return ` ${l}${l} `; }
      case 'boxed': return ` #box(stroke: 0.5pt, inset: 2pt, $${group(null)}$) `;
      case '\\': return c === 'matrix' ? '; ' : ' \\\n';
      case 'left': {
        ws();
        let open = src[i] === '\\' ? command() : src[i++];
        if (open === '.') open = '';
        const body = seq(c, 'right');
        command();                              // \right
        ws();
        let close = src[i] === '\\' ? command() : src[i++];
        if (close === '.') close = '';
        const m = /^\s*mat\(delim: #none, ([\s\S]*)\)\s*$/.exec(body);
        if (m && open === '[') return ` mat(delim: "[", ${m[1]}) `;
        return ` ${open}${body.trim()}${close} `;
      }
      case 'right': { ws(); if (src[i] === '\\') command(); else i++; return ''; }
      case 'begin': {
        const env = raw();
        if (env in DELIMS) { const body = seq('matrix', 'end'); endEnv(); return ` mat(delim: ${DELIMS[env]}, ${body.trim().replace(/;$/, '')}) `; }
        if (env === 'array') {
          const spec = raw().replace(/\s/g, ''), bar = spec.indexOf('|');
          const body = seq('matrix', 'end'); endEnv();
          return ` mat(delim: #none, ${bar > 0 ? `augment: #${bar}, ` : ''}${body.trim().replace(/;$/, '')}) `;
        }
        const body = seq('align', 'end'); endEnv();          // aligned, align*, …
        return ` ${body} `;
      }
      default: return ` ${name in SYMBOLS ? SYMBOLS[name] : name} `;
    }
  }

  // until a } (stop '}'), \end (stop 'end'), \right (stop 'right') or the end
  function seq(c, stop) {
    let out = '';
    while (i < src.length) {
      const ch = src[i];
      if (ch === '}' && stop === '}') break;
      if (ch === '\\') {
        const at = i, name = command();
        if ((name === 'end' && stop === 'end') || (name === 'right' && stop === 'right')) { i = at; break; }
        out += cmd(name, c);
      } else if (ch === '{') {
        i++;
        const g = seq(c, '}');
        i++;
        out += g.trim() ? g : ' "" ';         // {} : an empty atom, so that a minus after it is binary
      } else if (ch === '^' || ch === '_') {
        i++;
        const a = group(null);
        out = out.replace(/\s+$/, '') + ch + (a.length === 1 ? a : `(${a})`) + ' ';
      } else if (ch === '&') {
        i++;
        out += c === 'matrix' ? ', ' : '&';
      } else if (/[a-zA-Z]/.test(ch)) {          // xy in TeX is x times y; in Typst it would be one name
        let j = i;
        while (j < src.length && /[a-zA-Z]/.test(src[j])) j++;
        out += ` ${src.slice(i, j).split('').join(' ')} `;
        i = j;
      } else if (/\s/.test(ch)) {
        out += ' ';
        i++;
      } else {
        out += /["#$/]/.test(ch) ? '\\' + ch : ch;
        i++;
      }
    }
    return out;
  }

  return seq(ctx, null)
    .replace(/[ \t]+/g, ' ')
    .replace(/ ([\^_])/g, '$1')
    .replace(/\( /g, '(').replace(/ \)/g, ')').replace(/ ([,;])/g, '$1')
    .replace(/^ | $/gm, '');
}

// a % comment: readable text, not Typst maths
const commentToTypst = s => s
  .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a, b) => `${/\s/.test(a) ? `(${a})` : a}/${b}`)
  .replace(/\\sqrt\{([^{}]*)\}/g, '√$1').replace(/\\lambda/g, 'λ').replace(/\^\{([^{}]*)\}/g, '^$1')
  .replace(/\\([a-zA-Z]+)/g, '$1');

// a sentence: Typst markup, with $ $ for the maths in it
function textToTypst(s) {
  const out = [];
  let last = 0;
  for (const m of s.matchAll(/\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g)) {
    out.push(s.slice(last, m.index).replace(/[\\#$*_@<`~]/g, c => '\\' + c));
    out.push(m[1] != null ? `$ ${mathToTypst(m[1])} $` : `$${mathToTypst(m[2])}$`);
    last = m.index + m[0].length;
  }
  out.push(s.slice(last).replace(/[\\#$*_@<`~]/g, c => '\\' + c));
  return out.join('');
}

// The whole copied text: comments, align* displays, \[ \] displays and sentences
export function documentToTypst(tex) {
  const lines = tex.split('\n'), out = [];
  for (let k = 0; k < lines.length; k++) {
    const line = lines[k];
    if (/^\s*\\begin\{align\*?\}/.test(line)) {
      const body = [];
      for (k++; k < lines.length && !/^\s*\\end\{align\*?\}/.test(lines[k]); k++) body.push(lines[k]);
      out.push(`$ ${mathToTypst(body.join('\n'))} $`);
    } else if (/^\s*%/.test(line)) out.push(`// ${commentToTypst(line.replace(/^\s*%\s?/, ''))}`);
    else if (/^\\medskip\\noindent\s*/.test(line)) out.push(`*${textToTypst(line.replace(/^\\medskip\\noindent\s*/, ''))}*`);
    else out.push(textToTypst(line));
  }
  return out.join('\n');
}
