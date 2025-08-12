import { supabase } from "src/lib/supabase";

export const linkUserToInvites = async (userEmail: string, userId: string) => {
  // First, check if there are any pending invites
  const { data: pendingInvites, error: checkError } = await supabase
    .from("league_players")
    .select("id, league_id")
    .eq("invite_email", userEmail.toLowerCase())
    .is("user_id", null);

  if (checkError) {
    throw checkError;
  }

  if (!pendingInvites || pendingInvites.length === 0) {
    return { claimedCount: 0, leagues: [] };
  }

  // Update the invites to link them to the user
  const { error: updateError } = await supabase
    .from("league_players")
    .update({ user_id: userId })
    .eq("invite_email", userEmail.toLowerCase())
    .is("user_id", null);

  if (updateError) {
    throw updateError;
  }

  return {
    claimedCount: pendingInvites.length,
    leagues: pendingInvites.map((invite) => invite.league_id),
  };
};
