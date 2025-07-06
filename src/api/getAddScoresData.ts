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
  const { data, error } = await supabase.rpc("get_add_scores_data", {
    league_id: leagueId,
  });

  if (error) {
    console.error("Error fetching add scores data:", error);
    return null;
  }

  return {
    courses: data.courses,
    players: data.players,
  };
}
