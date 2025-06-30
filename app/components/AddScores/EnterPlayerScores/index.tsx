import { Avatar, Button, Input, Text, View, XStack, YStack } from "tamagui";

export function EnterPlayerScores({
  setCurrentStep,
  currentPlayerIndex,
  setCurrentPlayerIndex,
}: {
  setCurrentStep: (step: string) => void;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
}) {
  return (
    <YStack gap="$6" style={{ alignItems: "center" }}>
      <Text fontWeight="bold" fontSize="$6">
        Enter Player Scores
      </Text>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <XStack style={{ alignItems: "center" }} gap="$2">
          <Avatar circular size="$3">
            <Avatar.Fallback backgroundColor="red" />
          </Avatar>
          <Text>Player Name</Text>
        </XStack>
        <YStack gap="$4">
          <Input placeholder="Player's HCP" width="$12" />
          <Input placeholder="Player's Gross" width="$12" />
        </YStack>
      </YStack>
      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$14"
        onPress={() => {
          if (currentPlayerIndex === 3) {
            setCurrentStep("confirm-round-submit");
          } else setCurrentPlayerIndex(currentPlayerIndex + 1);
        }}
      >
        {currentPlayerIndex === 3 ? "Submit Scores" : "Next Player"}
      </Button>
    </YStack>
  );
}
