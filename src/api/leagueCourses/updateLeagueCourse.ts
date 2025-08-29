import { supabase } from "../../lib/supabase";

export async function updateLeagueCourse(course: any) {
  if (!course) {
    console.error("updateLeagueCourse: course is undefined");
    return { success: false, error: "Course is undefined" };
  }

  const { data, error } = await supabase
    .from("league_courses")
    .update({ times_played: course.times_played + 1 })
    .eq("id", course.id);

  if (error) {
    console.error("Error updating course times_played:", error);
    return { success: false, error };
  }

  return { success: true, course_id: course.id };
}
