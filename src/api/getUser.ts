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
    // Get player info + league info
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select(
        `
        id,
        name,
        avatar_url,
        league_players (
          league_id,
          leagues (
            id,
            name,
            created_by
          )
        )
      `
      )
      .eq("user_id", user.id)
      .single();

    if (playerError) {
      console.error("Error fetching player profile:", playerError);
      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      };
    }

    const leagues = playerData.league_players.map((lp: any) => ({
      id: lp.leagues.id,
      name: lp.leagues.name,
      isCreator: lp.leagues.created_by === user.id,
    }));

    return {
      id: user.id,
      email: user.email || null,
      player_id: playerData.id,
      name: playerData.name,
      avatar_url: playerData.avatar_url,
      leagues,
    };
  } catch (error) {
    console.error("Error accessing players table:", error);
    return {
      id: user.id,
      email: user.email || null,
      name: user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    };
  }
}
