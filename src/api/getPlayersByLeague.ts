import { supabase } from "../lib/supabase";

export async function getPlayersByLeague(leagueId: string) {
  if (!leagueId) {
    return [];
  }

  try {
    const { data: statsData, error: statsError } = await supabase.rpc(
      "get_league_player_stats",
      {
        league_id: leagueId,
      }
    );

    if (statsError) {
      console.error("Error fetching player stats from league:", statsError);
    }

    if (statsData && statsData.length > 0) {
      console.log("RPC stats data:", statsData);
      return statsData.map((player: any) => ({
        ...player,
        player_color: player.player_color || "#6B7280",
      }));
    }

    const { data: basicData, error: basicError } = await supabase
      .from("league_players")
      .select(
        `
        id,
        display_name,
        avatar_url,
        player_color
      `
      )
      .eq("league_id", leagueId);

    if (basicError) {
      console.error("Error fetching basic player info:", basicError);
      return [];
    }

    console.log("Basic data from league_players:", basicData);

    return (
      basicData?.map((item: any) => ({
        id: item.id,
        display_name: item.display_name || "Unknown Player",
        avatar_url: item.avatar_url || "",
        player_color: item.player_color || "#6B7280",
        avg_gross: 0,
        avg_net: 0,
        best_gross: 0,
        best_net: 0,
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
