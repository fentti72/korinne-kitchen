// Checks WCAG AA contrast for every text/background pairing the site uses.
// Reads palette values from src/styles/tokens.css. Run: npm run check:contrast
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const color = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));

// [foreground, background, minimum ratio, where it's used]
// 4.5 = normal text, 3 = large text or non-text UI (focus rings, button edges).
const pairs = [
  ['espresso', 'flour', 4.5, 'body text and headings'],
  ['espresso', 'oat', 4.5, 'text on cards'],
  ['espresso-soft', 'flour', 4.5, 'secondary text'],
  ['espresso-soft', 'oat', 4.5, 'secondary text on cards'],
  ['accent', 'flour', 4.5, 'links on the page'],
  ['accent-dark', 'oat', 4.5, 'links on cards'],
  ['accent-dark', 'flour', 4.5, 'link hover on the page'],
  ['white', 'accent', 4.5, 'button text'],
  ['white', 'accent-dark', 4.5, 'button text on hover'],
  ['accent', 'flour', 3, 'focus ring and button edge on the page'],
  ['accent', 'oat', 3, 'focus ring and button edge on cards'],
  ['honey-ink', 'honey', 4.5, 'badge text'],
  ['sage-dark', 'sage-tint', 4.5, 'tag text'],
  ['flour', 'espresso', 4.5, 'text in dark sections'],
  ['oat', 'espresso', 4.5, 'secondary text in dark sections'],
  ['oat', 'espresso-soft', 4.5, 'photo placeholder text in dark sections'],
  ['flour', 'espresso', 3, 'focus ring in dark sections'],
  ['honey', 'espresso', 3, 'badge edge in dark sections'],
];

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = 0;
for (const [fg, bg, min, use] of pairs) {
  if (!color[fg] || !color[bg]) throw new Error(`Unknown token: ${color[fg] ? bg : fg}`);
  const r = ratio(color[fg], color[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1 (needs ${min})  ${fg} on ${bg}  — ${use}`);
}
if (failed) {
  console.error(`\n${failed} pairing(s) fail WCAG AA.`);
  process.exit(1);
}
console.log('\nAll pairings pass WCAG AA.');
