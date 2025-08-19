import { CourseSelection } from "../../types/courseSelection";
import { checkLeagueCourse } from "./checkLeagueCourse";
import { createLeagueCourse } from "./createLeagueCourse";
import { updateLeagueCourse } from "./updateLeagueCourse";

export async function getOrCreateLeagueCourse(
  leagueId: string,
  golfCourse: CourseSelection
) {
  try {
    // Check if course exists
    const { course, error, exists } = await checkLeagueCourse(
      leagueId,
      golfCourse
    );

    if (error) {
      console.error("Error checking league course:", error);
      return { success: false, error };
    }

    // If course exists, update times_played
    if (exists && course) {
      const updateResult = await updateLeagueCourse(course);
      return updateResult.success
        ? { success: true, course_id: course.external_course_id }
        : { success: false, error: updateResult.error };
    }

    // If course doesn't exist, create it
    const createResult = await createLeagueCourse(leagueId, golfCourse);
    return createResult.course
      ? { success: true, course_id: createResult.course.external_course_id }
      : { success: false, error: createResult.error };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error };
  }
}
