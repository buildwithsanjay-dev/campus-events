import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export interface CampusEvent {
  id: string;
  title: string;
  venue: string;
  starts_at: string;
  seats_left: number;
}

export async function fetchEvents(): Promise<CampusEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, venue, starts_at, seats_left")   // ← the line the bug will change
    .eq("is_published", true)
    .order("starts_at", { ascending: true });

  if (error) throw new Error(`Could not load events: ${error.message}`);
  return data ?? [];
}
