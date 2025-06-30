import { Button, Input, Text, YStack } from "tamagui";

export function SelectGolfCourse({
  setCurrentStep,
}: {
  setCurrentStep: (step: string) => void;
}) {
  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$6" style={{ alignItems: "center" }}>
        <Text fontWeight="bold" fontSize="$6">
          Select Golf Course
        </Text>
        <Input width="$18" borderWidth={2} placeholder="Type to search" />
      </YStack>
      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$14"
        onPress={() => setCurrentStep("enter-player-scores")}
      >
        Submit Course
      </Button>
    </YStack>
  );
}
