import { supabase } from "src/lib/supabase";

export const getPlayerById = async (userId: string) => {
  const { data, error } = await supabase
    .from("players")
    .select("name")
    .eq("user_id", userId)
    .single();

  return data?.name || null;
};
