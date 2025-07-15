import { Text, YStack } from "tamagui";
import { LeagueName } from "./LeagueName";
import { Leaderboard } from "./Leaderboard";
import { OfficialRounds } from "./OfficialRounds";
import { useSelectedLeague } from "../../context/SelectedLeagueContext";

export function Home() {
  const { selectedLeague } = useSelectedLeague();

  return (
    <YStack style={{ alignItems: "center", justifyContent: "center" }} gap="$6">
      {!selectedLeague && (
        <>
          <Text>No league selected</Text>
        </>
      )}
      {selectedLeague && (
        <>
          <LeagueName league={selectedLeague} />
          <Leaderboard league={selectedLeague} />
          <OfficialRounds league={selectedLeague} />
        </>
      )}
    </YStack>
  );
}
