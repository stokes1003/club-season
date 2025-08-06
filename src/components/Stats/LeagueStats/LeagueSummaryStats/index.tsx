import { YStack, XStack, View, Text } from "tamagui";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";
import { useUser } from "src/hooks/useUser";
import { useGetOfficalRounds } from "src/hooks/useGetOfficalRounds";

export function LeagueSummaryStats() {
  const { selectedLeague } = useSelectedLeague();
  const user = useUser();
  const leagues = user?.leagues;
  const rounds = useGetOfficalRounds(selectedLeague?.id || "");
  const majorRounds = rounds?.filter((round) => round.isMajor);

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
              {rounds?.length}
            </Text>
          </View>
          <Text fontSize="$6" fontWeight="bold" style={{ textAlign: "center" }}>
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
              {majorRounds?.length}
            </Text>
          </View>
          <Text fontSize="$6" fontWeight="bold" style={{ textAlign: "center" }}>
            Majors Played
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
