import { useEffect, useState } from "react";
import { fetchEvents, type CampusEvent } from "./lib/events";
import EventCard from "./components/EventCard";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; events: CampusEvent[] };

export default function App() {
  const [state, setState] = useState<State>({ status: "loading" });

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

  return (
    <main>
      <h1>Upcoming Campus Events</h1>
      {state.status === "loading" && <p className="loading">Loading events…</p>}
      {state.status === "error" && (
        <div className="error" role="alert">
          <h2>Unable to load events</h2>
          <p>{state.message}</p>
        </div>
      )}
      {state.status === "ready" && (
        <section className="grid">
          {state.events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </section>
      )}
    </main>
  );
}
