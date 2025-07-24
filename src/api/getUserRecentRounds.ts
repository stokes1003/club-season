import { supabase } from "../lib/supabase";

type UserRound = {
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

export async function getUserRecentRounds(
  userId: string,
  limit: number = 10
): Promise<UserRound[]> {
  try {
    console.log("getUserRecentRounds called with userId:", userId);

    // First, get all league_player_ids for this user
    const { data: leaguePlayers, error: leaguePlayersError } = await supabase
      .from("league_players")
      .select("id, league_id")
      .eq("user_id", userId);

    console.log("League players for user:", {
      leaguePlayers,
      leaguePlayersError,
    });

    if (leaguePlayersError || !leaguePlayers || leaguePlayers.length === 0) {
      console.log("No league players found for user");
      return [];
    }

    const leaguePlayerIds = leaguePlayers.map((lp) => lp.id);
    console.log("League player IDs:", leaguePlayerIds);

    // Get rounds where the user participated
    const { data: scores, error } = await supabase
      .from("round_scores")
      .select("round_id, gross_score, handicap, net_score")
      .in("league_player_id", leaguePlayerIds)
      .order("round_id", { ascending: false })
      .limit(limit);

    console.log("Scores query result:", { scores, error });

    if (error || !scores) {
      console.error("Error fetching user scores:", error);
      return [];
    }

    // Get round details for these scores
    const roundIds = scores.map((score) => score.round_id);
    const { data: rounds, error: roundsError } = await supabase
      .from("rounds")
      .select("id, date, is_major, major_name, league_id, course_id")
      .in("id", roundIds)
      .order("date", { ascending: false });

    if (roundsError || !rounds) {
      console.error("Error fetching rounds:", roundsError);
      return [];
    }

    // Get league and course details
    const leagueIds = [...new Set(rounds.map((round) => round.league_id))];
    const courseIds = [...new Set(rounds.map((round) => round.course_id))];

    const { data: leagues } = await supabase
      .from("leagues")
      .select("id, name")
      .in("id", leagueIds);

    const { data: courses } = await supabase
      .from("league_courses")
      .select("id, external_course_id, course_name, photo_url")
      .in("external_course_id", courseIds);

    console.log("Course lookup:", { courseIds, courses });

    // Create lookup maps
    const leagueMap = new Map(
      leagues?.map((league) => [league.id, league]) || []
    );
    const courseMap = new Map(
      courses?.map((course) => [course.external_course_id, course]) || []
    );
    const roundMap = new Map(rounds.map((round) => [round.id, round]));

    // Combine the data
    return scores
      .map((score) => {
        const round = roundMap.get(score.round_id);
        if (!round) return null;

        const league = leagueMap.get(round.league_id);
        const course = courseMap.get(round.course_id);

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
  } catch (error) {
    console.error("Error in getUserRecentRounds:", error);
    return [];
  }
}
