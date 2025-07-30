import { supabase } from "../lib/supabase";

export interface LocationData {
  latitude: number;
  longitude: number;
}

export async function getCoursesNearby(location: LocationData) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "get-courses-nearby",
      {
        body: {
          latitude: location.latitude,
          longitude: location.longitude,
          limit: 5,
        },
      }
    );

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
