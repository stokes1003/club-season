import { supabase } from "../../lib/supabase";

export async function createRound(
  league_id: string,
  course_id: string,
  date: string,
  is_major: boolean,
  major_name: string | null
) {
  const { data, error } = await supabase
    .from("rounds")
    .insert([
      {
        league_id,
        course_id,
        date,
        is_major,
        major_name,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating round:", error);
    return { success: false, error };
  }

  return { success: true, round: data };
}
