import { Label, Spinner, Text, View, XStack, YStack } from "tamagui";

export function UserCourseStats({
  title,
  course,
  showDate = false,
  loading = false,
}: {
  title: string;
  course: any;
  showDate?: boolean;
  loading?: boolean;
}) {
  const formatScore = (score: number | undefined) => {
    if (score === undefined || score === null) return "-";
    return Number.isInteger(score) ? score : score.toFixed(1);
  };

  return (
    <YStack gap="$1">
      <Label fontSize="$6" fontWeight="bold">
        {title}
      </Label>
      <XStack style={{ justifyContent: "space-between", alignItems: "center" }}>
        <YStack gap="$1" width="$20">
          <Text fontSize="$5" fontWeight="500">
            {course?.course_name}
          </Text>
          {showDate ? (
            <Text fontSize="$4" fontWeight="400">
              {course?.date?.toLocaleDateString()}
            </Text>
          ) : (
            <XStack gap="$2">
              <Text fontSize="$4" fontWeight="400">
                Rounds:
              </Text>
              <Text fontSize="$4" fontWeight="400">
                {course?.times_played}
              </Text>
            </XStack>
          )}
        </YStack>
        <View
          width="$4"
          height="$4"
          borderColor="$black11"
          borderWidth="$0.25"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text fontSize="$4" fontWeight="bold" style={{ textAlign: "center" }}>
            {loading ? (
              <Spinner />
            ) : (
              formatScore(course?.score || course?.avg_score)
            )}
          </Text>
        </View>
      </XStack>
    </YStack>
  );
}
