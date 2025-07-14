import { supabase } from "../lib/supabase";
import { getPlayersByLeague } from "./getPlayersByLeague";

type AddScoresCourse = {
  id: string;
  course_name: string;
};

type AddScoresPlayer = {
  id: string;
  name: string;
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
    // Get courses from RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_add_scores_data",
      {
        league_id: leagueId,
      }
    );

    if (rpcError) {
      console.error("Error fetching from RPC:", rpcError);
    }

    // Get players using the working getPlayersByLeague function
    const playersData = await getPlayersByLeague(leagueId);

    // Transform players data to match the expected format
    const players: AddScoresPlayer[] = playersData.map((player: any) => ({
      id: player.player_id,
      name: player.name,
      avatar_url: player.avatar_url || "",
    }));

    // Use courses from RPC if available, otherwise get them directly
    let courses: AddScoresCourse[] = [];
    if (rpcData?.courses) {
      courses = rpcData.courses;
    } else {
      // Fallback: get courses directly from the database
      const { data: coursesData, error: coursesError } = await supabase
        .from("golf_courses")
        .select("id, course_name")
        .order("course_name");

      if (coursesError) {
        console.error("Error fetching courses:", coursesError);
        return null;
      }

      courses = coursesData || [];
    }

    return {
      courses,
      players,
    };
  } catch (error) {
    console.error("Error in getAddScoresData:", error);
    return null;
  }
}
