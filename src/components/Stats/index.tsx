import { Label, Text, YStack } from "tamagui";
import { UserStatsCard } from "../Home/PlayerHome/PlayerCard/UserStatsCard";
import { useUser } from "src/context/UserContext";
import { useGetUserStats } from "src/hooks/useGetUserStats";

export function Stats() {
  const { user } = useUser();
  const { userStats } = useGetUserStats(user);

  return (
    <YStack gap="$4">
      <UserStatsCard />
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Best Round
        </Label>
        <Text>{userStats?.best_gross_score.score}</Text>
        <Text>{userStats?.best_gross_score.course_name}</Text>
        <Text>{userStats?.best_gross_score.date.toLocaleDateString()}</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Worst Round
        </Label>
        <Text>{userStats?.worst_gross_score.score}</Text>
        <Text>{userStats?.worst_gross_score.course_name}</Text>
        <Text>{userStats?.worst_gross_score.date.toLocaleDateString()}</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Best Course
        </Label>
        <Text>{userStats?.best_course?.avg_score}</Text>
        <Text>{userStats?.best_course?.course_name}</Text>
        <Text>{userStats?.best_course?.times_played}</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Worst Course
        </Label>
        <Text>{userStats?.worst_course?.avg_score}</Text>
        <Text>{userStats?.worst_course?.course_name}</Text>
        <Text>{userStats?.worst_course?.times_played}</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Most Played Course
        </Label>
        <Text>{userStats?.most_played_course?.course_name}</Text>
        <Text>{userStats?.most_played_course?.times_played}</Text>
      </YStack>
    </YStack>
  );
}
