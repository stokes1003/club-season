import { Button, Separator, Text, XStack, YStack } from "tamagui";
import { TopThree } from "./TopThree";
import { OfficialRounds } from "./OfficialRounds";
import { useSelectedLeague } from "../../context/SelectedLeagueContext";
import { useUser } from "src/context/UserContext";
import { useRouter } from "expo-router";
import { getUserStats } from "src/api/getUserStats";
import { useEffect, useState } from "react";
import { NetGrossTabs } from "./NetGrossTabs";
import { UserStatsCard } from "./UserStatsCard";
import { Player } from "src/types/player";
import { getPlayersByLeague } from "src/api/getPlayersByLeague";
import { LeagueTable } from "./LeagueTable";
import { LeaguesCard } from "../MyLeagues/LeaguesCard";

export function Home() {
  const { selectedLeague } = useSelectedLeague();
  const { user } = useUser();
  const router = useRouter();
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
  const [players, setPlayers] = useState<Player[]>([]);

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

  useEffect(() => {
    async function fetchPlayers() {
      if (!selectedLeague) return;

      try {
        const leaguePlayers = await getPlayersByLeague(selectedLeague.id);
        setPlayers(leaguePlayers);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }

    fetchPlayers();
  }, [selectedLeague]);

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
            <NetGrossTabs isNet={isNet} setIsNet={setIsNet} />
            <UserStatsCard userStats={userStats} isNet={isNet} />
          </YStack>

          <YStack gap="$2">
            <Text
              fontWeight="bold"
              fontSize="$8"
              style={{ textAlign: "center" }}
            >
              My Leagues
            </Text>
            {user.leagues && user.leagues.length > 0 ? (
              <LeaguesCard />
            ) : (
              <Text>No leagues found</Text>
            )}
          </YStack>
          <Button
            bg="$blue10"
            color="$white1"
            fontSize="$5"
            fontWeight="bold"
            width="$20"
            onPress={() => {
              router.push("/CreateLeague");
            }}
          >
            Create A League
          </Button>
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
