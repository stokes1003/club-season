import { YStack, XStack, View, Text, Spinner } from "tamagui";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";
import { useUser } from "src/hooks/useUser";
import { useGetOfficalRounds } from "src/hooks/useGetOfficalRounds";
import { useGetLeagueCourses } from "src/hooks/useGetLeagueCourses";

export function LeagueSummaryStats({ loading }: { loading?: boolean }) {
  const { selectedLeague } = useSelectedLeague();
  const user = useUser();
  const leagues = user?.leagues;
  const rounds = useGetOfficalRounds(selectedLeague?.id || "");
  const majorRounds = rounds?.filter((round) => round.isMajor);
  const courses = useGetLeagueCourses(selectedLeague?.id || "");

  return (
    <YStack gap="$6" width="100%" style={{ alignItems: "center" }}>
      <PlayerAvatar
        avatarUrl={
          leagues?.find((league) => league.id === selectedLeague?.id)?.image_url
        }
        size="$10"
        color={
          leagues?.find((league) => league.id === selectedLeague?.id)
            ?.avatar_color
        }
      />
      <XStack gap="$4">
        <YStack gap="$3" style={{ alignItems: "center" }} width="$8">
          <View
            width="$4"
            height="$4"
            borderColor="$black10"
            borderWidth="$0.25"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              fontSize="$4"
              fontWeight="500"
              style={{ textAlign: "center" }}
            >
              {loading ? <Spinner /> : rounds?.length}
            </Text>
          </View>
          <Text fontSize="$5" fontWeight="500" style={{ textAlign: "center" }}>
            Rounds Played
          </Text>
        </YStack>
        <YStack gap="$3" style={{ alignItems: "center" }} width="$8">
          <View
            width="$4"
            height="$4"
            borderColor="$black10"
            borderWidth="$0.25"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              fontSize="$4"
              fontWeight="500"
              style={{ textAlign: "center" }}
            >
              {loading ? <Spinner /> : majorRounds?.length}
            </Text>
          </View>
          <Text fontSize="$5" fontWeight="500" style={{ textAlign: "center" }}>
            Majors Played
          </Text>
        </YStack>
        <YStack gap="$3" style={{ alignItems: "center" }} width="$8">
          <View
            width="$4"
            height="$4"
            borderColor="$black10"
            borderWidth="$0.25"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              fontSize="$4"
              fontWeight="500"
              style={{ textAlign: "center" }}
            >
              {loading ? <Spinner /> : courses?.length}
            </Text>
          </View>
          <Text fontSize="$5" fontWeight="500" style={{ textAlign: "center" }}>
            Courses Played
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
