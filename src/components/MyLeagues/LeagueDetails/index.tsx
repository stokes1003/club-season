import { YStack, Text, Separator } from "tamagui";
import type { League } from "..";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { useGetPlayerById } from "src/hooks/useGetPlayerById";
import { useGetPlayers } from "src/hooks/useGetPlayers";

export function LeagueDetails({ selectedLeague }: { selectedLeague: League }) {
  const leagueOwner = useGetPlayerById(
    selectedLeague.created_by,
    selectedLeague.id
  );

  const players = useGetPlayers(selectedLeague.id);
  console.log(players);

  return (
    <>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <YStack>
          <PlayerAvatar
            name={selectedLeague.name}
            avatarUrl={selectedLeague.image_url}
            size="$8"
            color={selectedLeague.avatar_color || undefined}
          />
          <Text fontSize="$6" fontWeight="bold">
            {selectedLeague.name}
          </Text>
          <Text fontSize="$2" fontWeight="400">
            Est. {new Date(selectedLeague.created_at).toLocaleDateString()}
          </Text>
          <Text fontSize="$2" fontWeight="400">
            Created by: {leagueOwner}
          </Text>
        </YStack>

        <YStack>
          <Text fontSize="$6" fontWeight="bold">
            Players
          </Text>
          <YStack>
            {players?.map((player) => (
              <YStack key={player.player_id}>
                <PlayerAvatar
                  name={player.name}
                  avatarUrl={player.avatar_url}
                  size="$8"
                  color={player.player_color || undefined}
                />
                <Text fontSize="$2" fontWeight="400">
                  {player.name}
                </Text>
                <Text fontSize="$2" fontWeight="400">
                  {player.invite_email}
                </Text>
                <Separator width={320} borderColor="$black10" />
              </YStack>
            ))}
          </YStack>
        </YStack>
      </YStack>
    </>
  );
}
