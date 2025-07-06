import { useState } from "react";
import { Alert } from "react-native";
import { Button, Input, ScrollView, Text, YStack, Tabs, View } from "tamagui";

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
  isMajor,
  setIsMajor,
  majorName,
  setMajorName,
}: {
  setCurrentStep: (step: string) => void;
  addScoresData: AddScoresData;
  setSelectedCourse: (course: { id: string; course_name: string }) => void;
  selectedCourse: { id: string; course_name: string } | null;
  isMajor: string;
  setIsMajor: (isMajor: string) => void;
  majorName: string;
  setMajorName: (majorName: string) => void;
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
      <YStack gap="$6" style={{ alignItems: "center" }}>
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
                    setSelectedCourse(course);
                  }}
                >
                  {course.course_name}
                </Text>
              ))}
            </YStack>
          </ScrollView>
        )}
        <YStack gap="$4" style={{ alignItems: "center" }}>
          <Text fontSize="$7" fontWeight="bold">
            Is this round a Major?
          </Text>
          <YStack>
            <Tabs value={isMajor} onValueChange={setIsMajor}>
              <Tabs.List>
                <Tabs.Tab value="yes">
                  <View
                    width="$4"
                    borderBottomWidth={4}
                    borderColor={
                      isMajor === "yes" ? "$green10" : "$borderColor"
                    }
                    style={{ alignItems: "center" }}
                  >
                    <Text fontSize="$7">Yes</Text>
                  </View>
                </Tabs.Tab>
                <Tabs.Tab value="no">
                  <View
                    width="$4"
                    borderBottomWidth={4}
                    borderColor={isMajor === "no" ? "$blue10" : "$borderColor"}
                    style={{ alignItems: "center" }}
                  >
                    <Text fontSize="$7">No</Text>
                  </View>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </YStack>
        </YStack>
        {isMajor === "yes" && (
          <YStack>
            <Input
              width="$18"
              borderWidth={2}
              placeholder="Enter Major Name"
              value={majorName}
              onChangeText={setMajorName}
              fontSize="$5"
            />
          </YStack>
        )}
      </YStack>

      <Button
        bg={isMajor === "yes" ? "$green10" : "$blue10"}
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$18"
        onPress={() => {
          if (isMajor === "yes" && majorName === "") {
            Alert.alert("Please enter a major name");
            return;
          }
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
