import { YStack, Text, XStack } from "tamagui";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { PlayerAvatar } from "../../UI/PlayerAvatar";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useGetPlayerById } from "src/hooks/useGetPlayerById";

export function LeagueCard({ league }: { league: any }) {
  const players = useGetPlayers(league.id);
  const ownerName = useGetPlayerById(league.created_by, league.id);
  return (
    <YStack width={320} gap="$4">
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
          size="$6"
          color={league.avatar_color}
        />
        <YStack gap="$2" flex={1}>
          <YStack gap="$1">
            <Text fontSize="$6" fontWeight="600">
              {league.name}
            </Text>
            <Text fontSize="$2" fontWeight="400">
              Est. {new Date(league.created_at).toLocaleDateString()}
            </Text>
          </YStack>

          <XStack gap="$2">
            {players.map((player) => (
              <PlayerAvatar
                key={player.player_id}
                name={player.name}
                avatarUrl={player.avatar_url}
                size="$2"
                color={player.player_color}
              />
            ))}
          </XStack>
        </YStack>

        <ChevronRight size={24} />
      </XStack>
    </YStack>
  );
}
