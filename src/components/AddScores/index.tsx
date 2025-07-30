import { YStack } from "tamagui";
import { SelectGolfCourse } from "./SelectGolfCourse";
import { EnterPlayerScores } from "./EnterPlayerScores";
import { useEffect, useState } from "react";
import { ConfirmRoundSubmit } from "./ConfirmRoundSubmit";
import { useRouter } from "expo-router";
import { getAddScoresData } from "../../api/getAddScoresData";
import { ScoresFormHeader } from "./ScoresFormHeader";
import { SelectLeague } from "./SelectLeague";
import { submitScores } from "../../api/submitScores";
import { useCalculateGrossNetPoints } from "../../hooks/useCalculateGrossNetPoints";
import { useLeaderboard } from "../../context/LeaderboardContext";
import { useOfficalRounds } from "../../context/OfficalRoundsContext";
import { CourseSelection } from "src/types/courseSelection";

type AddScoresData = {
  courses: {
    id: string;
    course_name: string;
  }[];
  players: {
    id: string;
    display_name: string;
    avatar_url: string;
  }[];
};

export function AddScores() {
  const router = useRouter();
  const { triggerRefresh: triggerLeaderboardRefresh } = useLeaderboard();
  const { triggerRefresh: triggerOfficalRoundsRefresh } = useOfficalRounds();
  const [currentStep, setCurrentStep] = useState("select-league");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leagueId, setLeagueId] = useState<string>("");
  const [addScoresData, setAddScoresData] = useState<AddScoresData | null>(
    null
  );
  const [isMajor, setIsMajor] = useState("no");
  const [majorName, setMajorName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseSelection | null>(
    null
  );
  const [scoresByPlayer, setScoresByPlayer] = useState<{
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
      display_name: string;
    };
  }>({});
  const handleHome = () => {
    router.push("/");
    setCurrentStep("select-league");
    setCurrentPlayerIndex(0);
    setIsMajor("no");
    setMajorName("");
  };

  const submitRound = async () => {
    if (!selectedCourse?.id) {
      console.error("No course selected");
      setIsSubmitting(false);
      return;
    }

    const scoreList = Object.entries(scoresByPlayer).map(
      ([playerId, data]) => ({
        player: playerId,
        gross: data.gross,
        net: data.gross - data.hcp,
      })
    );

    const { gross: grossPoints, net: netPoints } = useCalculateGrossNetPoints(
      scoreList,
      isMajor === "yes"
    );

    setIsSubmitting(true);

    const scoresData = Object.keys(scoresByPlayer).map((playerId) => ({
      league_player_id: playerId,
      gross: scoresByPlayer[playerId].gross,
      hcp: scoresByPlayer[playerId].hcp,
      net: scoresByPlayer[playerId].gross - scoresByPlayer[playerId].hcp,
      gross_points: grossPoints[playerId] || 0,
      net_points: netPoints[playerId] || 0,
    }));

    console.log("Submitting scores data:", {
      league_id: leagueId,
      course_id: selectedCourse.id,
      date: new Date().toISOString(),
      is_major: isMajor === "yes",
      major_name: isMajor === "yes" ? majorName : null,
      scores: scoresData,
    });

    const { success, error } = await submitScores({
      league_id: leagueId,
      golfCourse: selectedCourse!,
      date: new Date().toISOString(),
      is_major: isMajor === "yes",
      major_name: isMajor === "yes" ? majorName : null,
      scores: scoresData,
    });

    if (success) {
      console.log("Scores submitted successfully");
      setCurrentStep("select-golf-course");
      setCurrentPlayerIndex(0);
      handleHome();
      triggerLeaderboardRefresh();
      triggerOfficalRoundsRefresh();
    } else {
      console.error("Failed to submit scores:", error);
    }

    setIsSubmitting(false);
    setScoresByPlayer({});
    setSelectedCourse(null);
    setIsMajor("no");
    setMajorName("");
  };

  useEffect(() => {
    setAddScoresData(null);
    if (leagueId) {
      const fetchAddScoresData = async () => {
        const data = await getAddScoresData(leagueId);
        setAddScoresData(data);
      };
      fetchAddScoresData();
    }
  }, [leagueId]);

  console.log("AddScoresData", addScoresData);

  return (
    <YStack gap="$8" style={{ alignItems: "center" }} width="100%">
      <YStack gap="$8" width="100%">
        <ScoresFormHeader
          currentStep={currentStep}
          handleHome={handleHome}
          currentPlayerIndex={currentPlayerIndex}
          setCurrentStep={setCurrentStep}
          setCurrentPlayerIndex={setCurrentPlayerIndex}
        />
        {currentStep === "select-league" && (
          <SelectLeague
            setLeagueId={setLeagueId}
            leagueId={leagueId}
            setCurrentStep={setCurrentStep}
          />
        )}

        {currentStep === "select-golf-course" && (
          <SelectGolfCourse
            setCurrentStep={setCurrentStep}
            setSelectedCourse={setSelectedCourse}
            selectedCourse={selectedCourse}
            isMajor={isMajor}
            setIsMajor={setIsMajor}
            majorName={majorName}
            setMajorName={setMajorName}
            leagueId={leagueId}
          />
        )}
        {currentStep === "enter-player-scores" && addScoresData && (
          <EnterPlayerScores
            setCurrentStep={setCurrentStep}
            currentPlayerIndex={currentPlayerIndex}
            setCurrentPlayerIndex={setCurrentPlayerIndex}
            addScoresData={addScoresData}
            setScoresByPlayer={setScoresByPlayer}
            scoresByPlayer={scoresByPlayer}
            isMajor={isMajor}
          />
        )}
        {currentStep === "confirm-round-submit" && (
          <ConfirmRoundSubmit
            isSubmitting={isSubmitting}
            handleHome={handleHome}
            scoresByPlayer={scoresByPlayer}
            selectedCourse={selectedCourse}
            leagueId={leagueId}
            isMajor={isMajor}
            majorName={majorName}
            submitRound={submitRound}
          />
        )}
      </YStack>
    </YStack>
  );
}
