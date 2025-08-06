export const findTopPlayers = (playerStats: any) => {
  if (!playerStats || playerStats.length === 0) {
    return {
      bestAverage: null,
      mostWins: null,
      mostMajorWins: null,
    };
  }

  // Find player with best average (lowest gross score)
  const bestAverage = playerStats.reduce(
    (best, current) => (current.avgGross < best.avgGross ? current : best),
    playerStats[0]
  );

  // Find player with most gross wins
  const mostWins = playerStats.reduce(
    (most, current) => (current.grossWins > most.grossWins ? current : most),
    playerStats[0]
  );

  // Find player with most major wins
  const mostMajorWins = playerStats.reduce(
    (most, current) => (current.majorWins > most.majorWins ? current : most),
    playerStats[0]
  );

  return {
    bestAverage: {
      player: bestAverage.player,
      avgGross: bestAverage.avgGross,
    },
    mostWins: {
      player: mostWins.player,
      grossWins: mostWins.grossWins,
    },
    mostMajorWins: {
      player: mostMajorWins.player,
      majorWins: mostMajorWins.majorWins,
    },
  };
};
