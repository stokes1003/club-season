import { YStack, Text } from "tamagui";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { League } from "src/components/MyLeagues";
import { useGetPlayerById } from "src/hooks/useGetPlayerById";

export function LeagueDetails({ selectedLeague }: { selectedLeague: League }) {
  const commissioner = useGetPlayerById(
    selectedLeague.created_by,
    selectedLeague.id
  );
  return (
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
        <Text fontSize="$5" fontWeight="500">
          Commissioner: {commissioner}
        </Text>
        <Text fontSize="$4" fontWeight="400">
          Est. {new Date(selectedLeague.created_at).toLocaleDateString()}
        </Text>
      </YStack>
    </YStack>
  );
}
