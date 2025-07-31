export type Round = {
  id: string;
  date: string;
  is_major: boolean;
  major_name: string;
  course_id: string;
};

export type Course = {
  external_course_id: string;
  course_name: string;
  photo_url: string;
};

export type Score = {
  round_id: string;
  league_player_id: string;
  net_score: number;
  gross_score: number;
  handicap: number;
};

export type Player = {
  id: string;
  display_name: string;
  avatar_url: string;
  player_color: string;
};

export function transformRoundData(
  rounds: Round[],
  courses: Course[],
  scoresByRound: Map<string, Score[]>,
  players: Player[]
) {
  const courseMap = new Map(
    courses.map((course) => [course.external_course_id, course])
  );
  const playerMap = new Map(players.map((player) => [player.id, player]));

  return rounds.map((round) => {
    const course = courseMap.get(round.course_id);
    const roundScores = scoresByRound.get(round.id) || [];

    const scores = roundScores.map((score: Score) => {
      const player = playerMap.get(score.league_player_id);
      return {
        player: player?.display_name || "Unknown Player",
        player_img: player?.avatar_url || "",
        player_color: player?.player_color || "#000000",
        gross: score.gross_score,
        hcp: score.handicap || 0,
        net: score.net_score,
      };
    });

    return {
      _id: round.id,
      course: course?.course_name || "Unknown Course",
      course_img:
        course?.photo_url ||
        "https://www.usgtf.com/wp-content/uploads/2019/03/Generic-Golf-950x534.jpg",
      isMajor: round.is_major,
      majorName: round.major_name,
      date: round.date,
      scores,
    };
  });
}
