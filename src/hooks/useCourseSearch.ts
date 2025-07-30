import { useState, useEffect } from "react";
import { useLocation } from "./useLocation";
import { searchCourses } from "../api/getGolfCourses";
import { getCoursesNearby, LocationData } from "../api/getCoursesNearby";
import { GolfCourse } from "../types/golfCourse";

export interface Course extends GolfCourse {
  distance?: number;
}

export type SearchMode = "text" | "location" | "both";

export function useCourseSearch() {
  const {
    location,
    loading: locationLoading,
    error: locationError,
    getCurrentLocation,
  } = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("location");

  const searchByText = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!query || query.length < 2) {
        setCourses([]);
        return;
      }

      const searchResults = await searchCourses(query);
      setCourses(searchResults || []);
    } catch (err) {
      console.error("Error searching courses:", err);
      setError("Failed to search courses");
    } finally {
      setLoading(false);
    }
  };

  const searchByLocation = async (userLocation?: LocationData) => {
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

      const nearbyCourses = await getCoursesNearby(currentLocation);
      setCourses(nearbyCourses || []);
    } catch (err) {
      console.error("Error fetching nearby courses:", err);
      setError("Failed to fetch nearby courses");
    } finally {
      setLoading(false);
    }
  };

  const searchByBoth = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get user's location first
      await getCurrentLocation();
      if (!location) {
        // Fall back to text search if location unavailable
        await searchByText(query);
        return;
      }

      // Search by text
      const textResults = await searchCourses(query);

      // Get nearby courses
      const nearbyResults = await getCoursesNearby(location);

      // Combine and deduplicate results
      const allCourses = [...(textResults || []), ...(nearbyResults || [])];
      const uniqueCourses = allCourses.filter(
        (course, index, self) =>
          index === self.findIndex((c) => c.id === course.id)
      );

      // Sort by relevance (text matches first, then by distance)
      const sortedCourses = uniqueCourses.sort((a, b) => {
        const aIsTextMatch = textResults?.some((c) => c.id === a.id);
        const bIsTextMatch = textResults?.some((c) => c.id === b.id);

        if (aIsTextMatch && !bIsTextMatch) return -1;
        if (!aIsTextMatch && bIsTextMatch) return 1;

        // If both are text matches or both are nearby, sort by distance
        return (a.distance || 999) - (b.distance || 999);
      });

      setCourses(sortedCourses);
    } catch (err) {
      console.error("Error in combined search:", err);
      setError("Failed to search courses");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string = searchQuery) => {
    setSearchQuery(query);

    switch (searchMode) {
      case "text":
        await searchByText(query);
        break;
      case "location":
        await searchByLocation();
        break;
      case "both":
        await searchByBoth(query);
        break;
    }
  };

  // Auto-search nearby courses when location is available and no search mode is set
  useEffect(() => {
    if (
      location &&
      searchMode === "location" &&
      courses.length === 0 &&
      !searchQuery
    ) {
      searchByLocation(location);
    }
  }, [location]);

  return {
    courses,
    loading: locationLoading || loading,
    error: locationError || error,
    searchQuery,
    searchMode,
    setSearchMode,
    performSearch,
    searchByText,
    searchByLocation,
    searchByBoth,
    location,
  };
}
