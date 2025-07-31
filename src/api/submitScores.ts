import { supabase } from "../lib/supabase";
import { CourseSelection } from "../types/courseSelection";
import { getOrCreateLeagueCourse } from "./manageLeagueCourse";

export async function submitScores({
  league_id,
  golfCourse,
  date,
  is_major,
  major_name,
  scores,
}: {
  league_id: string;
  golfCourse: CourseSelection;
  date: string;
  is_major: boolean;
  major_name: string | null;
  scores: {
    league_player_id: string;
    gross: number;
    hcp: number;
    net: number;
    gross_points: number;
    net_points: number;
  }[];
}) {
  // 0. Get or create league course
  const {
    success: courseSuccess,
    course_id,
    error: courseError,
  } = await getOrCreateLeagueCourse(league_id, golfCourse);

  if (!courseSuccess || !course_id) {
    console.error("Failed to get/create league course:", courseError);
    return { success: false, error: courseError };
  }

  // 1. Insert the round
  const { data: round, error: roundError } = await supabase
    .from("rounds")
    .insert([
      {
        league_id,
        course_id: golfCourse.id,
        date,
        is_major,
        major_name,
      },
    ])
    .select()
    .single();

  if (roundError || !round) {
    console.error("Failed to create round:", roundError);
    console.error("Round data:", {
      league_id,
      course_id,
      date,
      is_major,
      major_name,
    });
    return { success: false, error: roundError };
  }

  const round_id = round.id;

  // 2. Insert scores using league_player_id
  const { error: scoresError } = await supabase.from("round_scores").insert(
    scores.map((score) => ({
      round_id,
      league_player_id: score.league_player_id,
      gross_score: score.gross,
      handicap: score.hcp,
      net_score: score.net,
    }))
  );

  if (scoresError) {
    console.error("Failed to insert scores:", scoresError);
    console.error("Scores data:", scores);
    return { success: false, error: scoresError };
  }

  // 3. Update league_players with new points
  for (const score of scores) {
    // First get current points
    const { data: currentPlayer, error: fetchError } = await supabase
      .from("league_players")
      .select("gross_points, net_points")
      .eq("league_id", league_id)
      .eq("id", score.league_player_id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch current points:", fetchError);
      return { success: false, error: fetchError };
    }

    // Then update with new totals
    const { error: updateError } = await supabase
      .from("league_players")
      .update({
        gross_points: (currentPlayer?.gross_points || 0) + score.gross_points,
        net_points: (currentPlayer?.net_points || 0) + score.net_points,
      })
      .eq("league_id", league_id)
      .eq("id", score.league_player_id);

    if (updateError) {
      console.error(
        "Failed to update points for league_player:",
        score.league_player_id,
        updateError
      );
      return { success: false, error: updateError };
    }
  }

  // 4. Update league_courses with new times_played
  const { data: currentCourse, error: fetchCourseError } = await supabase
    .from("league_courses")
    .select("times_played")
    .eq("id", course_id)
    .single();

  if (fetchCourseError) {
    console.error("Failed to fetch current times_played:", fetchCourseError);
    return { success: false, error: fetchCourseError };
  }

  const { error: updateCourseError } = await supabase
    .from("league_courses")
    .update({ times_played: (currentCourse?.times_played || 0) + 1 })
    .eq("id", course_id);

  if (updateCourseError) {
    console.error(
      "Failed to update times_played for league_course:",
      updateCourseError
    );
    return { success: false, error: updateCourseError };
  }

  return { success: true };
}
