import { supabase } from "../lib/supabase";
import { getWinner } from "../../app/hooks/useCalculateGrossNetPoints";

// Helper function to get the gross winner
function getGrossWinner(
  scores: { player: string; gross: number; net: number }[]
): string | null {
  const sorted = scores.sort((a, b) => a.gross - b.gross);
  const bestScore = sorted[0]?.gross;

  // Check if multiple players have the same best score (tie)
  const tiedPlayers = sorted.filter((score) => score.gross === bestScore);

  return tiedPlayers.length === 1 ? tiedPlayers[0].player : null;
}

export async function submitScores({
  league_id,
  course_id,
  date,
  is_major,
  major_name,
  scores,
  winner,
}: {
  league_id: string;
  course_id: string;
  date: string;
  is_major: boolean;
  major_name: string | null;
  scores: {
    player_id: string;
    gross: number;
    hcp: number;
    net: number;
    gross_points: number;
    net_points: number;
  }[];
  winner?: string | null;
}) {
  // 1. Insert the round
  const { data: round, error: roundError } = await supabase
    .from("rounds")
    .insert([
      {
        league_id,
        course_id,
        date,
        is_major,
        major_name,
      },
    ])
    .select()
    .single();

  if (roundError || !round) {
    console.error("Failed to create round:", roundError);
    return { success: false, error: roundError };
  }

  const round_id = round.id;

  // 2. Insert individual scores
  const { error: scoresError } = await supabase.from("round_scores").insert(
    scores.map((score) => ({
      round_id,
      player_id: score.player_id,
      gross_score: score.gross,
      handicap: score.hcp,
      net_score: score.net,
    }))
  );

  if (scoresError) {
    console.error("Failed to insert scores:", scoresError);
    return { success: false, error: scoresError };
  }

  // 3. Update league_players with new points
  for (const score of scores) {
    const { error: updateError } = await supabase.rpc(
      "increment_league_player_points",
      {
        p_league_id: league_id,
        p_player_id: score.player_id,
        p_gross_points: score.gross_points,
        p_net_points: score.net_points,
      }
    );

    if (updateError) {
      console.error(
        "Failed to update points for player:",
        score.player_id,
        updateError
      );
      return { success: false, error: updateError };
    }
  }

  // 4. Update winner's net_wins if there is a winner
  if (winner) {
    // First get current net_wins value
    const { data: currentData, error: fetchError } = await supabase
      .from("league_players")
      .select("net_wins")
      .eq("league_id", league_id)
      .eq("player_id", winner)
      .single();

    if (!fetchError && currentData) {
      const newNetWins = (currentData.net_wins || 0) + 1;

      const { error: winnerUpdateError } = await supabase
        .from("league_players")
        .update({ net_wins: newNetWins })
        .eq("league_id", league_id)
        .eq("player_id", winner);

      if (winnerUpdateError) {
        console.error("Failed to update winner's net_wins:", winnerUpdateError);
        // Don't return error here as the round was already submitted successfully
      }
    }
  }

  // 5. Update gross winner's gross_wins if there is a gross winner
  const grossWinner = getGrossWinner(
    scores.map((score) => ({
      player: score.player_id,
      gross: score.gross,
      net: score.net,
    }))
  );

  if (grossWinner) {
    // First get current gross_wins value
    const { data: currentData, error: fetchError } = await supabase
      .from("league_players")
      .select("gross_wins")
      .eq("league_id", league_id)
      .eq("player_id", grossWinner)
      .single();

    if (!fetchError && currentData) {
      const newGrossWins = (currentData.gross_wins || 0) + 1;

      const { error: winnerUpdateError } = await supabase
        .from("league_players")
        .update({ gross_wins: newGrossWins })
        .eq("league_id", league_id)
        .eq("player_id", grossWinner);

      if (winnerUpdateError) {
        console.error(
          "Failed to update gross winner's gross_wins:",
          winnerUpdateError
        );
        // Don't return error here as the round was already submitted successfully
      }
    }
  }

  return { success: true };
}
