import { supabase } from "../../lib/supabase";

type Score = {
  league_player_id: string;
  gross: number;
  hcp: number;
  net: number;
  gross_points: number;
  net_points: number;
};

export async function updatePlayerPoints(league_id: string, scores: Score[]) {
  for (const score of scores) {
    const { data: currentPlayer, error } = await supabase
      .from("league_players")
      .select("gross_points, net_points")
      .eq("league_id", league_id)
      .eq("id", score.league_player_id)
      .single();

    if (error) {
      console.error("Error updating player points:", error);
      return { success: false, error };
    }

    const { error: updateError } = await supabase
      .from("league_players")
      .update({
        gross_points: (currentPlayer?.gross_points || 0) + score.gross_points,
        net_points: (currentPlayer?.net_points || 0) + score.net_points,
      })
      .eq("league_id", league_id)
      .eq("id", score.league_player_id);

    if (updateError) {
      console.error(
        "Failed to update points for league_player:",
        score.league_player_id,
        updateError
      );
      return { success: false, error: updateError };
    }
  }

  return { success: true };
}
