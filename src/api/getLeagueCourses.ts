import { supabase } from "../lib/supabase";

type LeagueCourse = {
  id: string;
  course_name: string;
  club_name: string;
  times_played: number;
  external_course_id: number;
};

export async function getLeagueCourses(
  leagueId: string
): Promise<LeagueCourse[]> {
  const { data, error } = await supabase
    .from("league_courses")
    .select("id, course_name, club_name, times_played, external_course_id")
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
  }));
}
