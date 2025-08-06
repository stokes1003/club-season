type ScoreData = {
  score: number;
  player: any;
  round: any;
  course: any;
};

export const calculateBestWorstNetScores = (allScores: ScoreData[]) => {
  let bestNetScore = Infinity;
  let bestNetScorePlayer: any = null;
  let bestNetScoreRound: any = null;
  let bestNetScoreCourse: any = null;

  let worstNetScore = 0;
  let worstNetScorePlayer: any = null;
  let worstNetScoreRound: any = null;
  let worstNetScoreCourse: any = null;

  for (const scoreData of allScores) {
    if (scoreData.score < bestNetScore) {
      bestNetScore = scoreData.score;
      bestNetScorePlayer = scoreData.player;
      bestNetScoreRound = scoreData.round;
      bestNetScoreCourse = scoreData.course;
    }

    if (scoreData.score > worstNetScore) {
      worstNetScore = scoreData.score;
      worstNetScorePlayer = scoreData.player;
      worstNetScoreRound = scoreData.round;
      worstNetScoreCourse = scoreData.course;
    }
  }

  return {
    best_net_score: {
      player: {
        name: bestNetScorePlayer?.name,
        avatar_url: bestNetScorePlayer?.avatar_url,
        color: bestNetScorePlayer?.player_color,
      },
      score: bestNetScore === Infinity ? 0 : bestNetScore,
      course: {
        course_name: bestNetScoreCourse?.course_name,
        club_name: bestNetScoreCourse?.club_name,
        location: bestNetScoreCourse?.location,
        tees: bestNetScoreCourse?.tees,
      },
      date: bestNetScoreRound?.date,
    },
    worst_net_score: {
      player: {
        name: worstNetScorePlayer?.name,
        avatar_url: worstNetScorePlayer?.avatar_url,
        color: worstNetScorePlayer?.player_color,
      },
      score: worstNetScore === 0 ? 0 : worstNetScore,
      course: {
        course_name: worstNetScoreCourse?.course_name,
        club_name: worstNetScoreCourse?.club_name,
        location: worstNetScoreCourse?.location,
        tees: worstNetScoreCourse?.tees,
      },
      date: worstNetScoreRound?.date,
    },
  };
};
