import { supabase } from "../lib/supabase";

export async function getPlayersByLeague(leagueId: string) {
  if (!leagueId) {
    return [];
  }

  try {
    // Get all players in the league
    const { data: players, error: playersError } = await supabase
      .from("league_players")
      .select(
        "id, display_name, avatar_url, player_color, invite_email, net_points, gross_points"
      )
      .eq("league_id", leagueId);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      return [];
    }

    if (!players || players.length === 0) {
      return [];
    }

    // Get all rounds for this league
    const { data: rounds, error: roundsError } = await supabase
      .from("rounds")
      .select("id")
      .eq("league_id", leagueId);

    if (roundsError) {
      console.error("Error fetching rounds:", roundsError);
      return [];
    }

    if (!rounds || rounds.length === 0) {
      // No rounds played yet, return basic player info
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

    const roundIds = rounds.map((r) => r.id);

    // Get all scores for all rounds in this league
    const { data: scores, error: scoresError } = await supabase
      .from("round_scores")
      .select("league_player_id, net_score, gross_score, round_id")
      .in("round_id", roundIds);

    if (scoresError) {
      console.error("Error fetching scores:", scoresError);
      return [];
    }

    // Calculate statistics for each player
    const playerStats = players.map((player: any) => {
      const playerScores =
        scores?.filter((s) => s.league_player_id === player.id) || [];

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

      // Calculate averages
      const netScores = playerScores
        .map((s) => s.net_score)
        .filter((s) => s !== null);
      const grossScores = playerScores
        .map((s) => s.gross_score)
        .filter((s) => s !== null);

      const avgNet =
        netScores.length > 0
          ? Math.round(
              (netScores.reduce((a, b) => a + b, 0) / netScores.length) * 10
            ) / 10
          : 0;
      const avgGross =
        grossScores.length > 0
          ? Math.round(
              (grossScores.reduce((a, b) => a + b, 0) / grossScores.length) * 10
            ) / 10
          : 0;

      // Calculate best scores
      const bestNet = netScores.length > 0 ? Math.min(...netScores) : 0;
      const bestGross = grossScores.length > 0 ? Math.min(...grossScores) : 0;

      // Calculate wins
      let netWins = 0;
      let grossWins = 0;

      // Group scores by round to calculate wins
      const roundGroups = playerScores.reduce((groups: any, score) => {
        const roundId = score.round_id;
        if (!groups[roundId]) {
          groups[roundId] = [];
        }
        groups[roundId].push(score);
        return groups;
      }, {});

      Object.entries(roundGroups).forEach(
        ([roundId, roundScores]: [string, any]) => {
          if (roundScores.length > 0) {
            // Get ALL scores for this round (not just current player's)
            const allRoundScores =
              scores?.filter((s) => s.round_id === roundId) || [];

            if (allRoundScores.length === 0) return;

            // Find best net score in this round (across all players)
            const bestNetScore = allRoundScores.reduce(
              (best: any, current: any) =>
                current.net_score < best.net_score ? current : best,
              allRoundScores[0]
            );

            // Find best gross score in this round (across all players)
            const bestGrossScore = allRoundScores.reduce(
              (best: any, current: any) =>
                current.gross_score < best.gross_score ? current : best,
              allRoundScores[0]
            );

            // Check if this player won
            if (bestNetScore.league_player_id === player.id) {
              netWins++;
            }
            if (bestGrossScore.league_player_id === player.id) {
              grossWins++;
            }
          }
        }
      );

      return {
        player_id: player.id,
        name: player.display_name || "Unknown Player",
        avatar_url: player.avatar_url || "",
        player_color: player.player_color || "#6B7280",
        invite_email: player.invite_email || "",
        avg_net: avgNet,
        best_net: bestNet,
        avg_gross: avgGross,
        best_gross: bestGross,
        net_points: player.net_points || 0,
        gross_points: player.gross_points || 0,
        net_wins: netWins,
        gross_wins: grossWins,
      };
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
