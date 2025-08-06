import { supabase } from "src/lib/supabase";

export const getPlayerById = async (userId: string, leagueId: string) => {
  const { data, error } = await supabase
    .from("league_players")
    .select("display_name")
    .eq("user_id", userId)
    .eq("league_id", leagueId)
    .single();

  if (error) {
    console.error("Error fetching player:", error);
    return null;
  }

  return data?.display_name || null;
};
