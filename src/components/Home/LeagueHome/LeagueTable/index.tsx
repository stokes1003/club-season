import { Text, XStack, YStack, Separator, Card } from "tamagui";
import { Player } from "src/types/player";
import { getPlayerDisplayNames } from "src/utils/playerNameUtils";
import { League } from "../../../../context/SelectedLeagueContext";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";

export function LeagueTable({
  isNet,
  players,
  league,
}: {
  league: League;
  isNet: boolean;
  players: Player[];
}) {
  const sortedPlayers = players.sort((a, b) => {
    if (isNet) {
      return b.net_points - a.net_points;
    }
    return b.gross_points - a.gross_points;
  });
  const playerDisplayNames = getPlayerDisplayNames(players);
  return (
    <YStack gap="$4" style={{ alignItems: "center" }}>
      <YStack>
        <Text fontWeight="bold" fontSize="$8" style={{ textAlign: "center" }}>
          League Table
        </Text>
      </YStack>
      <YStack>
        <Card
          alignItems="center"
          justifyContent="center"
          backgroundColor="white"
          borderWidth={0}
          borderRadius="$6"
          mx="$2"
          px="$4"
          py="$6"
          style={{
            boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <YStack style={{ alignItems: "center" }} gap="$3">
            <XStack style={{ justifyContent: "center", width: 320 }}>
              <Text
                fontWeight="bold"
                width="$5"
                style={{ textAlign: "center" }}
              >
                Rank
              </Text>
              <Text
                fontWeight="bold"
                width="$10"
                style={{ textAlign: "center" }}
              >
                Player
              </Text>
              <Text
                fontWeight="bold"
                width="$8"
                style={{ textAlign: "center" }}
              >
                Points
              </Text>
              <Text
                fontWeight="bold"
                width="$8"
                style={{ textAlign: "center" }}
              >
                Wins
              </Text>
            </XStack>
            <Separator width={330} borderColor="$black10" />
            {sortedPlayers.map((playerData: Player, index: number) => (
              <XStack
                key={playerData.player_id}
                style={{
                  justifyContent: "center",
                  width: 320,
                  alignItems: "center",
                }}
              >
                <Text width="$5" style={{ textAlign: "center" }}>
                  {index + 1}
                </Text>
                <XStack style={{ alignItems: "center" }} gap="$2" width="$10">
                  <PlayerAvatar avatarUrl={playerData.avatar_url} size="$2" />
                  <Text fontWeight="bold" style={{ textAlign: "center" }}>
                    {playerDisplayNames[index]}
                  </Text>
                </XStack>

                <Text width="$8" style={{ textAlign: "center" }}>
                  {isNet
                    ? playerData.net_points || 0
                    : playerData.gross_points || 0}
                </Text>
                <Text width="$8" style={{ textAlign: "center" }}>
                  {isNet
                    ? playerData.net_wins || 0
                    : playerData.gross_wins || 0}
                </Text>
              </XStack>
            ))}
          </YStack>
        </Card>
      </YStack>
    </YStack>
  );
}
