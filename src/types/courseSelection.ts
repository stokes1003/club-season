import { GolfCourse } from "./golfCourse";
import { Location, Tees } from "./golfCourse";

export type LeagueCourse = {
  id: string;
  course_name: string;
  club_name: string;
  times_played: number;
  external_course_id: number;
  location: Location;
  tees: Tees;
  photo_url: string;
};

export type CourseSelection = GolfCourse | LeagueCourse;
