import { YStack, Text, Separator, View } from "tamagui";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";
import { LeagueCourseStats } from "./LeagueCourseStats";
import { LeagueBasicStats } from "./LeagueBasicStats/index";
import { useGetLeagueStats } from "src/hooks/useGetLeagueStats";
import { LeagueSummaryStats } from "./LeagueSummaryStats";
import { NetGrossTabs } from "src/components/NetGrossTabs";
import { useState } from "react";

export function LeagueStats() {
  const { selectedLeague } = useSelectedLeague();
  const leagueStats = useGetLeagueStats(selectedLeague?.id || "");
  const [isNet, setIsNet] = useState(true);

  console.log("leagueStats:", leagueStats);

  const courseLeagueStats = [
    {
      title: "Best Round",
      score: isNet ? leagueStats?.best_net_score : leagueStats?.best_score,
    },
    {
      title: "Worst Round",
      score: isNet ? leagueStats?.worst_net_score : leagueStats?.worst_score,
    },
  ];

  const leagueBasicStats = [
    {
      title: "Most Wins",
      score: {
        player: isNet
          ? leagueStats?.most_net_wins?.player
          : leagueStats?.most_wins?.player,
        score: isNet
          ? leagueStats?.most_net_wins?.wins
          : leagueStats?.most_wins?.wins,
      },
    },
    {
      title: "Most Major Wins",
      score: {
        player: isNet
          ? leagueStats?.most_net_major_wins?.player
          : leagueStats?.most_major_wins?.player,
        score: isNet
          ? leagueStats?.most_net_major_wins?.wins
          : leagueStats?.most_major_wins?.wins,
      },
    },
    {
      title: "Best Average",
      score: {
        player: isNet
          ? leagueStats?.best_net_average?.player
          : leagueStats?.best_average?.player,
        score: isNet
          ? leagueStats?.best_net_average?.score
          : leagueStats?.best_average?.score,
      },
    },
  ];

  console.log("leagueBasicStats:", leagueBasicStats);

  if (!leagueStats || !leagueStats.best_score) {
    return (
      <YStack gap="$8">
        <Text>Loading league stats...</Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$4">
      <YStack gap="$4">
        <LeagueSummaryStats />
        <View style={{ alignItems: "center" }}>
          <NetGrossTabs isNet={isNet} setIsNet={setIsNet} />
        </View>
      </YStack>
      <YStack>
        {leagueBasicStats.map((stat) => (
          <YStack key={stat.title} gap="$4">
            <LeagueBasicStats key={stat.title} stat={stat} />
            <Separator width="100%" borderColor="$black10" />
          </YStack>
        ))}

        {courseLeagueStats.map((stat, index) => (
          <YStack key={stat.title} gap="$4">
            <LeagueCourseStats key={stat.title} stat={stat} />

            {index < courseLeagueStats.length - 1 && (
              <Separator width="100%" borderColor="$black10" />
            )}
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
}
