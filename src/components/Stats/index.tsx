import { Label, Text, YStack } from "tamagui";

export function Stats() {
  return (
    <YStack gap="$4">
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Best Round
        </Label>
        <Text>Score</Text>
        <Text>Golf Course</Text>
        <Text>Date</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Worst Round
        </Label>
        <Text>Score</Text>
        <Text>Golf Course</Text>
        <Text>Date</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Average
        </Label>
        <Text>Score</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Best Course
        </Label>
        <Text>Avg</Text>
        <Text>Golf Course</Text>
        <Text>Times Played</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Worst Course
        </Label>
        <Text>Avg</Text>
        <Text>Golf Course</Text>
        <Text>Times Played</Text>
      </YStack>
      <YStack>
        <Label fontSize="$8" fontWeight="bold">
          Most Played Course
        </Label>
        <Text>Golf Course</Text>
        <Text>Times Played</Text>
      </YStack>
    </YStack>
  );
}
