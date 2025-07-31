import { supabase } from "../../lib/supabase";

export async function getRoundsForScores(roundIds: string[]) {
  const { data: rounds, error: roundsError } = await supabase
    .from("rounds")
    .select("id, date, is_major, major_name, league_id, course_id")
    .in("id", roundIds)
    .order("date", { ascending: false });

  if (roundsError || !rounds) {
    console.error("Error fetching rounds:", roundsError);
    return [];
  }

  return rounds;
}
