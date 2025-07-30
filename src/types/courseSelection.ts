import { GolfCourse } from "./golfCourse";
import { NearbyCourse } from "../hooks/useNearbyCourses";
import { Location, Tees } from "./golfCourse";

export type LeagueCourse = {
  id: string;
  course_name: string;
  club_name: string;
  times_played: number;
  external_course_id: number;
  location: Location;
  tees: Tees;
};

export type CourseSelection = GolfCourse | LeagueCourse | NearbyCourse;
