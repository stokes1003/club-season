import { supabase } from "../../lib/supabase";

export const getScoresForRounds = async (roundIds: string[]) => {
  const { data, error } = await supabase
    .from("round_scores")
    .select(
      `
      round_id,
      league_player_id,
      gross_score,
      handicap,
      net_score
    `
    )
    .in("round_id", roundIds);

  if (error) {
    console.error("Error fetching scores:", error.message);
    return null;
  }

  const scoresByRound = new Map();
  data?.forEach((score) => {
    if (!scoresByRound.has(score.round_id)) {
      scoresByRound.set(score.round_id, []);
    }
    scoresByRound.get(score.round_id).push(score);
  });

  return scoresByRound;
};
