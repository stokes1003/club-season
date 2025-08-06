import { YStack, XStack, Text } from "tamagui";
import type { League } from "..";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { LeaguePlayerDetails } from "./LeaguePlayerDetails";
import { useGetPlayerById } from "src/hooks/useGetPlayerById";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { LeagueCourseDetails } from "./LeagueCourseDetails";
import { useUser } from "src/context/UserContext";

export function LeagueDetails({
  selectedLeague,
  setSelectedLeague,
}: {
  selectedLeague: League;
  setSelectedLeague: (league: League | null) => void;
}) {
  const commissioner = useGetPlayerById(
    selectedLeague.created_by,
    selectedLeague.id
  );
  const { user } = useUser();
  const isCommissioner = user?.id === selectedLeague.created_by;

  return (
    <YStack gap="$6" style={{ alignItems: "center", width: "100%" }}>
      <XStack style={{ alignItems: "flex-start", width: "100%" }}>
        <Pressable onPress={() => setSelectedLeague(null)}>
          <ArrowLeft />
        </Pressable>
      </XStack>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <PlayerAvatar
          name={selectedLeague.name}
          avatarUrl={selectedLeague.image_url}
          size="$10"
          color={selectedLeague.avatar_color || undefined}
        />

        <YStack gap="$2" style={{ alignItems: "center" }}>
          <Text fontSize="$8" fontWeight="bold">
            {selectedLeague.name}
          </Text>
          <Text fontSize="$2" fontWeight="400">
            Commissioner: {commissioner}
          </Text>
          <Text fontSize="$2" fontWeight="400">
            Est. {new Date(selectedLeague.created_at).toLocaleDateString()}
          </Text>
        </YStack>
      </YStack>
      <YStack gap="$8">
        <LeaguePlayerDetails
          selectedLeague={selectedLeague}
          isCommissioner={isCommissioner}
        />
        <LeagueCourseDetails
          selectedLeague={selectedLeague}
          isCommissioner={isCommissioner}
        />
      </YStack>
    </YStack>
  );
}
