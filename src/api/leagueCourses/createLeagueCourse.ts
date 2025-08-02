import { supabase } from "../../lib/supabase";
import { CourseSelection } from "../../types/courseSelection";

export async function createLeagueCourse(
  leagueId: string,
  golfCourse: CourseSelection
) {
  const { data, error } = await supabase
    .from("league_courses")
    .insert([
      {
        league_id: leagueId,
        external_course_id:
          "external_course_id" in golfCourse
            ? golfCourse.external_course_id
            : golfCourse.id,
        club_name: golfCourse.club_name,
        course_name: golfCourse.course_name,
        location: golfCourse.location,
        tees: golfCourse.tees,
        times_played: 1,
      },
    ])
    .select("id, external_course_id")
    .single();

  if (error) {
    console.error("Error creating league course:", error);
    return { course: null, error };
  }

  return { course: data, error: null };
}
