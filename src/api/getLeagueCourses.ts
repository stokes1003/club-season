import { supabase } from "../lib/supabase";
import { LeagueCourse } from "../types/courseSelection";

export async function getLeagueCourses(
  leagueId: string
): Promise<LeagueCourse[]> {
  const { data, error } = await supabase
    .from("league_courses")
    .select(
      "id, course_name, club_name, times_played, external_course_id, location, tees, photo_url"
    )
    .eq("league_id", leagueId);

  if (error) {
    console.error("❌ getLeagueCourses API: Error:", error);
    return [];
  }

  return data.map((course) => ({
    id: course.id,
    course_name: course.course_name,
    club_name: course.club_name,
    times_played: course.times_played,
    external_course_id: course.external_course_id,
    location: {
      address: course.location.address || "",
      city: course.location.city || "",
      state: course.location.state || "",
      country: course.location.country || "",
      latitude: course.location.latitude || 0,
      longitude: course.location.longitude || 0,
    },
    tees: course.tees,
    photo_url:
      course.photo_url ||
      "https://www.golfcoursearchitecture.net/Portals/0/EasyDNNNews/12245/images/12245gca-generic-golf-image-950-534-p-L-100.webp",
  }));
}
