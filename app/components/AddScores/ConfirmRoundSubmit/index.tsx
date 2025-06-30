import { Text, YStack, XStack, Button, Avatar, View, Spinner } from "tamagui";

export function ConfirmRoundSubmit({
  setCurrentStep,
  isSubmitting,
  setIsSubmitting,

  setCurrentPlayerIndex,
  handleHome,
}: {
  setCurrentStep: (step: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;

  setCurrentPlayerIndex: (currentPlayerIndex: number) => void;
  handleHome: () => void;
}) {
  const submitRound = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("submitRound");
    setIsSubmitting(false);
    setCurrentStep("select-golf-course");
    setCurrentPlayerIndex(0);
  };

  return (
    <YStack gap="$4" style={{ alignItems: "center" }}>
      <Text fontWeight="bold" fontSize="$6">
        Confirm Round Details
      </Text>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Text fontWeight="bold" fontSize="$5">
          Golf Course
        </Text>
        <XStack gap="$4" style={{ alignItems: "center" }}>
          <Text width="$6" style={{ textAlign: "center" }}>
            Player
          </Text>
          <Text width="$6" style={{ textAlign: "center" }}>
            Gross
          </Text>
          <Text width="$6" style={{ textAlign: "center" }}>
            Handicap
          </Text>
          <Text width="$6" style={{ textAlign: "center" }}>
            Net
          </Text>
        </XStack>
        <XStack gap="$4" style={{ alignItems: "center" }}>
          <View width="$6" style={{ alignItems: "center" }}>
            <Avatar circular size="$4">
              <Avatar.Fallback backgroundColor="red" />
            </Avatar>
          </View>
          <Text width="$6" style={{ textAlign: "center" }}>
            108
          </Text>
          <Text width="$6" style={{ textAlign: "center" }}>
            14
          </Text>
          <Text width="$6" style={{ textAlign: "center" }}>
            78
          </Text>
        </XStack>
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
