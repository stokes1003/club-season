export type Score = {
  round_id: string;
  gross_score: number;
  net_score: number;
  handicap: number;
};

export type Round = {
  id: string;
  league_id: string;
  course_id: string;
  date: string;
  is_major: boolean;
  major_name: string | null;
};

export type League = {
  id: string;
  name: string;
};
export type Course = {
  id: string;
  external_course_id: number;
  course_name: string;
  photo_url: string;
};

export type UserRound = {
  id: string;
  league_name: string;
  course_name: string;
  course_img: string;
  date: string;
  is_major: boolean;
  major_name: string | null;
  gross_score: number;
  net_score: number;
  handicap: number;
  gross_points: number;
  net_points: number;
};

export function transformUserRounds(
  scores: Score[],
  rounds: Round[],
  leagues: League[],
  courses: Course[]
): UserRound[] {
  const leagueMap = new Map(
    leagues?.map((league) => [league.id, league]) || []
  );
  const courseMap = new Map(
    courses?.map((course) => [course.external_course_id, course]) || []
  );
  const roundMap = new Map(rounds.map((round) => [round.id, round]));

  return scores
    .map((score) => {
      const round = roundMap.get(score.round_id);
      if (!round) return null;

      const league = leagueMap.get(round.league_id);
      const course = courseMap.get(Number(round.course_id));

      return {
        id: score.round_id,
        league_name: league?.name || "Unknown League",
        course_name: course?.course_name || "Unknown Course",
        course_img:
          course?.photo_url ||
          "https://www.usgtf.com/wp-content/uploads/2019/03/Generic-Golf-950x534.jpg",
        date: round.date,
        is_major: round.is_major,
        major_name: round.major_name,
        gross_score: score.gross_score,
        net_score: score.net_score,
        handicap: score.handicap,
        gross_points: 0,
        net_points: 0,
      };
    })
    .filter(Boolean) as UserRound[];
}
