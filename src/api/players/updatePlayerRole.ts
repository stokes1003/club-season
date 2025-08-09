import { supabase } from "src/lib/supabase";

export const updatePlayerRole = async (playerId: string, role: string) => {
  const { data, error } = await supabase
    .from("league_players")
    .update({ player_role: role })
    .eq("id", playerId);

  if (error) {
    throw error;
  }

  return data;
};
