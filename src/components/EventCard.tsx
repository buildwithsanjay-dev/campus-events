import type { CampusEvent } from "../lib/events";
import { clockTime, countdown, dayNumber, monthShort, seatsTone, weekday } from "../lib/format";
import { ArrowIcon, PinIcon, SeatIcon } from "./icons";

interface Props {
  event: CampusEvent;
  featured?: boolean;
  onOpen: (event: CampusEvent) => void;
}

export default function EventCard({ event, featured = false, onOpen }: Props) {
  const seats = seatsTone(event.seats_left);

  return (
    <button
      type="button"
      className={featured ? "event event--featured" : "event"}
      onClick={() => onOpen(event)}
      aria-haspopup="dialog"
      aria-label={`${event.title}, ${weekday(event.starts_at)} at ${clockTime(event.starts_at)}, ${event.venue}. View details`}
    >
      <time className="event__date" dateTime={event.starts_at}>
        <span className="event__day">{dayNumber(event.starts_at)}</span>
        <span className="event__month">{monthShort(event.starts_at)}</span>
      </time>

      <span className="event__body">
        {featured && <span className="event__flag">Happening next</span>}
        <span className="event__title">{event.title}</span>
        <span className="event__meta">
          <span className="event__metaitem"><PinIcon /> {event.venue}</span>
          <span className="event__metaitem">
            {weekday(event.starts_at)}, {clockTime(event.starts_at)}
          </span>
          <span className="event__when">{countdown(event.starts_at)}</span>
        </span>
      </span>

      <span className="event__aside">
        <span className={`seats seats--${seats.tone}`}>
          <SeatIcon /> {seats.label}
        </span>
        <span className="event__go" aria-hidden="true">
          Details <ArrowIcon />
        </span>
      </span>
    </button>
  );
}
