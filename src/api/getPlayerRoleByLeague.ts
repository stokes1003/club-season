import { supabase } from "src/lib/supabase";

export const getPlayerRoleByLeague = async (
  userId: string,
  leagueId: string
) => {
  const { data, error } = await supabase
    .from("league_players")
    .select("player_role")
    .eq("user_id", userId)
    .eq("league_id", leagueId);

  if (error) {
    console.error("Failed to get player role:", error);
    return null;
  }

  if (data && data.length > 0) {
    return data[0].player_role;
  }

  return null;
};
