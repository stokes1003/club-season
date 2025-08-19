import { calculateGrossNetPoints } from "../utils/calculateGrossNetPoints";
import { submitScores } from "../api/scoreSubmission";
import { useState } from "react";
import { CourseSelection } from "../types/courseSelection";

export function useSubmitScores() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRound = async (submissionData: {
    leagueId: string;
    selectedCourse: CourseSelection;
    isMajor: string;
    majorName: string;
    scoresByPlayer: { [key: string]: { gross: number; hcp: number } };
    coursePhotoUrl: string;
    date: Date;
    onSuccess: () => void;
  }) => {
    const {
      leagueId,
      selectedCourse,
      isMajor,
      majorName,
      scoresByPlayer,
      coursePhotoUrl,
      date,
      onSuccess,
    } = submissionData;

    if (!selectedCourse?.id) {
      console.error("No course selected");
      return;
    }

    setIsSubmitting(true);

    try {
      const scoreList = Object.entries(scoresByPlayer).map(
        ([playerId, data]) => ({
          player: playerId,
          gross: data.gross,
          net: data.gross - data.hcp,
        })
      );

      const { gross: grossPoints, net: netPoints } = calculateGrossNetPoints(
        scoreList,
        isMajor === "yes"
      );

      const scoresData = Object.keys(scoresByPlayer).map((playerId) => ({
        league_player_id: playerId,
        gross: scoresByPlayer[playerId].gross,
        hcp: scoresByPlayer[playerId].hcp,
        net: scoresByPlayer[playerId].gross - scoresByPlayer[playerId].hcp,
        gross_points: grossPoints[playerId] || 0,
        net_points: netPoints[playerId] || 0,
      }));

      const { success, error } = await submitScores({
        league_id: leagueId,
        golfCourse: selectedCourse,
        date: date.toISOString(),
        is_major: isMajor === "yes",
        major_name: isMajor === "yes" ? majorName : null,
        scores: scoresData,
        coursePhotoUrl,
      });

      if (success) {
        onSuccess();
      } else {
        console.error("Failed to submit scores:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitRound, isSubmitting };
}
