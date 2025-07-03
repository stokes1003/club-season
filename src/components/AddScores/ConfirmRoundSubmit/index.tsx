import { Text, YStack, XStack, Button, Avatar, View, Spinner } from "tamagui";

export function ConfirmRoundSubmit({
  setCurrentStep,
  isSubmitting,
  setIsSubmitting,

  setCurrentPlayerIndex,
  handleHome,
  scoresByPlayer,
  selectedCourse,
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
  selectedCourse: string;
}) {
  const submitRound = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("submitRound");
    setIsSubmitting(false);
    setCurrentStep("select-golf-course");
    setCurrentPlayerIndex(0);
    handleHome();
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <YStack gap="$4" style={{ alignItems: "center" }}>
          <Text fontWeight="bold" fontSize="$8">
            Confirm Round Details
          </Text>
          <Text fontWeight="bold" fontSize="$6">
            {selectedCourse}
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
          onPress={submitRound}
          disabled={isSubmitting}
          width="$14"
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
