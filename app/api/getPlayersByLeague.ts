import { createClient } from "@supabase/supabase-js";

const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export async function getPlayersByLeague(leagueId: string) {
  const { data, error } = await supabase.rpc("get_league_player_stats", {
    league_id: leagueId,
  });

  if (error) {
    console.error("Error fetching player stats from league:", error);
    return [];
  }

  return data;
}
