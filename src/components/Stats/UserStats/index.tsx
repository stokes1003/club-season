import { YStack, Separator } from "tamagui";
import { useGetUserStats } from "src/hooks/useGetUserStats";
import { useUser } from "src/context/UserContext";
import { UserCourseStats } from "./UserCourseStats";
import { UserBasicStats } from "./UserBasicStats";

export function UserStats() {
  const { user } = useUser();
  const { userStats } = useGetUserStats(user);

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
    <>
      <YStack gap="$6" width="100%">
        <UserBasicStats user={user} />

        {coursePlayerStats.map((stat, index) => (
          <YStack key={stat.title} gap="$6">
            <UserCourseStats
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
  );
}
