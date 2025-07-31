import { supabase } from "../../lib/supabase";

export async function getLeagueAndCourses(
  leagueIds: string[],
  courseIds: string[]
) {
  // Run both queries in parallel for better performance
  const [leaguesResult, coursesResult] = await Promise.all([
    supabase.from("leagues").select("id, name").in("id", leagueIds),
    supabase
      .from("league_courses")
      .select("id, external_course_id, course_name, photo_url")
      .in("external_course_id", courseIds),
  ]);

  if (leaguesResult.error || !leaguesResult.data) {
    console.error("Error fetching leagues:", leaguesResult.error);
    return null;
  }

  if (coursesResult.error || !coursesResult.data) {
    console.error("Error fetching courses:", coursesResult.error);
    return null;
  }

  return { leagues: leaguesResult.data, courses: coursesResult.data };
}
