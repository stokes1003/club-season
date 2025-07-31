import { supabase } from "../lib/supabase";
import { CourseSelection } from "../types/courseSelection";

export async function getOrCreateLeagueCourse(
  league_id: string,
  golfCourse: CourseSelection
) {
  // First, check if this course already exists for this league
  const { data: existingCourse, error: fetchError } = await supabase
    .from("league_courses")
    .select("id, times_played")
    .eq("league_id", league_id)
    .eq("external_course_id", golfCourse.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "not found" error, which is expected if course doesn't exist
    console.error("Error checking existing course:", fetchError);
    return { success: false, error: fetchError };
  }

  if (existingCourse) {
    // Course exists, increment times_played
    const { error: updateError } = await supabase
      .from("league_courses")
      .update({ times_played: existingCourse.times_played + 1 })
      .eq("id", existingCourse.id);

    if (updateError) {
      console.error("Error updating course times_played:", updateError);
      return { success: false, error: updateError };
    }

    return { success: true, course_id: existingCourse.id };
  }

  // Course doesn't exist, create it
  const { data: newCourse, error: insertError } = await supabase
    .from("league_courses")
    .insert([
      {
        league_id,
        external_course_id: golfCourse.id,
        club_name: golfCourse.club_name,
        course_name: golfCourse.course_name,
        location: golfCourse.location,
        tees: golfCourse.tees,
        times_played: 1,
      },
    ])
    .select("id")
    .single();

  if (insertError || !newCourse) {
    console.error("Error creating new course:", insertError);
    return { success: false, error: insertError };
  }

  return { success: true, course_id: newCourse.id };
}
