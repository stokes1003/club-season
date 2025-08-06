import { supabase } from "../../lib/supabase";

export const getPlayerScores = async (leagueId: string) => {
  // Get all rounds for this league
  const { data: rounds, error: roundsError } = await supabase
    .from("rounds")
    .select("id")
    .eq("league_id", leagueId);

  if (roundsError) {
    console.error("Error fetching rounds:", roundsError);
    return null;
  }

  if (!rounds || rounds.length === 0) {
    return [];
  }

  const roundIds = rounds.map((r) => r.id);

  // Get all scores for all rounds in this league
  const { data: scores, error: scoresError } = await supabase
    .from("round_scores")
    .select("league_player_id, net_score, gross_score, round_id")
    .in("round_id", roundIds);

  if (scoresError) {
    console.error("Error fetching scores:", scoresError);
    return null;
  }

  return scores;
};
