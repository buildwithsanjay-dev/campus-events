import { useEffect, useState } from "react";
import { fetchEvents, type CampusEvent } from "./lib/events";
import EventCard from "./components/EventCard";
import EventDialog from "./components/EventDialog";
import { AlertIcon } from "./components/icons";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; events: CampusEvent[] };

const MONTH_YEAR = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

export default function App() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [selected, setSelected] = useState<CampusEvent | null>(null);

  useEffect(() => {
    fetchEvents()
      .then((events) => setState({ status: "ready", events }))
      .catch((err: unknown) => {
        console.error(err);
        setState({
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      });
  }, []);

  const [featured, ...rest] = state.status === "ready" ? state.events : [];

  return (
    <div className="page">
      <header className="masthead">
        <p className="masthead__month">{MONTH_YEAR.format(new Date())}</p>
        <h1 className="masthead__title">
          What&rsquo;s on<span className="masthead__dot">.</span>
        </h1>
        <p className="masthead__lede">
          Every talk, workshop and hackathon happening on campus. Tap an event for the full details.
        </p>
      </header>

      <main className="feed">
        {state.status === "loading" && (
          <div className="skeletons" aria-live="polite" aria-busy="true">
            <span className="sr-only">Loading events</span>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="skeleton__date" />
                <div className="skeleton__lines">
                  <div className="skeleton__line skeleton__line--title" />
                  <div className="skeleton__line" />
                </div>
              </div>
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="failure" role="alert">
            <span className="failure__icon"><AlertIcon size={22} /></span>
            <div>
              <h2 className="failure__title">Unable to load events</h2>
              <p className="failure__detail">{state.message}</p>
              <p className="failure__hint">
                The events list could not be read. Try again in a moment — if it keeps failing, the
                site team has been alerted.
              </p>
            </div>
          </div>
        )}

        {state.status === "ready" && state.events.length === 0 && (
          <div className="empty">
            <h2>Nothing scheduled yet</h2>
            <p>No events are published for the coming weeks. Check back after the next notice goes up.</p>
          </div>
        )}

        {state.status === "ready" && state.events.length > 0 && (
          <>
            <EventCard event={featured} featured onOpen={setSelected} />
            {rest.length > 0 && (
              <>
                <h2 className="feed__heading">Later this term</h2>
                <ul className="list">
                  {rest.map((event, i) => (
                    <li key={event.id} style={{ animationDelay: `${80 + i * 70}ms` }}>
                      <EventCard event={event} onOpen={setSelected} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>Campus Events · published by the Students&rsquo; Council</p>
      </footer>

      <EventDialog event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
