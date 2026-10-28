import { useEffect, useRef } from "react";
import type { CampusEvent } from "../lib/events";
import { calendarUrl, clockTime, countdown, fullDate, seatsTone } from "../lib/format";
import { CalendarIcon, ClockIcon, CloseIcon, PinIcon, SeatIcon } from "./icons";

interface Props {
  event: CampusEvent | null;
  onClose: () => void;
}

/** Native <dialog>: the browser gives focus trapping, Escape and inertness for free. */
export default function EventDialog({ event, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (event && !dialog.open) dialog.showModal();
    if (!event && dialog.open) dialog.close();
  }, [event]);

  if (!event) return <dialog ref={ref} className="sheet" onClose={onClose} />;

  const seats = seatsTone(event.seats_left);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(e) => {
        // clicking the backdrop, not the panel, closes
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="sheet__panel">
        <button type="button" className="sheet__close" onClick={onClose} aria-label="Close details">
          <CloseIcon />
        </button>

        <p className="sheet__when">{countdown(event.starts_at)}</p>
        <h2 id="sheet-title" className="sheet__title">{event.title}</h2>

        <dl className="sheet__facts">
          <div className="fact">
            <dt><ClockIcon /> Starts</dt>
            <dd>{fullDate(event.starts_at)}</dd>
          </div>
          <div className="fact">
            <dt><PinIcon /> Venue</dt>
            <dd>{event.venue}</dd>
          </div>
          <div className="fact">
            <dt><SeatIcon /> Availability</dt>
            <dd className={`seats seats--${seats.tone}`}>{seats.label}</dd>
          </div>
        </dl>

        <p className="sheet__note">
          Doors open fifteen minutes before {clockTime(event.starts_at)}. Entry is free for students
          with a valid ID card.
        </p>

        <div className="sheet__actions">
          <a
            className="button button--primary"
            href={calendarUrl(event.title, event.venue, event.starts_at)}
            target="_blank"
            rel="noreferrer"
          >
            <CalendarIcon /> Add to calendar
          </a>
          <button type="button" className="button" onClick={onClose}>Back to events</button>
        </div>
      </div>
    </dialog>
  );
}
