import { useEffect, useState } from "react";
import { LeagueCourse } from "src/types/courseSelection";
import { getLeagueCourses } from "src/api/getLeagueCourses";

export const useGetLeagueCourses = (leagueId: string) => {
  const [courses, setCourses] = useState<LeagueCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!leagueId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const courses = await getLeagueCourses(leagueId);

        setCourses(courses);

        setLoading(false);
      } catch (error) {
        console.error("❌ useGetLeagueCourses: Error in fetchCourses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [leagueId]);

  return courses;
};
