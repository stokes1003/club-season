import { getPlayers } from "./getPlayers";
import { getPlayerScores } from "./getPlayerScores";
import { calculatePlayerAverages } from "./calculatePlayerAverages";
import { calculatePlayerWins } from "./calculatePlayerWins";
import { formatPlayerStats } from "./formatPlayerStats";

export async function getPlayersByLeague(leagueId: string) {
  if (!leagueId) {
    return [];
  }

  try {
    // Get all data
    const players = await getPlayers(leagueId);
    const scores = await getPlayerScores(leagueId);

    if (!players || players.length === 0) {
      return [];
    }

    if (!scores || scores.length === 0) {
      // No scores, return basic player info
      return players.map((player: any) => ({
        player_id: player.id,
        name: player.display_name || "Unknown Player",
        avatar_url: player.avatar_url || "",
        player_color: player.player_color || "#6B7280",
        invite_email: player.invite_email || "",
        avg_net: 0,
        best_net: 0,
        avg_gross: 0,
        best_gross: 0,
        net_points: player.net_points || 0,
        gross_points: player.gross_points || 0,
        net_wins: 0,
        gross_wins: 0,
      }));
    }

    // Calculate statistics for each player
    const playerStats = players.map((player: any) => {
      const playerScores = scores.filter(
        (s) => s.league_player_id === player.id
      );

      if (playerScores.length === 0) {
        return {
          player_id: player.id,
          name: player.display_name || "Unknown Player",
          avatar_url: player.avatar_url || "",
          player_color: player.player_color || "#6B7280",
          invite_email: player.invite_email || "",
          avg_net: 0,
          best_net: 0,
          avg_gross: 0,
          best_gross: 0,
          net_points: player.net_points || 0,
          gross_points: player.gross_points || 0,
          net_wins: 0,
          gross_wins: 0,
        };
      }

      const averages = calculatePlayerAverages(playerScores);
      const wins = calculatePlayerWins(playerScores, player.id);

      return formatPlayerStats(player, playerScores, averages, wins);
    });

    return playerStats;
  } catch (error) {
    console.error(
      "getPlayersByLeague: Exception occurred for leagueId:",
      leagueId,
      error
    );
    return [];
  }
}
