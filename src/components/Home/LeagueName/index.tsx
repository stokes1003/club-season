import { YStack, Text } from "tamagui";
import { League } from "../../../context/SelectedLeagueContext";

export function LeagueName({ league }: { league: League }) {
  return (
    <YStack gap="$3" style={{ alignItems: "center" }}>
      <Text fontWeight="bold" fontSize="$10" style={{ textAlign: "center" }}>
        {league.name}
      </Text>
    </YStack>
  );
}
