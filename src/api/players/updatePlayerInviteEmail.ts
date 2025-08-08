import { supabase } from "src/lib/supabase";

export async function updatePlayerInviteEmail(
  playerId: string,
  inviteEmail: string
) {
  const { data, error } = await supabase
    .from("league_players")
    .update({ invite_email: inviteEmail })
    .eq("id", playerId);

  if (error) {
    throw error;
  }

  return data;
}
