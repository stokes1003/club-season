import { ScrollView, Text, XStack, YStack } from "tamagui";
import { PlayerCard } from "../PlayerCard";
import { getPlayersByLeague } from "../../../api/getPlayersByLeague";
import { useEffect, useState } from "react";
import { useUser } from "app/hooks/useUser";

type Player = {
  avatar_url: string;
  avg_gross_score: number;
  avg_net_score: number;
  best_gross_score: number;
  best_net_score: number;
  gross_points: number;
  name: string;
  net_points: number;
  player_id: string;
};

export function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);

  const user = useUser();

  const leagueId = user?.leagues?.[0]?.id;

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayersByLeague(leagueId ?? "");
      setPlayers(data || []);
    };
    fetchPlayers();
  }, [leagueId]);

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
        <XStack gap="$5">
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
