type PlayerScore = {
  league_player_id: string;
  net_score: number;
  gross_score: number;
  round_id: string;
};

type Round = {
  id: string;
  is_major: boolean;
};

export const calculatePlayerWins = (
  playerScores: PlayerScore[],
  playerId: string,
  rounds: Round[],
  allScores: PlayerScore[] // Add all scores for comparison
) => {
  let netWins = 0;
  let grossWins = 0;
  let majorWins = 0;
  let netMajorWins = 0;

  console.log(`Calculating wins for player ${playerId}`);
  console.log(`Total rounds: ${rounds.length}`);
  console.log(
    `Rounds with is_major=true:`,
    rounds.filter((r) => r.is_major).map((r) => r.id)
  );

  // Group scores by round to calculate wins
  const roundGroups = playerScores.reduce((groups: any, score) => {
    const roundId = score.round_id;
    if (!groups[roundId]) {
      groups[roundId] = [];
    }
    groups[roundId].push(score);
    return groups;
  }, {});

  console.log(`Player has scores in ${Object.keys(roundGroups).length} rounds`);

  Object.entries(roundGroups).forEach(
    ([roundId, roundScores]: [string, any]) => {
      if (roundScores.length > 0) {
        const round = rounds.find((r) => r.id === roundId);
        const isMajor = round?.is_major || false;

        console.log(`Round ${roundId} is major: ${isMajor}`);

        // Get ALL scores for this round (not just current player's)
        const allRoundScores = allScores.filter((s) => s.round_id === roundId);

        if (allRoundScores.length === 0) {
          console.log(`No scores found for round ${roundId}`);
          return;
        }

        // Find best net score in this round (across all players)
        const bestNetScore = allRoundScores.reduce(
          (best: any, current: any) =>
            current.net_score < best.net_score ? current : best,
          allRoundScores[0]
        );

        // Find best gross score in this round (across all players)
        const bestGrossScore = allRoundScores.reduce(
          (best: any, current: any) =>
            current.gross_score < best.gross_score ? current : best,
          allRoundScores[0]
        );

        // Check if this player won
        if (bestNetScore.league_player_id === playerId) {
          netWins++;
          console.log(
            `Player ${playerId} won net in round ${roundId} with score ${bestNetScore.net_score}`
          );
          // If it's a major round and player won net, count as net major win
          if (isMajor) {
            netMajorWins++;
            console.log(`Player ${playerId} won net major in round ${roundId}`);
          }
        }
        if (bestGrossScore.league_player_id === playerId) {
          grossWins++;
          console.log(
            `Player ${playerId} won gross in round ${roundId} with score ${bestGrossScore.gross_score}`
          );
          // If it's a major round and player won gross, count as major win
          if (isMajor) {
            majorWins++;
            console.log(`Player ${playerId} won major in round ${roundId}`);
          }
        }
      }
    }
  );

  console.log(
    `Final wins for player ${playerId}: net=${netWins}, gross=${grossWins}, major=${majorWins}, netMajor=${netMajorWins}`
  );
  return { netWins, grossWins, majorWins, netMajorWins };
};
