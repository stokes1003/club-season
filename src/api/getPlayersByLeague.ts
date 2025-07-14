import { supabase } from "../lib/supabase";

export async function getPlayersByLeague(leagueId: string) {
  if (!leagueId) {
    return [];
  }

  try {
    // First try to get players with stats (for leagues that have rounds)
    const { data: statsData, error: statsError } = await supabase.rpc(
      "get_league_player_stats",
      {
        league_id: leagueId,
      }
    );

    if (statsError) {
      console.error("Error fetching player stats from league:", statsError);
    }

    // If we got stats data, return it
    if (statsData && statsData.length > 0) {
      return statsData;
    }

    // If no stats data (no rounds played yet), get basic player info

    const { data: basicData, error: basicError } = await supabase
      .from("league_players")
      .select(
        `
        player_id,
        players (
          name,
          avatar_url
        )
      `
      )
      .eq("league_id", leagueId);

    if (basicError) {
      console.error("Error fetching basic player info:", basicError);
      return [];
    }

    // Transform the data to match the expected Player type
    return (
      basicData?.map((item: any) => ({
        player_id: item.player_id,
        name: item.players?.name || "Unknown Player",
        avatar_url: item.players?.avatar_url || "",
        avg_gross_score: 0,
        avg_net_score: 0,
        best_gross_score: 0,
        best_net_score: 0,
        gross_points: 0,
        net_points: 0,
        net_wins: 0,
        gross_wins: 0,
      })) || []
    );
  } catch (error) {
    console.error(
      "getPlayersByLeague: Exception occurred for leagueId:",
      leagueId,
      error
    );
    return [];
  }
}
