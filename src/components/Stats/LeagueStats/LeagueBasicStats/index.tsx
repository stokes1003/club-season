import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { Label, Spinner, Text, View, XStack, YStack } from "tamagui";

export function LeagueBasicStats({
  stat,
  loading,
}: {
  stat: any;
  loading?: boolean;
}) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "-";
    }
  };

  const formatScore = (score: number | undefined) => {
    if (score === undefined || score === null) return "-";
    return Number.isInteger(score) ? score : score.toFixed(1);
  };

  return (
    <YStack key={stat.title} gap="$1">
      <Label fontSize="$6" fontWeight="bold">
        {stat.title}
      </Label>
      <XStack style={{ alignItems: "center" }} gap="$4">
        <PlayerAvatar
          name={stat.score?.player?.name}
          avatarUrl={stat.score?.player?.avatar_url}
          size="$5"
          color={stat.score?.player?.color}
        />
        <XStack style={{ alignItems: "center" }}>
          <YStack gap="$1" width="$16">
            <Text fontSize="$5" fontWeight="500">
              {stat.score?.player?.name}
            </Text>
          </YStack>
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
              fontWeight="bold"
              style={{ textAlign: "center" }}
            >
              {loading ? <Spinner /> : formatScore(stat.score?.score)}
            </Text>
          </View>
        </XStack>
      </XStack>
    </YStack>
  );
}
