// Formats recipe amounts for display: kitchen fractions (½, ⅓, ¼, ⅛) instead of decimals,
// small amounts in spoons instead of cups, and singular/plural words that match the amount.
// Shared by the page build and the servings control in the browser.

const EIGHTHS: [number, string][] = [
  [0, ''],
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [3 / 8, '⅜'],
  [1 / 2, '½'],
  [5 / 8, '⅝'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
  [7 / 8, '⅞'],
  [1, ''],
];

// Spoons only come in ¼, ½ and whole (plus ⅛ tsp), so odd eighths read as unmeasurable.
const SPOON: [number, string][] = [
  [0, ''],
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 2, '½'],
  [3 / 4, '¾'],
  [1, ''],
];

function fraction(n: number, steps: [number, string][]): string {
  if (n >= 10) return String(Math.round(n));
  let whole = Math.floor(n);
  const rest = n - whole;
  let [value, glyph] = steps.reduce((best, f) => (Math.abs(f[0] - rest) < Math.abs(best[0] - rest) ? f : best));
  if (value === 1) whole += 1;
  // Never round a real amount down to nothing.
  if (whole === 0 && !glyph) glyph = '⅛';
  return [whole || '', glyph].filter(Boolean).join(' ');
}

const isSpoon = (unit: string) => /^(tsp|tbsp|teaspoons?|tablespoons?)$/i.test(unit);

export function formatAmount(n: number, unit = ''): string {
  return fraction(n, isSpoon(unit) ? SPOON : EIGHTHS);
}

/** Converts tiny amounts to a smaller measure: under ¼ cup becomes tablespoons, under 1 tbsp becomes teaspoons. */
export function convert(n: number, unit: string): { n: number; unit: string } {
  if (/^cups?$/i.test(unit) && n < 0.25) return convert(n * 16, 'tbsp');
  if (/^tbsp$/i.test(unit) && n < 1) return { n: n * 3, unit: 'tsp' };
  return { n, unit };
}

const SINGULAR: Record<string, string> = { cups: 'cup', cloves: 'clove', pounds: 'pound', sticks: 'stick' };
const PLURAL: Record<string, string> = Object.fromEntries(Object.entries(SINGULAR).map(([p, s]) => [s, p]));

/** Matches "cup"/"cups" to the amount; abbreviations like tbsp and tsp stay as they are. */
export function formatUnit(unit: string, n: number): string {
  if (!unit) return '';
  return n > 1 ? (PLURAL[unit] ?? unit) : (SINGULAR[unit] ?? unit);
}

/**
 * For counted ingredients with no unit ("2 eggs"), makes the noun agree with the scaled amount:
 * "eggs" becomes "egg" at 1, "onion" becomes "onions" above 1. Only the last word before any comma changes.
 */
export function formatItem(item: string, unit: string, original: number | undefined, n: number | undefined): string {
  if (unit || original === undefined || n === undefined) return item;
  const wasPlural = original > 1;
  const isPlural = n > 1;
  if (wasPlural === isPlural) return item;
  const comma = item.indexOf(',');
  const head = comma === -1 ? item : item.slice(0, comma);
  const tail = comma === -1 ? '' : item.slice(comma);
  const changed = head.replace(/(\w+)$/, (w) => (isPlural ? pluralize(w) : singularize(w)));
  return changed + tail;
}

function pluralize(w: string) {
  return /(s|sh|ch|x)$/.test(w) ? `${w}es` : `${w}s`;
}

function singularize(w: string) {
  if (/(sh|ch|x)es$/.test(w)) return w.slice(0, -2);
  return /[^s]s$/.test(w) ? w.slice(0, -1) : w;
}

/** Everything the page shows for one ingredient at a given scale. */
export function describe(i: { amount?: number; unit: string; item: string }, scale = 1) {
  if (i.amount === undefined) return { qty: '', item: i.item };
  const { n, unit } = convert(i.amount * scale, i.unit);
  const qty = `${formatAmount(n, unit)} ${formatUnit(unit, n)}`.trim();
  return { qty, item: formatItem(i.item, i.unit, i.amount, i.amount * scale) };
}
