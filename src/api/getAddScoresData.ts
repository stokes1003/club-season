import { supabase } from "../lib/supabase";

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
  console.log("Fetching add scores data for league:", leagueId);

  const { data, error } = await supabase.rpc("get_add_scores_data", {
    league_id: leagueId,
  });

  console.log("RPC response:", { data, error });

  if (error) {
    console.error("Error fetching add scores data:", error);
    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return null;
  }

  if (!data) {
    console.error("No data returned from RPC");
    return null;
  }

  console.log("RPC data received:", data);

  return {
    courses: data.courses || [],
    players: data.players || [],
  };
}
