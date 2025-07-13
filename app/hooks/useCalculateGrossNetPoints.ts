type PlayerScore = {
  player: string;
  gross: number;
  net: number;
};

type PointsResult = {
  gross: Record<string, number>;
  net: Record<string, number>;
};

export function useCalculateGrossNetPoints(
  scores: PlayerScore[],
  isMajor: boolean = false
): PointsResult {
  const multiplier = isMajor ? 2 : 1;
  const numPlayers = scores.length;
  const basePoints = Array.from(
    { length: numPlayers },
    (_, i) => (numPlayers - 1 - i) * 10
  );

  function calculateCategoryPoints(category: "gross" | "net") {
    const sorted = scores
      .map((s) => ({ player: s.player, score: s[category] }))
      .sort((a, b) => a.score - b.score);

    let ranks: { player: string; rank: number }[] = [];
    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i].score === sorted[i - 1].score) {
        ranks.push({ player: sorted[i].player, rank: ranks[i - 1].rank });
      } else {
        ranks.push({ player: sorted[i].player, rank: currentRank });
      }
      currentRank++;
    }

    const rankGroups: Record<number, string[]> = {};
    ranks.forEach(({ player, rank }) => {
      if (!rankGroups[rank]) rankGroups[rank] = [];
      rankGroups[rank].push(player);
    });

    let points: Record<string, number> = {};
    let usedRanks = 0;

    Object.keys(rankGroups)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((rank) => {
        const players = rankGroups[rank];
        const pointSlice = basePoints.slice(
          usedRanks,
          usedRanks + players.length
        );
        const avgPoints =
          pointSlice.reduce((a, b) => a + b, 0) / players.length;

        players.forEach((p) => {
          points[p] = avgPoints * multiplier;
        });

        usedRanks += players.length;
      });

    return points;
  }

  return {
    gross: calculateCategoryPoints("gross"),
    net: calculateCategoryPoints("net"),
  };
}

export function getWinner(scores: PlayerScore[]): string | null {
  const sorted = scores.sort((a, b) => a.net - b.net);
  const bestScore = sorted[0]?.net;

  const tiedPlayers = sorted.filter((score) => score.net === bestScore);

  return tiedPlayers.length === 1 ? tiedPlayers[0].player : null;
}
