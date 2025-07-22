import { supabase } from "../lib/supabase";
import { User } from "../types/user";

export async function getUser(): Promise<User | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error:", authError);
    return null;
  }

  try {
    console.log("Fetching league membership for user:", user.id);

    const { data: leaguePlayers, error: lpError } = await supabase
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
      .eq("user_id", user.id);

    if (lpError) {
      console.error("Error fetching league_players:", lpError);
      return {
        id: user.id,
        email: user.email || null,
        name: user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        player_color: "#6B7280",
        leagues: [],
      };
    }

    const leagues = (leaguePlayers || []).map((lp: any) => ({
      id: lp.leagues.id,
      name: lp.leagues.name,
      isCreator: lp.leagues.created_by === user.id,
      image_url: lp.leagues.image_url,
      avatar_color: lp.leagues.avatar_color,
      created_at: lp.leagues.created_at,
      created_by: lp.leagues.created_by,
    }));

    const firstLeaguePlayer = leaguePlayers?.[0];

    return {
      id: user.id,
      email: user.email || null,
      name: user.user_metadata?.name || firstLeaguePlayer?.display_name || null,
      avatar_url:
        user.user_metadata?.avatar_url || firstLeaguePlayer?.avatar_url || null,
      player_color: firstLeaguePlayer?.player_color || "#6B7280",
      leagues,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      id: user.id,
      email: user.email || null,
      name: user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      player_color: "#6B7280",
      leagues: [],
    };
  }
}
