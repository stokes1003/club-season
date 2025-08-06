import { supabase } from "../../lib/supabase";

export const getPlayers = async (leagueId: string) => {
  const { data: players, error: playersError } = await supabase
    .from("league_players")
    .select(
      "id, display_name, avatar_url, player_color, invite_email, net_points, gross_points"
    )
    .eq("league_id", leagueId);

  if (playersError) {
    console.error("Error fetching players:", playersError);
    return null;
  }

  return players;
};
