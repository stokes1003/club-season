import { YStack, Text, XStack, Image, Separator, Button } from "tamagui";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";

export function CourseProfile({
  selectedCourse,
  setSelectedCourse,
}: {
  selectedCourse: any;
  setSelectedCourse: (course: any) => void;
}) {
  console.log(selectedCourse);
  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <XStack style={{ alignItems: "flex-start", width: "100%" }}>
        <Pressable onPress={() => setSelectedCourse(null)}>
          <ArrowLeft />
        </Pressable>
      </XStack>
      <YStack gap="$6">
        <YStack gap="$6" style={{ alignItems: "center" }}>
          <Image
            source={{ uri: selectedCourse.photo_url }}
            width="100%"
            height="$18"
            borderRadius="$2"
          />
          <Text fontSize="$6" fontWeight="bold">
            {selectedCourse.course_name}
          </Text>
        </YStack>
        <YStack gap="$4">
          <YStack gap="$1">
            <Text fontSize="$5" fontWeight="500">
              Location
            </Text>
            <Text fontSize="$4" fontWeight="400">
              {selectedCourse.location.city}, {selectedCourse.location.state}
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
