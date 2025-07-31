import { supabase } from "../../lib/supabase";

export const getRounds = async (leagueId: string) => {
  const { data, error } = await supabase
    .from("rounds")
    .select(
      `
      id,
      date,
      is_major,
      major_name,
      course_id
    `
    )
    .eq("league_id", leagueId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching rounds:", error.message);
    return null;
  }

  return data;
};
