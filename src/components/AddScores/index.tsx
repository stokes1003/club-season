import { YStack } from "tamagui";
import { SelectGolfCourse } from "./SelectGolfCourse";
import { EnterPlayerScores } from "./EnterPlayerScores";
import { useEffect, useState } from "react";
import { ConfirmRoundSubmit } from "./ConfirmRoundSubmit";
import { useRouter } from "expo-router";
import { getAddScoresData } from "../../api/getAddScoresData";
import { ScoresFormHeader } from "./ScoresFormHeader";
import { SelectLeague } from "./SelectLeague";
import { CourseSelection } from "src/types/courseSelection";
import { useSubmitScores } from "../../hooks/useSubmitScores";
import { useLeaderboard } from "../../context/LeaderboardContext";
import { useOfficalRounds } from "../../context/OfficalRoundsContext";

type AddScoresData = {
  courses: {
    id: string;
    course_name: string;
  }[];
  players: {
    id: string;
    display_name: string;
    avatar_url: string;
    player_color: string;
  }[];
};

export function AddScores() {
  const router = useRouter();
  const { submitRound, isSubmitting } = useSubmitScores();
  const [currentStep, setCurrentStep] = useState("select-league");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [leagueId, setLeagueId] = useState<string>("");
  const [addScoresData, setAddScoresData] = useState<AddScoresData | null>(
    null
  );
  const [isMajor, setIsMajor] = useState("no");
  const [majorName, setMajorName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseSelection | null>(
    null
  );
  const { triggerRefresh: triggerLeaderboardRefresh } = useLeaderboard();
  const { triggerRefresh: triggerOfficalRoundsRefresh } = useOfficalRounds();
  const [scoresByPlayer, setScoresByPlayer] = useState<{
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
      display_name: string;
      player_color: string;
    };
  }>({});
  const handleHome = () => {
    router.push("/");
    setCurrentStep("select-league");
    setCurrentPlayerIndex(0);
    setIsMajor("no");
    setMajorName("");
  };

  const handleSubmitRound = () => {
    submitRound({
      leagueId,
      selectedCourse,
      isMajor,
      majorName,
      scoresByPlayer,
      onSuccess: () => {
        handleHome();
        setScoresByPlayer({});
        setSelectedCourse(null);
        triggerLeaderboardRefresh();
        triggerOfficalRoundsRefresh();
      },
    });
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
            handleSubmitRound={handleSubmitRound}
          />
        )}
      </YStack>
    </YStack>
  );
}
