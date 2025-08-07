import { YStack, Text, Separator, XStack, Button } from "tamagui";
import { League } from "../..";
import { Alert, Pressable, View } from "react-native";
import { getLeagueCourses } from "src/api/getLeagueCourses";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { Location } from "src/types/golfCourse";

type LeagueCourse = {
  id: string;
  club_name: string;
  course_name: string;
  external_course_id: number;
  location: Location;
  tees: any | null;
  times_played: number;
  photo_url: string;
};

export function LeagueCourseDetails({
  selectedLeague,
  isCommissioner,
}: {
  selectedLeague: League;
  isCommissioner: boolean;
}) {
  const [courses, setCourses] = useState<LeagueCourse[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getLeagueCourses(selectedLeague.id);
      setCourses(courses);
    };
    fetchCourses();
  }, [selectedLeague.id]);

  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <YStack gap="$6">
        <YStack gap="$6">
          <Text fontSize="$8" fontWeight="bold">
            Courses
          </Text>
          {courses.length === 0 && (
            <Text fontSize="$4" fontWeight="400">
              No courses added yet
            </Text>
          )}
          <YStack gap="$4" width="100%">
            {courses.length > 0 && (
              <Separator width={320} borderColor="$black10" />
            )}

            {courses?.map((course) => (
              <YStack key={course.id} gap="$4">
                <Pressable
                  onPress={() => {
                    if (!isCommissioner) {
                      Alert.alert("Only commissioner can edit course details");
                      return;
                    }
                  }}
                >
                  <XStack
                    gap="$4"
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <XStack gap="$4">
                      <YStack gap="$2">
                        <Text fontSize="$6" fontWeight="400">
                          {course.course_name}
                        </Text>
                        <Text fontSize="$4" fontWeight="400">
                          {course.location.city}, {course.location.state}
                        </Text>
                      </YStack>
                    </XStack>

                    <View>
                      <ChevronRight />
                    </View>
                  </XStack>
                </Pressable>

                <Separator width={320} borderColor="$black10" />
              </YStack>
            ))}
          </YStack>
        </YStack>
      </YStack>

      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width={320}
        onPress={() => {
          if (!isCommissioner) {
            Alert.alert("Only commissioner can add courses");
            return;
          }
        }}
      >
        Add Course
      </Button>
    </YStack>
  );
}
