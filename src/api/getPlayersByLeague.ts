import { supabase } from "../lib/supabase";

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
