import { Text, XStack, YStack, Separator, Card } from "tamagui";
import { Player } from "src/types/player";
import { getPlayerDisplayNames } from "src/utils/playerNameUtils";
import { League } from "../../../context/SelectedLeagueContext";

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
                width="$4"
                style={{ textAlign: "center" }}
              >
                Rank
              </Text>
              <Text
                fontWeight="bold"
                width="$8"
                style={{ textAlign: "center" }}
              >
                Player
              </Text>
              <Text
                fontWeight="bold"
                width="$5"
                style={{ textAlign: "center" }}
              >
                Points
              </Text>
              <Text
                fontWeight="bold"
                width="$5"
                style={{ textAlign: "center" }}
              >
                Wins
              </Text>
              <Text
                fontWeight="bold"
                width="$5"
                style={{ textAlign: "center" }}
              >
                AVG
              </Text>
              <Text
                fontWeight="bold"
                width="$5"
                style={{ textAlign: "center" }}
              >
                Best
              </Text>
            </XStack>
            <Separator width={330} borderColor="$black10" />
            {sortedPlayers.map((playerData: Player, index: number) => (
              <XStack
                key={playerData.player_id}
                style={{ justifyContent: "center", width: 320 }}
              >
                <Text width="$4" style={{ textAlign: "center" }}>
                  {index + 1}
                </Text>
                <Text
                  width="$8"
                  fontWeight="bold"
                  style={{ textAlign: "center" }}
                >
                  {playerDisplayNames[index]}
                </Text>
                <Text width="$5" style={{ textAlign: "center" }}>
                  {isNet
                    ? playerData.net_points || 0
                    : playerData.gross_points || 0}
                </Text>
                <Text width="$5" style={{ textAlign: "center" }}>
                  {isNet
                    ? playerData.net_wins || 0
                    : playerData.gross_wins || 0}
                </Text>
                <Text width="$5" style={{ textAlign: "center" }}>
                  {isNet
                    ? playerData.avg_net && playerData.avg_net > 0
                      ? parseFloat(playerData.avg_net.toString()).toFixed(1)
                      : "-"
                    : playerData.avg_gross && playerData.avg_gross > 0
                    ? parseFloat(playerData.avg_gross.toString()).toFixed(1)
                    : "-"}
                </Text>
                <Text width="$5" style={{ textAlign: "center" }}>
                  {isNet
                    ? playerData.best_net || 0
                    : playerData.best_gross || 0}
                </Text>
              </XStack>
            ))}
          </YStack>
        </Card>
      </YStack>
    </YStack>
  );
}
