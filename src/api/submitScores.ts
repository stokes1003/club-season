import { supabase } from "../lib/supabase";

export async function submitScores({
  league_id,
  course_id,
  date,
  is_major,
  major_name,
  scores,
}: {
  league_id: string;
  course_id: string;
  date: string;
  is_major: boolean;
  major_name: string | null;
  scores: {
    league_player_id: string;
    gross: number;
    hcp: number;
    net: number;
    gross_points: number;
    net_points: number;
  }[];
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
    console.error("Round data:", {
      league_id,
      course_id,
      date,
      is_major,
      major_name,
    });
    return { success: false, error: roundError };
  }

  const round_id = round.id;

  // 2. Insert scores using league_player_id
  const { error: scoresError } = await supabase.from("round_scores").insert(
    scores.map((score) => ({
      round_id,
      league_player_id: score.league_player_id,
      gross_score: score.gross,
      handicap: score.hcp,
      net_score: score.net,
    }))
  );

  if (scoresError) {
    console.error("Failed to insert scores:", scoresError);
    console.error("Scores data:", scores);
    return { success: false, error: scoresError };
  }

  // 3. Update league_players with new points
  for (const score of scores) {
    // First get current points
    const { data: currentPlayer, error: fetchError } = await supabase
      .from("league_players")
      .select("gross_points, net_points")
      .eq("id", score.league_player_id)
      .single();

    if (fetchError || !currentPlayer) {
      console.error(
        "Failed to fetch current points for league_player:",
        score.league_player_id,
        fetchError
      );
      return { success: false, error: fetchError };
    }

    // Calculate new totals
    const newGrossPoints =
      (currentPlayer.gross_points || 0) + score.gross_points;
    const newNetPoints = (currentPlayer.net_points || 0) + score.net_points;

    // Update with new totals
    const { error: updateError } = await supabase
      .from("league_players")
      .update({
        gross_points: newGrossPoints,
        net_points: newNetPoints,
      })
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
