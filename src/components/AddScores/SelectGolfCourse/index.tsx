import { useState } from "react";
import { Alert } from "react-native";
import { Button, Input, ScrollView, Text, YStack } from "tamagui";

type AddScoresData = {
  courses: {
    id: string;
    course_name: string;
  }[];
};

export function SelectGolfCourse({
  setCurrentStep,
  addScoresData,
  setSelectedCourse,
  selectedCourse,
}: {
  setCurrentStep: (step: string) => void;
  addScoresData: AddScoresData;
  setSelectedCourse: (course: string) => void;
  selectedCourse: string;
}) {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const filteredCourses = addScoresData.courses.filter((course) =>
    course.course_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack style={{ alignItems: "center" }}>
        <Text fontWeight="bold" fontSize="$8">
          Select Golf Course
        </Text>
      </YStack>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Input
          width="$18"
          borderWidth={2}
          placeholder="Type to search"
          value={search}
          onChangeText={setSearch}
          onFocus={() => setIsSearching(true)}
          onBlur={() => setIsSearching(false)}
          fontSize="$5"
        />
        {isSearching && (
          <ScrollView width="$18">
            <YStack
              gap="$4"
              borderWidth={1}
              borderColor="$black11"
              p="$3"
              style={{ borderRadius: 8 }}
            >
              {filteredCourses.map((course) => (
                <Text
                  key={course.id}
                  fontSize="$5"
                  onPress={() => {
                    setSearch(course.course_name);
                    setIsSearching(false);
                    setSelectedCourse(course.course_name);
                  }}
                >
                  {course.course_name}
                </Text>
              ))}
            </YStack>
          </ScrollView>
        )}
      </YStack>

      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$14"
        onPress={() => {
          if (selectedCourse) {
            setCurrentStep("enter-player-scores");
          } else {
            Alert.alert("Please select a course");
          }
        }}
      >
        Submit Course
      </Button>
    </YStack>
  );
}
