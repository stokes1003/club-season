export const calculatePlayerStats = (
  allScores: any,
  players: any,
  allNetScores: any
) => {
  const playerStats = players.map((player) => {
    const playerScores = allScores.filter(
      (score) => score.player?.player_id === player.player_id
    );
    const playerNetScores = allNetScores.filter(
      (score) => score.player?.player_id === player.player_id
    );

    const avgGross =
      playerScores.length > 0
        ? playerScores.reduce((sum, score) => sum + score.score, 0) /
          playerScores.length
        : 0;

    const avgNet =
      playerNetScores.length > 0
        ? playerNetScores.reduce((sum, score) => sum + score.score, 0) /
          playerNetScores.length
        : 0;

    // Find the player's best round (lowest gross score) for win tracking
    const bestRound =
      playerScores.length > 0
        ? playerScores.reduce(
            (best, current) => (current.score < best.score ? current : best),
            playerScores[0]
          )
        : null;

    // Find the player's best major round (lowest gross score in major rounds)
    const majorRounds = playerScores.filter((score) => score.round.is_major);

    const bestMajorRound =
      majorRounds.length > 0
        ? majorRounds.reduce(
            (best, current) => (current.score < best.score ? current : best),
            majorRounds[0]
          )
        : null;

    // Calculate major wins by analyzing each round
    let majorWins = 0;
    const majorRoundIds = [
      ...new Set(majorRounds.map((score) => score.round.id)),
    ];

    for (const roundId of majorRoundIds) {
      const roundScores = allScores.filter(
        (score) => score.round.id === roundId
      );
      if (roundScores.length > 0) {
        const winningScore = roundScores.reduce(
          (best, current) => (current.score < best.score ? current : best),
          roundScores[0]
        );

        if (winningScore.player?.player_id === player.player_id) {
          majorWins++;
        }
      }
    }

    return {
      player,
      avgGross,
      avgNet,
      grossWins: player.gross_wins || 0,
      netWins: player.net_wins || 0,
      majorWins,
      bestRound,
      bestMajorRound,
    };
  });

  return playerStats;
};
