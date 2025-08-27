import { YStack } from "tamagui";
import { UserDetails } from "./UserDetails";
import { RecentRounds } from "./RecentRounds";
import { IntroScreen } from "./IntroScreen";
import { useUser } from "../../../context/UserContext";
import { PlayerLeaguesList } from "./PlayerLeaguesList";

export function PlayerHome() {
  const { user } = useUser();

  return (
    <YStack gap="$8" style={{ alignItems: "center", justifyContent: "center" }}>
      {user?.leagues?.length === 0 ? (
        <IntroScreen />
      ) : (
        <>
          <UserDetails />
          <PlayerLeaguesList />
          <RecentRounds />
        </>
      )}
    </YStack>
  );
}
