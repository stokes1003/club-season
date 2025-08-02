import { YStack, Separator, Text } from "tamagui";
import { UserStatsCard } from "../Home/PlayerHome/PlayerCard/UserStatsCard";
import { useUser } from "src/context/UserContext";
import { useGetUserStats } from "src/hooks/useGetUserStats";
import { UserStats } from "./UserStats";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";

export function Stats() {
  const { user } = useUser();
  const { userStats } = useGetUserStats(user);
  const { selectedLeague } = useSelectedLeague();

  const coursePlayerStats = [
    {
      title: "Best Round",
      course: userStats?.best_gross_score,
      showDate: true,
    },
    {
      title: "Worst Round",
      course: userStats?.worst_gross_score,
      showDate: true,
    },
    {
      title: "Best Course",
      course: userStats?.best_course,
      showDate: false,
    },
    {
      title: "Worst Course",
      course: userStats?.worst_course,
      showDate: false,
    },
    {
      title: "Most Played Course",
      course: userStats?.most_played_course,
      showDate: false,
    },
  ];

  return (
    <YStack gap="$4" pb="$5">
      {!selectedLeague && (
        <>
          <UserStatsCard />
          <YStack gap="$6" width="100%">
            {coursePlayerStats.map((stat, index) => (
              <YStack key={stat.title} gap="$4">
                <UserStats
                  title={stat.title}
                  course={stat.course}
                  showDate={stat.showDate}
                />
                {index < coursePlayerStats.length - 1 && (
                  <Separator width="100%" borderColor="$black10" />
                )}
              </YStack>
            ))}
          </YStack>
        </>
      )}
      {selectedLeague && (
        <YStack gap="$6" width="100%">
          <Text>League Stats</Text>
        </YStack>
      )}
    </YStack>
  );
}
