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
    console.log("Fetching player data for user:", user.id);
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select(
        `
            id,
            name,
            avatar_url,
            player_color,
            league_players (
              league_id,
              leagues (
                id,
                name,
                created_by,
                image_url,
                avatar_color,
                created_at
              )
            )
          `
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (playerError) {
      console.error("Error fetching player profile:", playerError);

      // If multiple rows found, get the first one
      if (playerError.code === "PGRST116") {
        console.log("Multiple rows found, fetching first player...");
        const { data: firstPlayer, error: firstPlayerError } = await supabase
          .from("players")
          .select(
            `
            id,
            name,
            avatar_url,
            player_color,
            league_players (
              league_id,
              leagues (
                id,
                name,
                created_by,
                image_url,
                created_at
              )
            )
          `
          )
          .eq("user_id", user.id)
          .limit(1)
          .single();

        console.log("First player query result:", {
          firstPlayer,
          firstPlayerError,
        });

        if (firstPlayerError) {
          console.error("Error fetching first player:", firstPlayerError);
          return {
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            player_color: "#6B7280",
          };
        }

        const leagues = firstPlayer.league_players.map((lp: any) => ({
          id: lp.leagues.id,
          name: lp.leagues.name,
          isCreator: lp.leagues.created_by === user.id,
          image_url: lp.leagues.image_url,
          avatar_color: lp.leagues.avatar_color,
          created_at: lp.leagues.created_at,
          created_by: lp.leagues.created_by,
        }));

        return {
          id: user.id,
          email: user.email || null,
          player_id: firstPlayer.id,
          name: firstPlayer.name,
          avatar_url: firstPlayer.avatar_url,
          player_color: firstPlayer.player_color,
          leagues,
        };
      }

      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        player_color: "#6B7280",
      };
    }

    // Handle case where no player data is found
    if (!playerData) {
      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        player_color: "#6B7280",
      };
    }

    const leagues = playerData.league_players.map((lp: any) => ({
      id: lp.leagues.id,
      name: lp.leagues.name,
      isCreator: lp.leagues.created_by === user.id,
      image_url: lp.leagues.image_url,
      avatar_color: lp.leagues.avatar_color,
      created_at: lp.leagues.created_at,
      created_by: lp.leagues.created_by,
    }));

    return {
      id: user.id,
      email: user.email || null,
      player_id: playerData.id,
      name: playerData.name,
      avatar_url: playerData.avatar_url,
      player_color: playerData.player_color,
      leagues,
    };
  } catch (error) {
    console.error("Error accessing players table:", error);
    return {
      id: user.id,
      email: user.email || null,
      name: user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      player_color: "#6B7280",
    };
  }
}
