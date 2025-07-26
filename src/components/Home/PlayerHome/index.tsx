import { YStack } from "tamagui";
import { UserStatsCard } from "./PlayerCard/UserStatsCard";
import { RecentRounds } from "./RecentRounds";
import { UpcomingRound } from "./UpcomingRound";

export function PlayerHome() {
  return (
    <YStack gap="$6" style={{ alignItems: "center", justifyContent: "center" }}>
      <UserStatsCard />
      <UpcomingRound />
      <RecentRounds />
    </YStack>
  );
}
