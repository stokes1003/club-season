import { supabase } from "../../lib/supabase";

export const getPlayersForScores = async (playerIds: string[]) => {
  const { data, error } = await supabase
    .from("league_players")
    .select("id, display_name, avatar_url, player_color")
    .in("id", playerIds);

  if (error) {
    console.error("Error fetching players:", error.message);
    return null;
  }

  return data;
};
