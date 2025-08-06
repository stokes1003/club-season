import { supabase } from "../lib/supabase";
import { LeagueCourse } from "../types/courseSelection";

export async function getLeagueCourses(
  leagueId: string
): Promise<LeagueCourse[]> {
  const { data, error } = await supabase
    .from("league_courses")
    .select(
      "id, course_name, club_name, times_played, external_course_id, city, state, country, tees, photo_url"
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
    location: {
      address: "",
      city: course.city || "",
      state: course.state || "",
      country: course.country || "",
      latitude: 0,
      longitude: 0,
    },
    tees: course.tees,
    photo_url:
      course.photo_url ||
      "https://www.golfcoursearchitecture.net/Portals/0/EasyDNNNews/12245/images/12245gca-generic-golf-image-950-534-p-L-100.webp",
  }));
}
