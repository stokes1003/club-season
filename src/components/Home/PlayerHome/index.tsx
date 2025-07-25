import { YStack, ScrollView, Text, XStack } from "tamagui";
import { RoundCard } from "../RoundCard";
import { UserStatsCard } from "./UserStatsCard";
import { useUser } from "src/context/UserContext";
import { useGetUserStats } from "src/hooks/useGetUserStats";
import { useUserRecentRounds } from "src/hooks/useUserRecentRounds";

export function PlayerHome() {
  const { user } = useUser();
  const { userStats } = useGetUserStats(user);
  const userRoundsData = useUserRecentRounds(user?.id || "", 10);

  if (!user) {
    return null;
  }

  return (
    <YStack gap="$6" style={{ alignItems: "center", justifyContent: "center" }}>
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
  );
}
