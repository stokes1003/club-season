import { supabase } from "../../lib/supabase";

export async function getRecentUserScores(
  leaguePlayerIds: string[],
  limit: number
) {
  const { data: scores, error } = await supabase
    .from("round_scores")
    .select("round_id, gross_score, handicap, net_score")
    .in("league_player_id", leaguePlayerIds)
    .order("round_id", { ascending: false })
    .limit(limit);

  if (error || !scores) {
    console.error("Error fetching user scores:", error);
    return [];
  }

  return scores;
}
