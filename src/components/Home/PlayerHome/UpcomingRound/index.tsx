import { YStack, Text, Button } from "tamagui";

export function UpcomingRound() {
  return (
    <YStack gap="$4" style={{ alignItems: "center" }}>
      <Text fontSize="$8" fontWeight="bold">
        Upcoming Rounds
      </Text>

      <YStack gap="$2" style={{ alignItems: "center" }}>
        <Text>No rounds scheduled</Text>
      </YStack>

      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$20"
      >
        Schedule Round
      </Button>
    </YStack>
  );
}
