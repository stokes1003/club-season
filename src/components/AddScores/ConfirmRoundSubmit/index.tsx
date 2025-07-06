import { Text, YStack, XStack, Button, Avatar, View, Spinner } from "tamagui";
import { submitScores } from "../../../api/submitScores";

export function ConfirmRoundSubmit({
  setCurrentStep,
  isSubmitting,
  setIsSubmitting,
  setCurrentPlayerIndex,
  handleHome,
  scoresByPlayer,
  selectedCourse,
  leagueId,
}: {
  setCurrentStep: (step: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;

  setCurrentPlayerIndex: (currentPlayerIndex: number) => void;
  handleHome: () => void;
  scoresByPlayer: {
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
    };
  };
  selectedCourse: { id: string; course_name: string } | null;
  leagueId: string;
}) {
  const submitRound = async () => {
    if (!selectedCourse?.id) {
      console.error("No course selected");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    const { success, error } = await submitScores({
      league_id: leagueId,
      course_id: selectedCourse.id,
      date: new Date().toISOString(),
      is_major: false,
      major_name: null,
      scores: Object.keys(scoresByPlayer).map((playerId) => ({
        player_id: playerId,
        gross: scoresByPlayer[playerId].gross,
        hcp: scoresByPlayer[playerId].hcp,
        net: scoresByPlayer[playerId].gross - scoresByPlayer[playerId].hcp,
      })),
    });
    if (success) {
      console.log("Scores submitted successfully");
      setCurrentStep("select-golf-course");
      setCurrentPlayerIndex(0);
      handleHome();
    } else {
      console.error("Failed to submit scores:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <YStack gap="$4" style={{ alignItems: "center" }}>
          <Text fontWeight="bold" fontSize="$8">
            Confirm Round Details
          </Text>
          <Text fontWeight="bold" fontSize="$6">
            {selectedCourse?.course_name}
          </Text>
          <Text fontSize="$5" color="$black11">
            {new Date().toLocaleDateString()}
          </Text>
        </YStack>
        <XStack gap="$4" style={{ alignItems: "center" }}>
          <Text width="$6" style={{ textAlign: "center" }} fontWeight="bold">
            Player
          </Text>
          <Text width="$6" style={{ textAlign: "center" }} fontWeight="bold">
            Gross
          </Text>
          <Text width="$6" style={{ textAlign: "center" }} fontWeight="bold">
            HCP
          </Text>
          <Text width="$6" style={{ textAlign: "center" }} fontWeight="bold">
            Net
          </Text>
        </XStack>
        <YStack gap="$4" style={{ alignItems: "center" }}>
          {Object.keys(scoresByPlayer).map((playerId) => (
            <XStack key={playerId} gap="$4" style={{ alignItems: "center" }}>
              <View width="$6" style={{ alignItems: "center" }}>
                <Avatar circular size="$4">
                  <Avatar.Image src={scoresByPlayer[playerId].avatar_url} />
                </Avatar>
              </View>
              <Text width="$6" style={{ textAlign: "center" }} fontSize="$5">
                {scoresByPlayer[playerId].gross}
              </Text>
              <Text width="$6" style={{ textAlign: "center" }} fontSize="$5">
                {scoresByPlayer[playerId].hcp}
              </Text>
              <Text width="$6" style={{ textAlign: "center" }} fontSize="$5">
                {scoresByPlayer[playerId].gross - scoresByPlayer[playerId].hcp}
              </Text>
            </XStack>
          ))}
        </YStack>
      </YStack>
      <XStack gap="$4">
        <Button
          fontSize="$5"
          variant="outlined"
          borderColor="$blue10"
          color="$blue10"
          fontWeight="bold"
          onPress={handleHome}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          bg="$blue10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width="$14"
          onPress={submitRound}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner size="small" color="$white1" />
          ) : (
            "Confirm & Submit"
          )}
        </Button>
      </XStack>
    </YStack>
  );
}
