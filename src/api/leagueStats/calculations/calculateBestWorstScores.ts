export const calculateBestWorstScores = (allScores: any) => {
  let bestScore = Infinity;
  let bestScorePlayer: any = null;
  let bestScoreRound: any = null;
  let bestScoreCourse: any = null;

  let worstScore = 0;
  let worstScorePlayer: any = null;
  let worstScoreRound: any = null;
  let worstScoreCourse: any = null;

  for (const scoreData of allScores) {
    if (scoreData.score < bestScore) {
      bestScore = scoreData.score;
      bestScorePlayer = scoreData.player;
      bestScoreRound = scoreData.round;
      bestScoreCourse = scoreData.course;
    }

    if (scoreData.score > worstScore) {
      worstScore = scoreData.score;
      worstScorePlayer = scoreData.player;
      worstScoreRound = scoreData.round;
      worstScoreCourse = scoreData.course;
    }
  }

  return {
    best_score: {
      player: {
        name: bestScorePlayer?.name,
        avatar_url: bestScorePlayer?.avatar_url,
        color: bestScorePlayer?.player_color,
      },
      score: bestScore === Infinity ? 0 : bestScore,
      course: {
        course_name: bestScoreCourse?.course_name,
        club_name: bestScoreCourse?.club_name,
        location: bestScoreCourse?.location,
        tees: bestScoreCourse?.tees,
      },
      date: bestScoreRound?.date,
    },
    worst_score: {
      player: {
        name: worstScorePlayer?.name,
        avatar_url: worstScorePlayer?.avatar_url,
        color: worstScorePlayer?.player_color,
      },
      score: worstScore === 0 ? 0 : worstScore,
      course: {
        course_name: worstScoreCourse?.course_name,
        club_name: worstScoreCourse?.club_name,
        location: worstScoreCourse?.location,
        tees: worstScoreCourse?.tees,
      },
      date: worstScoreRound?.date,
    },
  };
};
