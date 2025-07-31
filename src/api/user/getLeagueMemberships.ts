import { supabase } from "../../lib/supabase";

export async function getLeagueMemberships(userId: string) {
  const { data, error } = await supabase
    .from("league_players")
    .select(
      `
        id,
        display_name,
        avatar_url,
        player_color,
        league_id,
        leagues (
          id,
          name,
          created_by,
          image_url,
          avatar_color,
          created_at
        )
      `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching league memberships:", error);
    return null;
  }

  return data;
}
