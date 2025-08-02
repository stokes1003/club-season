import { supabase } from "../../lib/supabase";

type Score = {
  league_player_id: string;
  gross: number;
  hcp: number;
  net: number;
  gross_points: number;
  net_points: number;
};

export async function insertScores(round_id: string, scores: Score[]) {
  const { data, error } = await supabase
    .from("round_scores")
    .insert(
      scores.map((score) => ({
        round_id,
        league_player_id: score.league_player_id,
        gross_score: score.gross,
        handicap: score.hcp,
        net_score: score.net,
      }))
    )
    .select();

  if (error) {
    console.error("Error inserting scores:", error);
    return { success: false, error };
  }

  return { success: true, scores: data };
}
