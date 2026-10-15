import { getCollection } from 'astro:content';

export const TZ = 'America/Chicago';

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...opts });

export const formatDay = (d: Date) => fmt({ weekday: 'short', month: 'short', day: 'numeric' }).format(d);
export const formatTime = (d: Date) => fmt({ hour: 'numeric', minute: '2-digit' }).format(d);
// Post dates have no time of day (stored as UTC midnight), so format them in UTC to avoid showing the day before.
export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' }).format(d);

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h && `${h} hr`, m && `${m} min`].filter(Boolean).join(' ');
}

const live = <T extends { data: { draft?: boolean } }>(e: T) => import.meta.env.DEV || !e.data.draft;

export async function getPosts() {
  return (await getCollection('posts', live)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getUpcomingClasses(now = new Date()) {
  return (await getCollection('classes', live))
    .filter((c) => c.data.start > now)
    .sort((a, b) => a.data.start.valueOf() - b.data.start.valueOf());
}

/** The bake drop that is open now, or else the next one to open, or else the most recent. */
export async function getCurrentBake(now = new Date()) {
  const bakes = (await getCollection('bakes', live)).sort(
    (a, b) => a.data.ordersOpen.valueOf() - b.data.ordersOpen.valueOf(),
  );
  return (
    bakes.find((b) => b.data.ordersOpen <= now && now < b.data.ordersClose) ??
    bakes.find((b) => b.data.ordersOpen > now) ??
    bakes.at(-1)
  );
}

/** Seat status for a class: the number left and the badge to show, if any. */
export function seatStatus(c: { seats: number; seatsLeft?: number }) {
  const left = c.seatsLeft ?? c.seats;
  const badge = left === 0 ? 'Sold out' : left <= 3 ? `${left} seat${left === 1 ? '' : 's'} left` : undefined;
  return { left, soldOut: left === 0, badge };
}

export async function getGallery() {
  return (await getCollection('gallery')).sort((a, b) => a.data.order - b.data.order);
}

/** Stock status for a bake drop item. */
export function itemStatus(i: { quantity: number; left?: number }) {
  const left = i.left ?? i.quantity;
  const badge = left === 0 ? 'Sold out' : left <= 3 ? `Only ${left} left` : undefined;
  return { left, soldOut: left === 0, badge };
}

export async function getPolicies(group: 'classes' | 'bake') {
  return (await getCollection('policies', (p) => p.data.group === group)).sort((a, b) => a.data.order - b.data.order);
}

/** Every tag in use, most-used first. */
export function getAllTags(posts: { data: { tags: string[] } }[]) {
  const counts = new Map<string, number>();
  posts.forEach((p) => p.data.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}

export async function getRecipes() {
  return (await getCollection('recipes', live)).sort((a, b) => a.data.title.localeCompare(b.data.title));
}
