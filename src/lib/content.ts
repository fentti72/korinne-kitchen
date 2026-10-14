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
