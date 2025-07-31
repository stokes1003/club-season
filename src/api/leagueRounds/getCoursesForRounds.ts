import { supabase } from "../../lib/supabase";

export const getCoursesForRounds = async (courseIds: string[]) => {
  const { data, error } = await supabase
    .from("league_courses")
    .select("id, external_course_id, course_name, photo_url")
    .in("external_course_id", courseIds);

  if (error) {
    console.error("Error fetching courses:", error.message);
    return null;
  }

  return data;
};
