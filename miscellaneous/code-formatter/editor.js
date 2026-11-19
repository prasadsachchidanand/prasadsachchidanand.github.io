/*
 * The two code boxes of the code formatter. Each is a normal <textarea> (so typing, undo,
 * copying and phone keyboards work as usual) on top of a coloured copy of its text (syntax.js),
 * with line numbers on the left. The three layers use the same font and line height
 * (see .cf-editor in index.html), so they line up exactly.
 */
import { highlight } from './syntax.js';

export function makeEditor(textarea, getLang) {
  const box = textarea.closest('.cf-editor');
  const pre = box.querySelector('.cf-hl');
  const code = pre.querySelector('code');
  const gutter = box.querySelector('.cf-gutter');
  const nums = gutter.querySelector('.cf-nums');
  const mark = gutter.querySelector('.cf-mark');
  let frame = 0, lines = 0, marked = 0, markKind = 'error';

  const sync = () => {
    pre.scrollTop = textarea.scrollTop;
    pre.scrollLeft = textarea.scrollLeft;
    gutter.scrollTop = textarea.scrollTop;
  };
  const lineHeight = () => parseFloat(getComputedStyle(nums).lineHeight);

  function numbers() {
    const n = (textarea.value.match(/\n/g) || []).length + 1;
    if (n === lines) return;
    lines = n;
    const list = new Array(n);
    for (let i = 0; i < n; i++) list[i] = i + 1;
    nums.textContent = list.join('\n') + '\n';
  }
  function placeMark() {
    if (!marked || marked > lines) { mark.hidden = true; return; }
    const lh = lineHeight();
    mark.style.top = (parseFloat(getComputedStyle(nums).paddingTop) + (marked - 1) * lh) + 'px';
    mark.style.height = lh + 'px';
    mark.dataset.kind = markKind;
    mark.hidden = false;
  }
  function repaint() {
    frame = 0;
    code.innerHTML = highlight(textarea.value, getLang());
    numbers();
    placeMark();
    sync();
  }
  textarea.addEventListener('input', () => { if (!frame) frame = requestAnimationFrame(repaint); });
  textarea.addEventListener('scroll', sync);
  repaint();

  return {
    el: textarea,
    repaint,
    get value() { return textarea.value; },
    get lineCount() { return (textarea.value.match(/\n/g) || []).length + 1; },
    set(text) {
      textarea.value = text;
      textarea.setSelectionRange(0, 0);
      textarea.scrollTop = 0; textarea.scrollLeft = 0;
      repaint();
    },
    // mark one line in the margin: kind 'error' (red) or 'warn' (amber); 0 removes the mark
    mark(line, kind) { marked = line || 0; markKind = kind || 'error'; placeMark(); },
    // put the cursor at line:column and scroll there
    goTo(line, column) {
      const v = textarea.value;
      let pos = 0;
      for (let i = 1; i < line && pos !== -1; i++) pos = v.indexOf('\n', pos) + 1 || -1;
      if (pos === -1) pos = v.length;
      const end = v.indexOf('\n', pos);
      pos = Math.min(pos + Math.max(0, (column || 1) - 1), end === -1 ? v.length : end);
      textarea.focus({ preventScroll: true });
      textarea.setSelectionRange(pos, pos);
      textarea.scrollTop = Math.max(0, (line - 1) * lineHeight() - textarea.clientHeight / 3);
      sync();
    },
    // 'Line 3, column 7' for the cursor
    cursor() {
      const before = textarea.value.slice(0, textarea.selectionStart);
      const line = (before.match(/\n/g) || []).length + 1;
      return { line, column: before.length - before.lastIndexOf('\n') };
    },
  };
}

// Tab and Shift+Tab indent and unindent (the current line, or all selected lines), like a code
// editor. Pressing Esc first lets the next Tab leave the box, so keyboard users are never stuck.
export function enableTabIndent(textarea, getUnit) {
  let leave = false;
  textarea.addEventListener('blur', () => { leave = false; });
  textarea.addEventListener('keydown', e => {
    if (e.key === 'Escape') { leave = true; return; }
    if (e.key !== 'Tab') { if (e.key !== 'Shift') leave = false; return; }
    if (leave || e.ctrlKey || e.metaKey || e.altKey) { leave = false; return; }
    e.preventDefault();
    const unit = getUnit();
    const v = textarea.value, s = textarea.selectionStart, end = textarea.selectionEnd;
    if (s === end && !e.shiftKey) { insert(textarea, unit); return; }
    const from = v.lastIndexOf('\n', s - 1) + 1;
    const last = end > s && v[end - 1] === '\n' ? end - 1 : end;   // a selection ending at a line start
    const stopAt = v.indexOf('\n', last);
    const to = stopAt === -1 ? v.length : stopAt;
    const width = unit === '\t' ? 4 : unit.length;
    const block = v.slice(from, to).split('\n').map(l => {
      if (!e.shiftKey) return unit + l;
      if (l.startsWith('\t')) return l.slice(1);
      return l.replace(new RegExp(`^ {1,${width}}`), '');
    }).join('\n');
    textarea.setSelectionRange(from, to);
    insert(textarea, block);
    textarea.setSelectionRange(from, from + block.length);
  });
}

// Insert text at the cursor through the browser's editing, so that Ctrl+Z undoes it
function insert(textarea, text) {
  let done = false;
  try { done = document.execCommand('insertText', false, text); } catch (e) { done = false; }
  if (!done) {
    textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, 'end');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
