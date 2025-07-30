import { supabase } from "../lib/supabase";
import { LeagueCourse } from "../types/courseSelection";

export async function getLeagueCourses(
  leagueId: string
): Promise<LeagueCourse[]> {
  const { data, error } = await supabase
    .from("league_courses")
    .select(
      "id, course_name, club_name, times_played, external_course_id, location, tees"
    )
    .eq("league_id", leagueId);

  if (error) {
    console.error("Error fetching league courses:", error);
    return [];
  }

  return data.map((course) => ({
    id: course.id,
    course_name: course.course_name,
    club_name: course.club_name,
    times_played: course.times_played,
    external_course_id: course.external_course_id,
    location: course.location,
    tees: course.tees,
  }));
}
