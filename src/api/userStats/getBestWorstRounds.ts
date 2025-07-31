import { supabase } from "../../lib/supabase";

export const getBestWorstRounds = async (userId: string) => {
  // First get player IDs for this user
  const { data: playerIds, error: playerError } = await supabase
    .from("league_players")
    .select("id")
    .eq("user_id", userId);

  if (playerError || !playerIds) {
    console.error("Error fetching player IDs:", playerError?.message);
    return null;
  }

  const playerIdArray = playerIds.map((p) => p.id);

  // Get all round scores for this user
  const { data: roundScores, error } = await supabase
    .from("round_scores")
    .select(
      `
      net_score,
      gross_score,
      round_id,
      league_player_id,
      rounds!inner(
        id,
        date,
        course_id
      )
    `
    )
    .in("league_player_id", playerIdArray);

  if (error || !roundScores) {
    console.error("Error fetching round scores:", error?.message);
    return null;
  }

  // Find best and worst rounds
  const bestNetRound = roundScores.reduce((best, current) => {
    if (!current.net_score || !best.net_score) return best;
    return current.net_score < best.net_score ? current : best;
  }, roundScores[0]);

  const worstNetRound = roundScores.reduce((worst, current) => {
    if (!current.net_score || !worst.net_score) return worst;
    return current.net_score > worst.net_score ? current : worst;
  }, roundScores[0]);

  const bestGrossRound = roundScores.reduce((best, current) => {
    if (!current.gross_score || !best.gross_score) return best;
    return current.gross_score < best.gross_score ? current : best;
  }, roundScores[0]);

  const worstGrossRound = roundScores.reduce((worst, current) => {
    if (!current.gross_score || !worst.gross_score) return worst;
    return current.gross_score > worst.gross_score ? current : worst;
  }, roundScores[0]);

  // Get all unique course IDs from the best/worst rounds
  const courseIds = [
    (bestNetRound?.rounds as any)?.course_id,
    (worstNetRound?.rounds as any)?.course_id,
    (bestGrossRound?.rounds as any)?.course_id,
    (worstGrossRound?.rounds as any)?.course_id,
  ].filter(Boolean);

  // Get course details
  let courseDetails: Record<
    string,
    { course_name: string; club_name: string }
  > = {};

  if (courseIds.length > 0) {
    const { data: courses } = await supabase
      .from("league_courses")
      .select("external_course_id, course_name, club_name")
      .in("external_course_id", courseIds);

    if (courses) {
      courseDetails = courses.reduce(
        (acc, course) => {
          acc[course.external_course_id] = {
            course_name: course.course_name,
            club_name: course.club_name,
          };
          return acc;
        },
        {} as Record<string, { course_name: string; club_name: string }>
      );
    }
  }

  return {
    best_net_score: {
      score: bestNetRound?.net_score || 0,
      course_name:
        courseDetails[(bestNetRound?.rounds as any)?.course_id]?.course_name ||
        "",
      date: (bestNetRound?.rounds as any)?.date
        ? new Date((bestNetRound.rounds as any).date)
        : new Date(),
    },
    worst_net_score: {
      score: worstNetRound?.net_score || 0,
      course_name:
        courseDetails[(worstNetRound?.rounds as any)?.course_id]?.course_name ||
        "",
      date: (worstNetRound?.rounds as any)?.date
        ? new Date((worstNetRound.rounds as any).date)
        : new Date(),
    },
    best_gross_score: {
      score: bestGrossRound?.gross_score || 0,
      course_name:
        courseDetails[(bestGrossRound?.rounds as any)?.course_id]
          ?.course_name || "",
      date: (bestGrossRound?.rounds as any)?.date
        ? new Date((bestGrossRound.rounds as any).date)
        : new Date(),
    },
    worst_gross_score: {
      score: worstGrossRound?.gross_score || 0,
      course_name:
        courseDetails[(worstGrossRound?.rounds as any)?.course_id]
          ?.course_name || "",
      date: (worstGrossRound?.rounds as any)?.date
        ? new Date((worstGrossRound.rounds as any).date)
        : new Date(),
    },
  };
};
