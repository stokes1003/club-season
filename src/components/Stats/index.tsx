import { YStack } from "tamagui";
import { UserStats } from "./UserStats";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";
import { LeagueStats } from "./LeagueStats";

export function Stats() {
  const { selectedLeague } = useSelectedLeague();
  return (
    <YStack gap="$4" pb="$5">
      {selectedLeague ? <LeagueStats /> : <UserStats />}
    </YStack>
  );
}
