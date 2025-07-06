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
    player_id: string;
    gross: number;
    hcp: number;
    net: number;
  }[];
}) {
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

  return { success: true };
}
