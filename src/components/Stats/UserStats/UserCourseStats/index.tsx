import { Label, Text, View, XStack, YStack } from "tamagui";

export function UserCourseStats({
  title,
  course,
  showDate = false,
}: {
  title: string;
  course: any;
  showDate?: boolean;
}) {
  const formatScore = (score: number | undefined) => {
    if (score === undefined || score === null) return "-";
    return Number.isInteger(score) ? score : score.toFixed(1);
  };

  return (
    <YStack>
      <Label fontSize="$8" fontWeight="bold">
        {title}
      </Label>
      <XStack style={{ justifyContent: "space-between", alignItems: "center" }}>
        <YStack gap="$2" width="$20">
          <Text fontSize="$5" fontWeight="bold">
            {course?.course_name}
          </Text>
          {showDate ? (
            <Text fontSize="$5">{course?.date?.toLocaleDateString()}</Text>
          ) : (
            <XStack gap="$2">
              <Text fontSize="$5">Rounds:</Text>
              <Text fontSize="$5">{course?.times_played}</Text>
            </XStack>
          )}
        </YStack>
        <View
          width="$6"
          height="$6"
          borderColor="$black10"
          borderWidth="$0.25"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text fontSize="$8" fontWeight="bold" style={{ textAlign: "center" }}>
            {formatScore(course?.score || course?.avg_score)}
          </Text>
        </View>
      </XStack>
    </YStack>
  );
}
