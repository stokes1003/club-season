import { CourseSelection } from "src/types/courseSelection";
import { supabase } from "../../lib/supabase";

export async function checkLeagueCourse(
  leagueId: string,
  golfCourse: CourseSelection
) {
  // Extract the correct external course ID
  const externalCourseId =
    "external_course_id" in golfCourse
      ? golfCourse.external_course_id
      : golfCourse.id;

  console.log("Checking league course:", { leagueId, externalCourseId });

  const { data, error } = await supabase
    .from("league_courses")
    .select("id, external_course_id, times_played")
    .eq("league_id", leagueId)
    .eq("external_course_id", externalCourseId)
    .single();

  console.log("Course lookup result:", { data, error, exists: !!data });

  if (error && error.code !== "PGRST116") {
    console.error("Error checking league course:", error);
    return { course: null, error, exists: false };
  }

  return { course: data, error: null, exists: !!data };
}
