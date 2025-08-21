import { YStack } from "tamagui";
import { UserStatsCard } from "./PlayerCard/UserStatsCard";
import { RecentRounds } from "./RecentRounds";
import { IntroScreen } from "./IntroScreen";
import { useUser } from "../../../context/UserContext";

export function PlayerHome() {
  const { user } = useUser();

  return (
    <YStack gap="$6" style={{ alignItems: "center", justifyContent: "center" }}>
      {user?.leagues?.length === 0 ? (
        <IntroScreen />
      ) : (
        <>
          <UserStatsCard />
          <RecentRounds />
        </>
      )}
    </YStack>
  );
}
