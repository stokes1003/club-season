import { YStack, ScrollView, Text, XStack, View } from "tamagui";
import { useUser } from "src/context/UserContext";
import { useUserRecentRounds } from "src/hooks/useUserRecentRounds";
import { RecentRoundCard } from "./RecentRoundCard";

export function RecentRounds({}: {}) {
  const { user } = useUser();
  const userRoundsData = useUserRecentRounds(user?.id || "", 10);
  const leagues = user?.leagues;
  return (
    <YStack gap="$2" width="100%">
      <View width="100%" px="$4">
        <Text fontSize="$8" fontWeight="bold">
          Recent Rounds
        </Text>
      </View>

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
              <RecentRoundCard
                roundData={{
                  _id: round.id,
                  course: round.course_name,
                  course_img: round.course_img,
                  date: round.date,
                  league_id: round.league_id,
                  league_img:
                    leagues?.find((league) => league.id === round.league_id)
                      ?.image_url || "",
                  scores: [
                    {
                      player: user?.name || "You",
                      player_img:
                        leagues?.find((league) => league.id === round.league_id)
                          ?.image_url || "",
                      gross: round.gross_score,
                      hcp: round.handicap,
                      net: round.net_score,
                      player_color: "#000000",
                      league_color: round.league_color,
                      league_name: round.league_name,
                    },
                  ],
                }}
              />
            </XStack>
          ))}
      </ScrollView>
    </YStack>
  );
}
