import { supabase } from "../../lib/supabase";

export const getCourseStats = async (userId: string) => {
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
        course_id
      )
    `
    )
    .in("league_player_id", playerIdArray);

  if (error || !roundScores) {
    console.error("Error fetching round scores:", error?.message);
    return null;
  }

  // Get all unique course IDs
  const allCourseIds = [
    ...new Set(roundScores.map((score) => (score.rounds as any).course_id)),
  ].filter(Boolean);

  // Get course details for all courses
  let courseDetails: Record<
    string,
    { course_name: string; club_name: string }
  > = {};

  if (allCourseIds.length > 0) {
    const { data: courses } = await supabase
      .from("league_courses")
      .select("external_course_id, course_name, club_name")
      .in("external_course_id", allCourseIds);

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

  // Get the most played course
  const mostPlayedCourse = roundScores.reduce(
    (acc, score) => {
      const courseId = (score.rounds as any).course_id;
      if (!acc[courseId]) {
        acc[courseId] = 0;
      }
      acc[courseId]++;
      return acc;
    },
    {} as Record<string, number>
  );

  const mostPlayedCourseName = Object.keys(mostPlayedCourse).reduce((a, b) =>
    mostPlayedCourse[a] > mostPlayedCourse[b] ? a : b
  );

  // Get Average Score by Course
  const courseStats = roundScores.reduce(
    (acc, score) => {
      const courseId = (score.rounds as any).course_id;
      if (!acc[courseId]) {
        acc[courseId] = { totalScore: 0, count: 0 };
      }
      acc[courseId].totalScore += score.net_score || 0;
      acc[courseId].count += 1;
      return acc;
    },
    {} as Record<string, { totalScore: number; count: number }>
  );

  // Calculate averages and find best/worst
  const courseAverages = Object.entries(courseStats).map(
    ([courseId, stats]) => ({
      courseId,
      avgScore: stats.totalScore / stats.count,
      timesPlayed: stats.count,
    })
  );

  const bestCourse = courseAverages.reduce((best, current) =>
    current.avgScore < best.avgScore ? current : best
  );

  const worstCourse = courseAverages.reduce((worst, current) =>
    current.avgScore > worst.avgScore ? current : worst
  );

  return {
    most_played_course: {
      course_name: courseDetails[mostPlayedCourseName]?.course_name || "",
      times_played: mostPlayedCourse[mostPlayedCourseName],
    },
    best_course: {
      course_name: courseDetails[bestCourse.courseId]?.course_name || "",
      avg_score: Math.round(bestCourse.avgScore * 10) / 10,
      times_played: bestCourse.timesPlayed,
    },
    worst_course: {
      course_name: courseDetails[worstCourse.courseId]?.course_name || "",
      avg_score: Math.round(worstCourse.avgScore * 10) / 10,
      times_played: worstCourse.timesPlayed,
    },
  };
};
