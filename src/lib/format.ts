/** Date, countdown and calendar helpers. No data is invented here — every value comes from the row. */

const DAY = new Intl.DateTimeFormat("en-IN", { day: "2-digit" });
const MONTH = new Intl.DateTimeFormat("en-IN", { month: "short" });
const WEEKDAY = new Intl.DateTimeFormat("en-IN", { weekday: "long" });
const TIME = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const FULL = new Intl.DateTimeFormat("en-IN", {
  weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit",
});

export const dayNumber = (iso: string) => DAY.format(new Date(iso));
export const monthShort = (iso: string) => MONTH.format(new Date(iso)).toUpperCase();
export const weekday = (iso: string) => WEEKDAY.format(new Date(iso));
export const clockTime = (iso: string) => TIME.format(new Date(iso));
export const fullDate = (iso: string) => FULL.format(new Date(iso));

/** "in 3 days", "tomorrow", "in 4 hours" — rounded the way a person would say it. */
export function countdown(iso: string, now = new Date()): string {
  const ms = new Date(iso).getTime() - now.getTime();
  if (ms <= 0) return "happening now";
  const hours = Math.round(ms / 3_600_000);
  if (hours < 1) return `in ${Math.max(1, Math.round(ms / 60_000))} minutes`;
  if (hours < 24) return `in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  const days = Math.round(hours / 24);
  if (days === 1) return "tomorrow";
  if (days < 14) return `in ${days} days`;
  const weeks = Math.round(days / 7);
  return `in ${weeks} ${weeks === 1 ? "week" : "weeks"}`;
}

/** Seats are a raw count, so the label is qualitative rather than a fabricated percentage. */
export function seatsTone(seatsLeft: number): { label: string; tone: "open" | "filling" | "closed" } {
  if (seatsLeft <= 0) return { label: "Fully booked", tone: "closed" };
  if (seatsLeft <= 40) return { label: `${seatsLeft} seats left`, tone: "filling" };
  return { label: `${seatsLeft} seats left`, tone: "open" };
}

/** A real Google Calendar link built from the event's own fields; assumes a two-hour slot. */
export function calendarUrl(title: string, venue: string, startsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + 2 * 3_600_000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    location: venue,
    dates: `${stamp(start)}/${stamp(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
