import { ScrollView, Text, XStack, YStack } from "tamagui";
import { TopThree } from "./TopThree";
import { OfficialRounds } from "./OfficialRounds";
import { useSelectedLeague } from "../../context/SelectedLeagueContext";
import { useUser } from "src/context/UserContext";
import { getUserStats } from "src/api/getUserStats";
import { useEffect, useState } from "react";
import { UserStatsCard } from "./UserStatsCard";
import { Player } from "src/types/player";
import { getPlayersByLeague } from "src/api/getPlayersByLeague";
import { LeagueTable } from "./LeagueTable";
import { RoundCard } from "./RoundCard";
import { useUserRecentRounds } from "src/hooks/useUserRecentRounds";

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

  const userRoundsData = useUserRecentRounds(user?.id || "", 10);
  console.log(userRoundsData);

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
          <YStack gap="$2" style={{ alignItems: "center" }} width="100%">
            <Text fontSize="$6" fontWeight="bold">
              Recent Rounds
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={344}
              decelerationRate="fast"
              snapToAlignment="center"
            >
              {!userRoundsData.loading &&
                userRoundsData.rounds.length > 0 &&
                userRoundsData.rounds.map((round) => (
                  <XStack key={round.id}>
                    <RoundCard
                      roundData={{
                        _id: round.id,
                        course: round.course_name,
                        course_img: round.course_img,
                        date: round.date,
                        scores: [
                          {
                            player: user?.name || "You",
                            player_img: user?.avatar_url || "",
                            gross: round.gross_score,
                            hcp: round.handicap,
                            net: round.net_score,
                            player_color: "#000000",
                          },
                        ],
                      }}
                    />
                  </XStack>
                ))}
            </ScrollView>
          </YStack>
        </YStack>
      )}
      {selectedLeague && (
        <>
          <TopThree league={selectedLeague} isNet={isNet} setIsNet={setIsNet} />
          <LeagueTable
            league={selectedLeague}
            isNet={isNet}
            players={players}
          />
          <OfficialRounds league={selectedLeague} />
        </>
      )}
    </YStack>
  );
}
