import { useEffect, useState } from "react";
import { LeagueCourse } from "src/types/courseSelection";
import { getLeagueCourses } from "src/api/getLeagueCourses";

export const useGetLeagueCourses = (leagueId: string) => {
  const [courses, setCourses] = useState<LeagueCourse[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getLeagueCourses(leagueId);
      setCourses(courses);
    };
    fetchCourses();
  }, [leagueId]);

  return courses;
};
