import { Text, YStack } from "tamagui";
import { TopThree } from "./TopThree";
import { OfficialRounds } from "./OfficialRounds";
import { useSelectedLeague } from "../../context/SelectedLeagueContext";
import { useUser } from "src/context/UserContext";
import { getUserStats } from "src/api/getUserStats";
import { useEffect, useState } from "react";
import { UserStatsCard } from "./UserStatsCard";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { useLeaderboard } from "../../context/LeaderboardContext";
import { LeagueTable } from "./LeagueTable";

export function Home() {
  const { selectedLeague } = useSelectedLeague();
  const { user } = useUser();

  const [userStats, setUserStats] = useState<{
    rounds_played: number;
    avg_net_score: number;
    best_net_score: number;
    avg_gross_score: number;
    best_gross_score: number;
    net_wins: number;
    gross_wins: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNet, setIsNet] = useState(true);
  const { refreshTrigger } = useLeaderboard();
  const players = useGetPlayers(selectedLeague?.id || "", refreshTrigger);

  useEffect(() => {
    async function fetchUserStats() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const stats = await getUserStats(user.id);
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserStats();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <YStack style={{ alignItems: "center", justifyContent: "center" }} gap="$6">
      {!selectedLeague && (
        <YStack
          gap="$6"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <YStack gap="$2" style={{ alignItems: "center" }}>
            <UserStatsCard userStats={userStats} />
          </YStack>
          <YStack gap="$2" style={{ alignItems: "center" }}>
            <Text fontSize="$6" fontWeight="bold">
              Recent Rounds
            </Text>
          </YStack>
        </YStack>
      )}
      {selectedLeague && (
        <>
          <TopThree league={selectedLeague} isNet={isNet} setIsNet={setIsNet} />
          <LeagueTable isNet={isNet} players={players} />
          <OfficialRounds league={selectedLeague} />
        </>
      )}
    </YStack>
  );
}
