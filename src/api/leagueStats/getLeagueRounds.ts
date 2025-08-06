import { supabase } from "src/lib/supabase";

//Get all rounds for a league
export const getLeagueRounds = async (leagueId: string) => {
  const { data, error } = await supabase
    .from("rounds")
    .select("id, date, course_id, is_major")
    .eq("league_id", leagueId);

  if (error) {
    console.error("Error fetching league stats:", error);
    return null;
  }

  return data;
};
