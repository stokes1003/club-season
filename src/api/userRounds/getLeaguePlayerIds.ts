import { supabase } from "../../lib/supabase";

export async function getLeaguePlayerIds(userId: string) {
  const { data: leaguePlayers, error: leaguePlayersError } = await supabase
    .from("league_players")
    .select("id, league_id")
    .eq("user_id", userId);

  if (leaguePlayersError || !leaguePlayers || leaguePlayers.length === 0) {
    return [];
  }

  return leaguePlayers.map((player) => player.id);
}
