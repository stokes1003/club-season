import { supabase } from "src/lib/supabase";

export async function deleteLeagueCourses(leagueId: string) {
  const { data, error } = await supabase
    .from("league_courses")
    .delete()
    .eq("league_id", leagueId);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteLeagueScores(leagueId: string) {
  const { error } = await supabase
    .from("round_scores")
    .delete()
    .in(
      "league_player_id",
      (
        await supabase
          .from("league_players")
          .select("player_id")
          .eq("league_id", leagueId)
      ).data?.map((player) => player.player_id) || []
    );

  if (error) throw error;
  return true;
}

export async function deleteLeagueRounds(leagueId: string) {
  const { data, error } = await supabase
    .from("rounds")
    .delete()
    .eq("league_id", leagueId);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteLeaguePlayers(leagueId: string) {
  const { data, error } = await supabase
    .from("league_players")
    .delete()
    .eq("league_id", leagueId);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteLeague(leagueId: string) {
  const { data, error } = await supabase
    .from("leagues")
    .delete()
    .eq("id", leagueId);

  if (error) {
    throw error;
  }

  return data;
}
