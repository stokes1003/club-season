import { useState } from "react";
import { Alert, Pressable } from "react-native";
import { YStack, Text, XStack, Image, Separator } from "tamagui";
import { supabase } from "src/lib/supabase";
import { useUploadImage } from "src/hooks/useUploadImage";

export function CourseProfile({
  selectedCourse,
  setSelectedCourse,
}: {
  selectedCourse: any;
  setSelectedCourse: (course: any) => void;
}) {
  const [courseImage, setCourseImage] = useState(selectedCourse.photo_url);
  console.log(selectedCourse.id);
  const { pickImage } = useUploadImage();

  const handleImageUpload = async () => {
    const uploadedUrl = await pickImage("league_courses", selectedCourse.id);

    if (uploadedUrl) {
      const { error } = await supabase
        .from("league_courses")
        .update({ photo_url: uploadedUrl })
        .eq("id", selectedCourse.id);

      if (error) {
        console.error("Database update error:", error);
        Alert.alert("Error", "Failed to save to database");
      } else {
        console.log("Database updated successfully");
        setCourseImage(uploadedUrl);
        setSelectedCourse({
          ...selectedCourse,
          photo_url: uploadedUrl,
        });
      }
    }
  };

  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <YStack gap="$6">
        <YStack gap="$6">
          <Pressable onPress={handleImageUpload}>
            <Image source={{ uri: courseImage }} width="100%" height="$18" />
          </Pressable>

          <YStack gap="$2">
            {selectedCourse.club_name === selectedCourse.course_name ? (
              <YStack gap="$1">
                <Text fontSize="$6" fontWeight="bold">
                  {selectedCourse.course_name}
                </Text>
              </YStack>
            ) : (
              <YStack gap="$1">
                <Text fontSize="$6" fontWeight="bold">
                  {selectedCourse.course_name} at {selectedCourse.club_name}
                </Text>
              </YStack>
            )}

            <Text fontSize="$4" fontWeight="400">
              {selectedCourse.location.address}
            </Text>
          </YStack>
        </YStack>

        <YStack gap="$6">
          <YStack style={{ alignItems: "center" }} gap="$2">
            <Separator width={320} borderColor="$black11" />
            <XStack
              style={{
                justifyContent: "space-evenly",
              }}
              gap="$4"
            >
              <YStack gap="$2" style={{ alignItems: "center" }} width="$5">
                <Text fontSize="$5" fontWeight="500">
                  {selectedCourse.tees.male[0].number_of_holes}
                </Text>
                <Text fontSize="$4">Holes</Text>
              </YStack>
              <YStack gap="$2" style={{ alignItems: "center" }} width="$5">
                <Text fontSize="$5" fontWeight="500">
                  {selectedCourse.tees.male[0].par_total}
                </Text>
                <Text fontSize="$4">Par</Text>
              </YStack>
              <YStack gap="$2" style={{ alignItems: "center" }} width="$5">
                <Text fontSize="$5" fontWeight="500">
                  {selectedCourse.tees.male[0].total_yards}
                </Text>
                <Text fontSize="$4">Length</Text>
              </YStack>
              <YStack gap="$2" style={{ alignItems: "center" }} width="$5">
                <Text fontSize="$5" fontWeight="500">
                  {selectedCourse.tees.male[0].slope_rating}
                </Text>
                <Text fontSize="$4">Slope</Text>
              </YStack>
              <YStack gap="$2" style={{ alignItems: "center" }} width="$5">
                <Text fontSize="$5" fontWeight="500">
                  {selectedCourse.tees.male[0].course_rating}
                </Text>
                <Text fontSize="$4">Index</Text>
              </YStack>
            </XStack>
            <Separator width={320} borderColor="$black11" />
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$6" fontWeight="600">
              Tees
            </Text>

            {selectedCourse.tees.male.map((tee: any, index: number) => (
              <YStack key={tee.total_yards} gap="$4">
                <YStack
                  key={tee.total_yards}
                  style={{ justifyContent: "space-between" }}
                  gap="$2"
                >
                  <Text fontSize="$5" fontWeight="500">
                    {tee.tee_name} - {tee.total_yards} yds
                  </Text>
                  <Text fontSize="$4">
                    Rating {tee.course_rating} / Slope {tee.slope_rating}
                  </Text>
                </YStack>
                {index !== selectedCourse.tees.male.length - 1 && (
                  <Separator width={320} borderColor="$black11" />
                )}
              </YStack>
            ))}
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
