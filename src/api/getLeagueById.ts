import { supabase } from "../lib/supabase";

export async function getLeagueById(leagueId: string) {
  const { data, error } = await supabase
    .from("leagues")
    .select("id, name, created_at, created_by, image_url")
    .eq("id", leagueId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  if (!data) {
    console.error("No league found");
    return null;
  }

  return data;
}
