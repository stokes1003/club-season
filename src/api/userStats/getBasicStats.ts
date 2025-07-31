import { supabase } from "../../lib/supabase";

export const getBasicStats = async (userId: string) => {
  // First get player IDs for this user
  const { data: playerIds, error: playerError } = await supabase
    .from("league_players")
    .select("id")
    .eq("user_id", userId);

  if (playerError || !playerIds) {
    console.error("Error fetching player IDs:", playerError?.message);
    return null;
  }

  const playerIdArray = playerIds.map((p) => p.id);

  // Get all round scores for this user
  const { data: roundScores, error } = await supabase
    .from("round_scores")
    .select("net_score, gross_score")
    .in("league_player_id", playerIdArray);

  if (error || !roundScores) {
    console.error("Error fetching round scores:", error?.message);
    return null;
  }

  // Calculate basic stats
  const roundsPlayed = roundScores.length;
  const netScores = roundScores
    .map((rs) => rs.net_score)
    .filter((score) => score !== null);
  const grossScores = roundScores
    .map((rs) => rs.gross_score)
    .filter((score) => score !== null);

  const avgNetScore =
    netScores.length > 0
      ? Math.round(
          (netScores.reduce((a, b) => a + b, 0) / netScores.length) * 10
        ) / 10
      : 0;
  const avgGrossScore =
    grossScores.length > 0
      ? Math.round(
          (grossScores.reduce((a, b) => a + b, 0) / grossScores.length) * 10
        ) / 10
      : 0;

  return {
    rounds_played: roundsPlayed,
    avg_net_score: avgNetScore,
    avg_gross_score: avgGrossScore,
  };
};
