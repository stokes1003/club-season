import { YStack } from "tamagui";
import { useSelectedLeague } from "../../context/SelectedLeagueContext";
import { LeagueHome } from "./LeagueHome";
import { PlayerHome } from "./PlayerHome";

export function Home() {
  const { selectedLeague } = useSelectedLeague();

  return (
    <YStack style={{ alignItems: "center", justifyContent: "center" }} gap="$6">
      {!selectedLeague && <PlayerHome />}
      {selectedLeague && <LeagueHome selectedLeague={selectedLeague} />}
    </YStack>
  );
}
