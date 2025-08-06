type Player = {
  id: string;
  display_name: string;
  avatar_url: string;
  player_color: string;
  invite_email: string;
  net_points: number;
  gross_points: number;
};

type PlayerScore = {
  league_player_id: string;
  net_score: number;
  gross_score: number;
  round_id: string;
};

type PlayerStats = {
  player_id: string;
  name: string;
  avatar_url: string;
  player_color: string;
  invite_email: string;
  avg_net: number;
  best_net: number;
  avg_gross: number;
  best_gross: number;
  net_points: number;
  gross_points: number;
  net_wins: number;
  gross_wins: number;
};

export const formatPlayerStats = (
  player: Player,
  playerScores: PlayerScore[],
  averages: { avgNet: number; avgGross: number },
  wins: { netWins: number; grossWins: number }
): PlayerStats => {
  // Calculate best scores
  const netScores = playerScores
    .map((s) => s.net_score)
    .filter((s) => s !== null);
  const grossScores = playerScores
    .map((s) => s.gross_score)
    .filter((s) => s !== null);

  const bestNet = netScores.length > 0 ? Math.min(...netScores) : 0;
  const bestGross = grossScores.length > 0 ? Math.min(...grossScores) : 0;

  return {
    player_id: player.id,
    name: player.display_name || "Unknown Player",
    avatar_url: player.avatar_url || "",
    player_color: player.player_color || "#6B7280",
    invite_email: player.invite_email || "",
    avg_net: averages.avgNet,
    best_net: bestNet,
    avg_gross: averages.avgGross,
    best_gross: bestGross,
    net_points: player.net_points || 0,
    gross_points: player.gross_points || 0,
    net_wins: wins.netWins,
    gross_wins: wins.grossWins,
  };
};
