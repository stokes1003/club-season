type PlayerScore = {
  net_score: number;
  gross_score: number;
};

export const calculatePlayerAverages = (playerScores: PlayerScore[]) => {
  const netScores = playerScores
    .map((s) => s.net_score)
    .filter((s) => s !== null);
  const grossScores = playerScores
    .map((s) => s.gross_score)
    .filter((s) => s !== null);

  const avgNet =
    netScores.length > 0
      ? Math.round(
          (netScores.reduce((a, b) => a + b, 0) / netScores.length) * 10
        ) / 10
      : 0;
  const avgGross =
    grossScores.length > 0
      ? Math.round(
          (grossScores.reduce((a, b) => a + b, 0) / grossScores.length) * 10
        ) / 10
      : 0;

  return { avgNet, avgGross };
};
