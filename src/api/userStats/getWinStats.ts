import { supabase } from "../../lib/supabase";

export const getWinStats = async (userId: string) => {
  // First get player IDs for this user
  const { data: playerIds, error: playerError } = await supabase
    .from("league_players")
    .select("id")
    .eq("user_id", userId);

  if (playerError || !playerIds) {
    console.error("Error fetching player IDs:", playerError?.message);
    return { net_wins: 0, gross_wins: 0 };
  }

  const playerIdArray = playerIds.map((p) => p.id);

  // Get all round scores for this user
  const { data: roundScores, error } = await supabase
    .from("round_scores")
    .select("net_score, gross_score, round_id, league_player_id")
    .in("league_player_id", playerIdArray);

  if (error || !roundScores) {
    console.error("Error fetching round scores:", error?.message);
    return { net_wins: 0, gross_wins: 0 };
  }

  // Group scores by round to calculate wins
  const roundGroups = roundScores.reduce(
    (groups, score) => {
      const roundId = score.round_id;
      if (!groups[roundId]) {
        groups[roundId] = [];
      }
      groups[roundId].push(score);
      return groups;
    },
    {} as Record<string, typeof roundScores>
  );

  let netWins = 0;
  let grossWins = 0;

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

  return { net_wins: netWins, gross_wins: grossWins };
};
