import { supabase } from "src/lib/supabase";

export const getLeagueScores = async (roundId: string) => {
  const { data, error } = await supabase
    .from("round_scores")
    .select("id, league_player_id, gross_score, net_score, handicap")
    .eq("round_id", roundId);

  if (error) {
    console.error("Error fetching league scores:", error);
    return null;
  }

  return data;
};
