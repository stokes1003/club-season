import { createClient } from "@supabase/supabase-js";

const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY
);

type Score = {
  player: string;
  player_img: string;
  gross: number;
  hcp: number;
  net: number;
};

type Round = {
  _id: string;
  course: string;
  course_img: string;
  date: string;
  scores: Score[];
};

export async function getLeagueRounds(leagueId: string): Promise<Round[]> {
  const { data, error } = await supabase.rpc("get_league_rounds", {
    league_id: leagueId,
  });

  if (error) {
    console.error("Error fetching rounds:", error);
    return [];
  }

  return data.map((round) => ({
    _id: round.round_id,
    course: round.course_name,
    course_img: round.course_img,
    isMajor: round.is_major,
    majorName: round.major_name,
    date: round.round_date,
    scores: round.scores,
  }));
}
