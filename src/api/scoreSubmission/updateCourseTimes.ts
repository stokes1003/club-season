import { supabase } from "../../lib/supabase";

export async function updateCourseTimes(
  externalCourseId: number,
  leagueId: string
) {
  const { data, error } = await supabase
    .from("league_courses")
    .select("id, times_played")
    .eq("external_course_id", externalCourseId)
    .eq("league_id", leagueId)
    .single();

  if (error) {
    console.error("Error updating course times:", error);
    return { success: false, error };
  }

  const { error: updateCourseError } = await supabase
    .from("league_courses")
    .update({ times_played: (data?.times_played || 0) + 1 })
    .eq("id", data.id);

  if (updateCourseError) {
    console.error(
      "Failed to update times_played for league_course:",
      updateCourseError
    );
    return { success: false, error: updateCourseError };
  }

  return { success: true };
}
