import { YStack, Text } from "tamagui";

export function LeagueName() {
  return (
    <YStack gap="$3" style={{ alignItems: "center" }}>
      <Text fontWeight="bold" fontSize="$10" style={{ textAlign: "center" }}>
        Fairway Fleas
      </Text>
      <Text fontWeight="bold" fontSize="$8" style={{ textAlign: "center" }}>
        2025 Season
      </Text>
    </YStack>
  );
}
