import { supabase } from "src/lib/supabase";

export const linkUserToInvites = async (userEmail: string, userId: string) => {
  const { data, error } = await supabase.rpc("claim_pending_invites", {
    user_email: userEmail.toLowerCase(),
    user_uuid: userId, // Changed from user_id to user_uuid
  });

  if (error) {
    throw error;
  }

  return data;
};
