import { supabase } from "../lib/supabase";

export async function getUserStats(userId: string) {
  // First get player IDs for this user
  const { data: playerIds, error: playerError } = await supabase
    .from("league_players")
    .select("id")
    .eq("user_id", userId);

  if (playerError) {
    console.error("Error fetching player IDs:", playerError.message);
    return null;
  }

  if (!playerIds || playerIds.length === 0) {
    return {
      rounds_played: 0,
      avg_net_score: 0,
      best_net_score: 0,
      avg_gross_score: 0,
      best_gross_score: 0,
      net_wins: 0,
      gross_wins: 0,
    };
  }

  const playerIdArray = playerIds.map((p) => p.id);

  // Get all rounds and scores for this user
  const { data: roundScores, error } = await supabase
    .from("round_scores")
    .select(
      `
      net_score,
      gross_score,
      round_id,
      league_player_id,
      rounds!inner(league_id)
    `
    )
    .in("league_player_id", playerIdArray);

  if (error) {
    console.error("Error fetching user stats:", error.message);
    return null;
  }

  if (!roundScores || roundScores.length === 0) {
    return {
      rounds_played: 0,
      avg_net_score: 0,
      best_net_score: 0,
      avg_gross_score: 0,
      best_gross_score: 0,
      net_wins: 0,
      gross_wins: 0,
    };
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
  const bestNetScore = netScores.length > 0 ? Math.min(...netScores) : 0;

  const avgGrossScore =
    grossScores.length > 0
      ? Math.round(
          (grossScores.reduce((a, b) => a + b, 0) / grossScores.length) * 10
        ) / 10
      : 0;
  const bestGrossScore = grossScores.length > 0 ? Math.min(...grossScores) : 0;

  // Calculate wins - only count actual wins (no ties)
  let netWins = 0;
  let grossWins = 0;

  // Group scores by round to calculate wins
  const roundGroups = roundScores.reduce((groups, score) => {
    const roundId = score.round_id;
    if (!groups[roundId]) {
      groups[roundId] = [];
    }
    groups[roundId].push(score);
    return groups;
  }, {} as Record<string, typeof roundScores>);

  // Check each round for wins
  Object.values(roundGroups).forEach((roundScores) => {
    // Find the best net score in this round
    const bestNetScore = Math.min(
      ...roundScores.map((rs) => rs.net_score || Infinity)
    );
    const bestGrossScore = Math.min(
      ...roundScores.map((rs) => rs.gross_score || Infinity)
    );

    // Count how many players tied for the best score
    const netWinners = roundScores.filter(
      (rs) => rs.net_score === bestNetScore
    ).length;
    const grossWinners = roundScores.filter(
      (rs) => rs.gross_score === bestGrossScore
    ).length;

    // Check if our player won (and it's not a tie)
    const playerNetScore = roundScores.find((rs) =>
      playerIdArray.includes(rs.league_player_id)
    )?.net_score;
    const playerGrossScore = roundScores.find((rs) =>
      playerIdArray.includes(rs.league_player_id)
    )?.gross_score;

    if (playerNetScore === bestNetScore && netWinners === 1) {
      netWins++;
    }

    if (playerGrossScore === bestGrossScore && grossWinners === 1) {
      grossWins++;
    }
  });

  return {
    rounds_played: roundsPlayed,
    avg_net_score: avgNetScore,
    best_net_score: bestNetScore,
    avg_gross_score: avgGrossScore,
    best_gross_score: bestGrossScore,
    net_wins: netWins,
    gross_wins: grossWins,
  };
}
