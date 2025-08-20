import { YStack, Text, Separator, XStack } from "tamagui";
import { League } from "../..";
import { Pressable, View } from "react-native";
import { ChevronDown, ChevronRight } from "@tamagui/lucide-icons";
import { useGetLeagueCourses } from "src/hooks/useGetLeagueCourses";
import { useState } from "react";

export function LeagueCourseDetails({
  selectedLeague,
  setSelectedCourse,
}: {
  selectedLeague: League;
  setSelectedCourse: (course: any) => void;
}) {
  const courses = useGetLeagueCourses(selectedLeague.id);
  const [showCourses, setShowCourses] = useState(true);

  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <YStack gap="$6">
        <YStack gap="$6">
          <XStack style={{ justifyContent: "space-between" }} width={320}>
            <Text fontSize="$8" fontWeight="bold">
              Courses
            </Text>
            <Pressable onPress={() => setShowCourses(!showCourses)}>
              {showCourses ? <ChevronDown /> : <ChevronRight />}
            </Pressable>
          </XStack>

          {showCourses && (
            <>
              {courses.length === 0 && (
                <Text fontSize="$4" fontWeight="400">
                  No courses added yet
                </Text>
              )}

              {courses.length > 0 && (
                <YStack gap="$4" width="100%">
                  <Separator width={320} borderColor="$black11" />

                  {courses?.map((course) => (
                    <YStack key={course.id} gap="$4">
                      <Pressable
                        onPress={() => {
                          setSelectedCourse(course);
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
                              {course.club_name === course.course_name ? (
                                <Text fontSize="$5" fontWeight="400">
                                  {course.course_name}
                                </Text>
                              ) : (
                                <Text fontSize="$5" fontWeight="400">
                                  {course.course_name} at {course.club_name}
                                </Text>
                              )}
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

                      <Separator width={320} borderColor="$black11" />
                    </YStack>
                  ))}
                </YStack>
              )}
            </>
          )}
        </YStack>
      </YStack>
    </YStack>
  );
}
