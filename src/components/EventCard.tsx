import type { CampusEvent } from "../lib/events";

const formatter = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export default function EventCard({ event }: { event: CampusEvent }) {
  return (
    <article className="card">
      <h2>{event.title}</h2>
      <p className="venue">📍 {event.venue}</p>
      <p className="when">🗓 {formatter.format(new Date(event.starts_at))}</p>
      <p className="seats">{event.seats_left} seats left</p>
    </article>
  );
}
