import { supabase } from "../lib/supabase";

type Score = {
  player: string;
  player_img: string;
  gross: number;
  hcp: number;
  net: number;
  player_color: string;
};

type Round = {
  _id: string;
  course: string;
  course_img: string;
  date: string;
  scores: Score[];
};

export async function getLeagueRounds(leagueId: string): Promise<Round[]> {
  // First, get all rounds for the league
  const { data: rounds, error: roundsError } = await supabase
    .from("rounds")
    .select(
      `
      id,
      date,
      is_major,
      major_name,
      course_id
    `
    )
    .eq("league_id", leagueId)
    .order("date", { ascending: false });

  if (roundsError) {
    console.error("Error fetching rounds:", roundsError);
    return [];
  }

  if (!rounds || rounds.length === 0) {
    return [];
  }

  // Get course information for all rounds
  const courseIds = rounds.map((round) => round.course_id);
  const { data: courses, error: coursesError } = await supabase
    .from("league_courses")
    .select("id, external_course_id, course_name, photo_url")
    .in("external_course_id", courseIds);

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    return [];
  }

  // Create a map for quick course lookup
  const courseMap = new Map(
    courses?.map((course) => [course.external_course_id, course]) || []
  );

  // Get all scores for all rounds
  const roundIds = rounds.map((round) => round.id);
  const { data: scores, error: scoresError } = await supabase
    .from("round_scores")
    .select(
      `
      round_id,
      league_player_id,
      gross_score,
      handicap,
      net_score
    `
    )
    .in("round_id", roundIds);

  if (scoresError) {
    console.error("Error fetching scores:", scoresError);
    return [];
  }

  // Get player information for all scores
  const playerIds = scores?.map((score) => score.league_player_id) || [];
  const { data: players, error: playersError } = await supabase
    .from("league_players")
    .select("id, display_name, avatar_url, player_color")
    .in("id", playerIds)
    .eq("league_id", leagueId);

  if (playersError) {
    console.error("Error fetching players:", playersError);
    return [];
  }

  // Create a map for quick player lookup
  const playerMap = new Map(
    players?.map((player) => [player.id, player]) || []
  );

  // Group scores by round_id
  const scoresByRound = new Map();
  scores?.forEach((score) => {
    if (!scoresByRound.has(score.round_id)) {
      scoresByRound.set(score.round_id, []);
    }
    scoresByRound.get(score.round_id).push(score);
  });

  // Build the final result
  return rounds.map((round) => {
    const course = courseMap.get(round.course_id);
    const roundScores = scoresByRound.get(round.id) || [];

    const scores: Score[] = roundScores.map((score) => {
      const player = playerMap.get(score.league_player_id);
      return {
        player: player?.display_name || "Unknown Player",
        player_img: player?.avatar_url || "",
        player_color: player?.player_color || "#000000",
        gross: score.gross_score,
        hcp: score.handicap,
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
