import { YStack, XStack } from "tamagui";
import type { League } from "..";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { LeaguePlayerDetails } from "./LeaguePlayerDetails";
import { useUser } from "src/context/UserContext";
import { LeagueDetails } from "./LeagueDetails";
import { LeagueCourseDetails } from "./LeagueCourseDetails";
import { Player } from "src/types/player";

export function LeagueProfile({
  selectedLeague,
  setSelectedLeague,
  setSelectedPlayer,
  setSelectedCourse,
}: {
  selectedLeague: League;
  setSelectedLeague: (league: League | null) => void;
  setSelectedPlayer: (player: Player | null) => void;
  setSelectedCourse: (course: any) => void;
}) {
  const { user } = useUser();
  const isCommissioner = user?.id === selectedLeague?.created_by;

  // Early return if selectedLeague is not available
  if (!selectedLeague) {
    return null;
  }

  return (
    <YStack gap="$6" style={{ alignItems: "center", width: "100%" }}>
      <XStack style={{ alignItems: "flex-start", width: "100%" }}>
        <Pressable
          onPress={() => {
            setSelectedLeague(null);
          }}
        >
          <ArrowLeft />
        </Pressable>
      </XStack>
      <LeagueDetails selectedLeague={selectedLeague} />
      <YStack gap="$8">
        <LeaguePlayerDetails
          selectedLeague={selectedLeague}
          isCommissioner={isCommissioner}
          setSelectedPlayer={setSelectedPlayer}
        />
        <LeagueCourseDetails
          selectedLeague={selectedLeague}
          isCommissioner={isCommissioner}
          setSelectedCourse={setSelectedCourse}
        />
      </YStack>
    </YStack>
  );
}
