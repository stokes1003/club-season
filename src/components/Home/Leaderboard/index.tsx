import { ScrollView, Text, XStack, YStack } from "tamagui";
import { PlayerCard } from "../PlayerCard";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { useLeaderboard } from "../../../context/LeaderboardContext";
import { League } from "../../../context/SelectedLeagueContext";

export function Leaderboard({ league }: { league: League }) {
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

  const sortedPlayers = netSortedPlayers();

  return (
    <YStack gap="$6" width="100%">
      <Text fontWeight="bold" fontSize="$8" style={{ textAlign: "center" }}>
        Leaderboard
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={280}
        decelerationRate="fast"
        snapToAlignment="center"
        py="$5"
        px="$4"
      >
        <XStack gap="$3">
          {sortedPlayers?.map((player, index) => (
            <PlayerCard
              key={player.player_id}
              playerData={player}
              index={index}
            />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
