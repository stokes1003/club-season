import { YStack, Text, Separator, View, XStack } from "tamagui";
import { getLeagueStats } from "src/api/getLeagueStats";
import { useState, useEffect } from "react";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";
import { LeagueCourseStats } from "./LeagueCourseStats";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { useUser } from "src/hooks/useUser";

export function LeagueStats() {
  const [leagueStats, setLeagueStats] = useState<any>(null);
  const { selectedLeague } = useSelectedLeague();
  const user = useUser();
  const leagues = user?.leagues;

  useEffect(() => {
    const fetchLeagueStats = async () => {
      const leagueStats = await getLeagueStats(selectedLeague?.id || "");
      setLeagueStats(leagueStats);
    };
    fetchLeagueStats();
  }, [selectedLeague]);

  const courseLeagueStats = [
    {
      title: "Most Wins",
      score: leagueStats?.most_wins,
    },
    {
      title: "Most Major Wins",
      score: leagueStats?.most_major_wins,
    },
    {
      title: "Best Average",
      score: leagueStats?.best_average,
    },
    {
      title: "Best Round",
      score: leagueStats?.best_score,
    },
    {
      title: "Worst Round",
      score: leagueStats?.worst_score,
    },
    {
      title: "Best Net Round",
      score: leagueStats?.best_net_score,
    },
    {
      title: "Worst Net Round",
      score: leagueStats?.worst_net_score,
    },
  ];

  console.log("LeagueStats component - leagueStats:", leagueStats);

  // Don't render if data is still loading
  if (!leagueStats || !leagueStats.best_score) {
    return (
      <YStack gap="$8">
        <Text>Loading league stats...</Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$4">
      <YStack gap="$6" width="100%" style={{ alignItems: "center" }}>
        <PlayerAvatar
          avatarUrl={
            leagues?.find((league) => league.id === selectedLeague?.id)
              ?.image_url
          }
          size="$10"
          color={
            leagues?.find((league) => league.id === selectedLeague?.id)
              ?.avatar_color
          }
        />
        <XStack gap="$8">
          <YStack gap="$3" style={{ alignItems: "center" }} width="$8">
            <View
              width="$7"
              height="$7"
              borderColor="$black10"
              borderWidth="$0.25"
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "100%",
              }}
            >
              <Text
                fontSize="$8"
                fontWeight="bold"
                style={{ textAlign: "center" }}
              >
                8
              </Text>
            </View>
            <Text
              fontSize="$6"
              fontWeight="bold"
              style={{ textAlign: "center" }}
            >
              Rounds Played
            </Text>
          </YStack>
          <YStack gap="$3" style={{ alignItems: "center" }} width="$8">
            <View
              width="$7"
              height="$7"
              borderColor="$black10"
              borderWidth="$0.25"
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "100%",
              }}
            >
              <Text
                fontSize="$8"
                fontWeight="bold"
                style={{ textAlign: "center" }}
              >
                2
              </Text>
            </View>
            <Text
              fontSize="$6"
              fontWeight="bold"
              style={{ textAlign: "center" }}
            >
              Majors Played
            </Text>
          </YStack>
        </XStack>
      </YStack>

      {courseLeagueStats.map((stat, index) => (
        <YStack key={stat.title} gap="$4">
          <LeagueCourseStats key={stat.title} stat={stat} />

          {index < courseLeagueStats.length - 1 && (
            <Separator width="100%" borderColor="$black10" />
          )}
        </YStack>
      ))}
    </YStack>
  );
}
