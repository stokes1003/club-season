import { ScrollView, Text, XStack, YStack } from "tamagui";
import { PlayerCard } from "../../PlayerHome/PlayerCard";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { useLeaderboard } from "src/context/LeaderboardContext";
import { League } from "src/context/SelectedLeagueContext";
import { NetGrossTabs } from "../../../NetGrossTabs/index";

export function TopThree({
  league,
  isNet,
  setIsNet,
}: {
  league: League;
  isNet: boolean;
  setIsNet: (isNet: boolean) => void;
}) {
  const { refreshTrigger } = useLeaderboard();

  const leagueId = league.id;

  const players = useGetPlayers(leagueId ?? "", refreshTrigger);

  const netSortedPlayers = () => {
    return [...players].sort((a, b) => {
      if (b.net_points !== a.net_points) {
        return b.net_points - a.net_points;
      }
      return b.gross_points - a.gross_points;
    });
  };
  const grossSortedPlayers = () => {
    return [...players].sort((a, b) => {
      if (b.gross_points !== a.gross_points) {
        return b.gross_points - a.gross_points;
      }
      return b.net_points - a.net_points;
    });
  };
  const sortedPlayers = isNet
    ? netSortedPlayers().slice(0, 3)
    : grossSortedPlayers().slice(0, 3);

  return (
    <YStack width="100%">
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Text fontWeight="bold" fontSize="$8" style={{ textAlign: "center" }}>
          Top Three
        </Text>
        <NetGrossTabs isNet={isNet} setIsNet={setIsNet} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={280}
          decelerationRate="fast"
          snapToAlignment="center"
          px="$3"
        >
          <XStack gap="$3">
            {sortedPlayers?.map((player, index) => (
              <PlayerCard
                key={player.player_id}
                playerData={player}
                index={index}
                isNet={isNet}
              />
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    </YStack>
  );
}
