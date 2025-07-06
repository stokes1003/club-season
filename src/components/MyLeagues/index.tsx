import { Text, Button, YStack } from "tamagui";
import { LeaguesCard } from "./LeaguesCard";

export function MyLeagues() {
  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Text fontSize="$8" fontWeight="bold">
          MY LEAGUES
        </Text>
      </YStack>
      <YStack gap="$4">
        <LeaguesCard />
        <LeaguesCard />
        <LeaguesCard />
      </YStack>

      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$20"
      >
        Create A League
      </Button>
    </YStack>
  );
}
