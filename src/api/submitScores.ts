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
    const { error: updateError } = await supabase.rpc(
      "increment_league_player_points",
      {
        p_gross_points: score.gross_points,
        p_league_id: league_id,
        p_net_points: score.net_points,
        p_player_id: score.league_player_id,
      }
    );

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
