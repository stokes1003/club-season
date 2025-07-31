import { supabase } from "../lib/supabase";

type AddScoresCourse = {
  id: string;
  course_name: string;
};

type AddScoresPlayer = {
  id: string;
  display_name: string;
  avatar_url: string;
};

type AddScoresData = {
  courses: AddScoresCourse[];
  players: AddScoresPlayer[];
};

export async function getAddScoresData(
  leagueId: string
): Promise<AddScoresData | null> {
  try {
    // Get players directly from league_players table
    const { data: playersData, error: playersError } = await supabase
      .from("league_players")
      .select("id, display_name, avatar_url")
      .eq("league_id", leagueId);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      return null;
    }

    console.log("Raw players data from DB:", playersData);

    // Transform players data to match the expected format and remove duplicates
    const uniquePlayers = (playersData || []).filter(
      (player: any, index: number, self: any[]) =>
        index === self.findIndex((p: any) => p.id === player.id)
    );

    const players: AddScoresPlayer[] = uniquePlayers.map((player: any) => ({
      id: player.id,
      display_name: player.display_name || "Unknown Player",
      avatar_url: player.avatar_url || "",
    }));

    // Return empty courses array since we're using external golf API
    const courses: AddScoresCourse[] = [];

    return {
      courses,
      players,
    };
  } catch (error) {
    console.error("Error in getAddScoresData:", error);
    return null;
  }
}
