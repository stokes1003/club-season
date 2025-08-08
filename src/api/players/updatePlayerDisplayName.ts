import { supabase } from "src/lib/supabase";

export async function updatePlayerDisplayName(
  playerId: string,
  displayName: string
) {
  const { data, error } = await supabase
    .from("league_players")
    .update({ display_name: displayName })
    .eq("id", playerId);

  if (error) {
    throw error;
  }

  return data;
}
