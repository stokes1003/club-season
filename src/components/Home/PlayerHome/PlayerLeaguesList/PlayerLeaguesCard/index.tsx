import { YStack, Text, XStack } from "tamagui";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { ChevronRight } from "@tamagui/lucide-icons";

export function PlayerLeaguesCard({ league }: { league: any }) {
  const players = useGetPlayers(league.id);

  return (
    <YStack width="100%" gap="$4">
      <XStack
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
        width="100%"
        gap="$4"
      >
        <PlayerAvatar
          name={league.name}
          avatarUrl={league.image_url}
          size="$4"
          color={league.avatar_color}
        />
        <YStack gap="$2" flex={1}>
          <YStack gap="$1">
            <Text fontSize="$5" fontWeight="600">
              {league.name}
            </Text>
            <Text fontSize="$2" fontWeight="400">
              Est. {new Date(league.created_at).toLocaleDateString()}
            </Text>
          </YStack>
        </YStack>

        <ChevronRight size={24} />
      </XStack>
    </YStack>
  );
}
