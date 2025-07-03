import { YStack, Text, XStack, Button, View } from "tamagui";
import { SelectGolfCourse } from "./SelectGolfCourse";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { EnterPlayerScores } from "./EnterPlayerScores";
import { useEffect, useState } from "react";
import { ConfirmRoundSubmit } from "./ConfirmRoundSubmit";
import { useRouter } from "expo-router";
import { getAddScoresData } from "../../api/getAddScoresData";
import { ScoresFormHeader } from "./ScoresFormHeader";

type AddScoresData = {
  courses: {
    id: string;
    course_name: string;
  }[];
  players: {
    id: string;
    name: string;
    avatar_url: string;
  }[];
};

export function AddScores() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("select-golf-course");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const leagueId = "7d1b13c1-56cd-4dbf-80e5-f4362c4879de";
  const [addScoresData, setAddScoresData] = useState<AddScoresData | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const handleHome = () => {
    router.push("/");
    setCurrentStep("select-golf-course");
    setCurrentPlayerIndex(0);
  };
  const [scoresByPlayer, setScoresByPlayer] = useState<{
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
    };
  }>({});

  useEffect(() => {
    const fetchAddScoresData = async () => {
      const data = await getAddScoresData(leagueId);
      setAddScoresData(data);
    };
    fetchAddScoresData();
  }, []);

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

        {currentStep === "select-golf-course" && addScoresData && (
          <SelectGolfCourse
            setCurrentStep={setCurrentStep}
            addScoresData={addScoresData}
            setSelectedCourse={setSelectedCourse}
            selectedCourse={selectedCourse || ""}
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
          />
        )}
        {currentStep === "confirm-round-submit" && (
          <ConfirmRoundSubmit
            setCurrentStep={setCurrentStep}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setCurrentPlayerIndex={setCurrentPlayerIndex}
            handleHome={handleHome}
            scoresByPlayer={scoresByPlayer}
            selectedCourse={selectedCourse || ""}
          />
        )}
      </YStack>
    </YStack>
  );
}
