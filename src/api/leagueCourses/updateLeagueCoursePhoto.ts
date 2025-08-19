import { supabase } from "src/lib/supabase";
import { CourseSelection } from "src/types/courseSelection";

export async function updateLeagueCoursePhoto(
  leagueId: string,
  golfCourse: CourseSelection,
  newPhotoUrl: string
) {
  try {
    const externalCourseId =
      "external_course_id" in golfCourse
        ? golfCourse.external_course_id
        : golfCourse.id;

    const { error } = await supabase
      .from("league_courses")
      .update({ photo_url: newPhotoUrl })
      .eq("league_id", leagueId)
      .eq("external_course_id", externalCourseId);

    if (error) {
      console.error("Error updating course photo:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating course photo:", error);
    return { success: false, error };
  }
}
