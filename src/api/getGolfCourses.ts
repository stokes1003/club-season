import { supabase } from "../lib/supabase";

export async function searchCourses(searchQuery: string) {
  try {
    const { data, error } = await supabase.functions.invoke("search-courses", {
      body: { searchQuery },
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Search failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Network error details:", error);
    throw error;
  }
}
