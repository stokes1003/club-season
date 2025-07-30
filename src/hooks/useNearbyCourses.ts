import { useState, useEffect } from "react";
import { useLocation } from "./useLocation";
import { getCoursesNearby, LocationData } from "../api/getCoursesNearby";
import { GolfCourse } from "../types/golfCourse";

export interface NearbyCourse extends GolfCourse {
  distance?: number;
}

export function useNearbyCourses() {
  const {
    location,
    loading: locationLoading,
    error: locationError,
    getCurrentLocation,
  } = useLocation();
  const [courses, setCourses] = useState<NearbyCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyCourses = async (userLocation?: LocationData) => {
    try {
      setLoading(true);
      setError(null);

      // Get location if not provided
      let currentLocation = userLocation;
      if (!currentLocation) {
        await getCurrentLocation();
        if (!location) {
          setError("Unable to get your location");
          return;
        }
        currentLocation = location;
      }

      // Fetch nearby courses
      const nearbyCourses = await getCoursesNearby(currentLocation);
      setCourses(nearbyCourses || []);
    } catch (err) {
      console.error("Error fetching nearby courses:", err);
      setError("Failed to fetch nearby courses");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when location is available
  useEffect(() => {
    if (location && courses.length === 0) {
      fetchNearbyCourses(location);
    }
  }, [location]);

  return {
    courses,
    loading: locationLoading || loading,
    error: locationError || error,
    fetchNearbyCourses,
    location,
  };
}
