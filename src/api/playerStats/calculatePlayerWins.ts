type PlayerScore = {
  league_player_id: string;
  net_score: number;
  gross_score: number;
  round_id: string;
};

export const calculatePlayerWins = (
  playerScores: PlayerScore[],
  playerId: string
) => {
  let netWins = 0;
  let grossWins = 0;

  // Group scores by round to calculate wins
  const roundGroups = playerScores.reduce((groups: any, score) => {
    const roundId = score.round_id;
    if (!groups[roundId]) {
      groups[roundId] = [];
    }
    groups[roundId].push(score);
    return groups;
  }, {});

  Object.values(roundGroups).forEach((roundScores: any) => {
    if (roundScores.length > 0) {
      // Find best net score in this round
      const bestNetScore = roundScores.reduce(
        (best: any, current: any) =>
          current.net_score < best.net_score ? current : best,
        roundScores[0]
      );

      // Find best gross score in this round
      const bestGrossScore = roundScores.reduce(
        (best: any, current: any) =>
          current.gross_score < best.gross_score ? current : best,
        roundScores[0]
      );

      // Check if this player won
      if (bestNetScore.league_player_id === playerId) {
        netWins++;
      }
      if (bestGrossScore.league_player_id === playerId) {
        grossWins++;
      }
    }
  });

  return { netWins, grossWins };
};
