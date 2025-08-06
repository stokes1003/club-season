import { YStack, Text, Separator } from "tamagui";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";
import { LeagueCourseStats } from "./LeagueCourseStats";
import { LeagueBasicStats } from "./LeagueBasicStats/index";
import { useGetLeagueStats } from "src/hooks/useGetLeagueStats";
import { LeagueSummaryStats } from "./LeagueSummaryStats";

export function LeagueStats() {
  const { selectedLeague } = useSelectedLeague();
  const leagueStats = useGetLeagueStats(selectedLeague?.id || "");

  const courseLeagueStats = [
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

  const leagueBasicStats = [
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
  ];

  if (!leagueStats || !leagueStats.best_score) {
    return (
      <YStack gap="$8">
        <Text>Loading league stats...</Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$4">
      <LeagueSummaryStats />

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
  );
}
