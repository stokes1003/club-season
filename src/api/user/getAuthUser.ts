import { supabase } from "../../lib/supabase";

export async function getAuthUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching auth user:", error);
    return null;
  }

  return user;
}
