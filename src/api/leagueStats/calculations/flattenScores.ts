export const flattenScores = (
  roundsWithScores: any,
  players: any,
  courses: any
) => {
  const allScores: Array<{
    score: number;
    player: any;
    round: any;
    course: any;
  }> = [];

  for (const round of roundsWithScores) {
    for (const score of round.scores) {
      const player = players.find(
        (p) => p.player_id === score.league_player_id
      );
      const course = courses.find(
        (c) => c.external_course_id === round.course_id
      );

      allScores.push({
        score: score.gross_score,
        player,
        round,
        course,
      });
    }
  }
  const allNetScores: Array<{
    score: number;
    player: any;
    round: any;
    course: any;
  }> = [];

  for (const round of roundsWithScores) {
    for (const score of round.scores) {
      const player = players.find(
        (p) => p.player_id === score.league_player_id
      );
      const course = courses.find(
        (c) => c.external_course_id === round.course_id
      );

      allNetScores.push({
        score: score.net_score,
        player,
        round,
        course,
      });
    }
  }

  return { allScores, allNetScores };
};
