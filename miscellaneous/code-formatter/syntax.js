/*
 * Syntax colours for the code formatter (used by editor.js). Prism (vendor/prism, loaded by
 * index.html) has rules for LaTeX and HTML; the BibTeX and Typst rules below are written here.
 * They are approximate: the colours are a reading aid.
 */
const P = window.Prism;

if (P) {
  P.languages.bibtex = {
    'comment': /%.*/,
    // the citation key first: its rule needs to see the "@article{" in front of it
    'class-name': { pattern: /(@[a-zA-Z]+\s*[{(]\s*)[^\s,{}()=]+(?=\s*,)/, lookbehind: true },
    'keyword': /@[a-zA-Z]+/,                                                   // @article
    'attr-name': /\b[a-zA-Z][\w:.+-]*(?=\s*=)/,                               // field name
    'string': [
      { pattern: /(=\s*)\{(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*\}/, lookbehind: true, greedy: true },
      { pattern: /"(?:[^"\\{}]|\\.|\{(?:[^{}]|\{[^{}]*\})*\})*"/, greedy: true },
    ],
    'number': /\b\d+\b/,
    'operator': /[=#]/,
    'punctuation': /[{}(),]/,
  };

  P.languages.typst = {
    'comment': [
      { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
      { pattern: /(^|[^:\\])\/\/.*/, lookbehind: true, greedy: true },     // not the // in https://
    ],
    'string': [
      { pattern: /```[\s\S]*?```|`[^`\n]*`/, greedy: true },              // raw text
      { pattern: /"(?:\\.|[^"\\\n])*"/, greedy: true },
    ],
    'equation': { pattern: /\$(?:\\[\s\S]|[^\\$])*\$/, greedy: true },
    'title': { pattern: /^[ \t]*=+(?=[ \t]).*/m },                         // = Heading
    'keyword': /#(?:let|set|show|import|include|if|else|for|while|return|break|continue|context)\b/,
    'attr-name': [
      { pattern: /<[\w:.-]+>/ },                                           // <label>
      { pattern: /@[\w:.-]+/ },                                            // @reference
      { pattern: /([(,]\s*)[a-zA-Z_][\w-]*(?=\s*:)/, lookbehind: true },   // named argument
    ],
    'function': /#?[a-zA-Z_][\w-]*(?=[[(])|#[a-zA-Z_][\w.-]*/,
    'number': /\b\d+(?:\.\d+)?(?:pt|mm|cm|in|em|fr|deg|rad|%)/,
    'punctuation': /[{}[\]();,]/,
  };
}

const GRAMMAR = { latex: 'latex', bibtex: 'bibtex', typst: 'typst', html: 'markup' };
const MAX = 200000;   // beyond this many characters, skip the colours so typing stays fast

export const escapeHtml = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

// HTML for the coloured copy of `text`
export function highlight(text, lang) {
  const name = GRAMMAR[lang];
  let html;
  if (P && P.languages[name] && text.length <= MAX) {
    try { html = P.highlight(text, P.languages[name], name); } catch (e) { html = escapeHtml(text); }
  } else html = escapeHtml(text);
  // a final empty line has no height in <pre>; a space keeps it, so both layers end on the same line
  return text.endsWith('\n') || text === '' ? html + ' ' : html;
}
