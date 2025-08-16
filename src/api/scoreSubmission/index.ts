import { createRound } from "./createRound";
import { insertScores } from "./insertScores";
import { updatePlayerPoints } from "./updatePlayerPoints";
import { updateCourseTimes } from "./updateCourseTimes";
import { getOrCreateLeagueCourse } from "../leagueCourses";
import { CourseSelection } from "src/types/courseSelection";

export async function submitScores({
  league_id,
  golfCourse,
  date,
  is_major,
  major_name,
  scores,
}: {
  league_id: string;
  golfCourse: CourseSelection;
  date: string;
  is_major: boolean;
  major_name: string | null;
  scores: {
    league_player_id: string;
    gross: number;
    hcp: number;
    net: number;
    gross_points: number;
    net_points: number;
  }[];
}) {
  try {
    const courseResult = await getOrCreateLeagueCourse(league_id, golfCourse);

    if (!courseResult.success) {
      console.error("Failed to get/create league course:", courseResult.error);
      return { success: false, error: courseResult.error };
    }

    const roundResult = await createRound(
      league_id,
      courseResult.course_id,
      date,
      is_major,
      major_name
    );

    if (!roundResult.success) {
      return { success: false, error: roundResult.error };
    }

    const courseTimesResult = await updateCourseTimes(
      courseResult.course_id,
      league_id
    );

    if (!courseTimesResult.success) {
      return { success: false, error: courseTimesResult.error };
    }

    const scoresResult = await insertScores(roundResult.round.id, scores);

    if (!scoresResult.success) {
      return { success: false, error: scoresResult.error };
    }

    const playerPointsResult = await updatePlayerPoints(league_id, scores);

    if (!playerPointsResult.success) {
      return { success: false, error: playerPointsResult.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting scores:", error);
    return { success: false, error };
  }
}
