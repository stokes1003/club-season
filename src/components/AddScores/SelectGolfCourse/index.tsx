import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Button, Input, ScrollView, Text, YStack, Tabs, View } from "tamagui";
import { searchCourses } from "../../../api/getGolfCourses";
import { GolfCourse } from "../../../types/golfCourse";
import { getLeagueCourses } from "../../../api/getLeagueCourses";
import { useNearbyCourses, NearbyCourse } from "src/hooks/useNearbyCourses";
import { useLocation } from "src/hooks/useLocation";
import { CourseSelection, LeagueCourse } from "src/types/courseSelection";

export function SelectGolfCourse({
  setCurrentStep,
  setSelectedCourse,
  selectedCourse,
  isMajor,
  setIsMajor,
  majorName,
  setMajorName,
  leagueId,
}: {
  setCurrentStep: (step: string) => void;
  setSelectedCourse: (course: CourseSelection) => void;
  selectedCourse: CourseSelection | null;
  isMajor: string;
  setIsMajor: (isMajor: string) => void;
  majorName: string;
  setMajorName: (majorName: string) => void;
  leagueId: string;
}) {
  const [leagueCourses, setLeagueCourses] = useState<LeagueCourse[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [courses, setCourses] = useState<GolfCourse[]>([]);
  const {
    courses: nearbyCourses,
    loading: nearbyCoursesLoading,
    fetchNearbyCourses,
  } = useNearbyCourses();
  const { location, requestLocationPermission, getCurrentLocation } =
    useLocation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location && leagueCourses.length === 0) {
      fetchNearbyCourses(location);
    }
  }, [location, leagueCourses.length]);

  useEffect(() => {
    if (leagueId) {
      getLeagueCourses(leagueId).then((courses) => {
        setLeagueCourses(courses);
      });
    }
  }, [leagueId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        handleSearch(search);
      } else {
        setCourses([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  async function handleSearch(query: string) {
    if (query.length === 0 && location) {
      fetchNearbyCourses(location);
      return;
    }
    if (query.length < 2) {
      setCourses([]);
      return;
    }

    try {
      setIsSearching(true);
      const data = await searchCourses(query);
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Search failed:", err);
      setCourses([]);
    } finally {
      setIsSearching(false);
    }
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.course_name.toLowerCase().includes(search.toLowerCase()) ||
      course.club_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack style={{ alignItems: "center" }}>
        <Text fontWeight="bold" fontSize="$8">
          Select Golf Course
        </Text>
      </YStack>
      <YStack gap="$6" style={{ alignItems: "center" }}>
        <YStack gap="$3">
          <Input
            width="$20"
            borderWidth={2}
            placeholder="Type to search courses..."
            value={search}
            onChangeText={setSearch}
            fontSize="$5"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {search.length < 2 && isFocused && leagueCourses.length > 0 && (
            <ScrollView width="$20">
              <YStack
                gap="$4"
                borderWidth={1}
                borderColor="$black11"
                p="$3"
                style={{ borderRadius: 8 }}
              >
                {leagueCourses.map((course) => (
                  <Text
                    key={course.id}
                    fontSize="$5"
                    onPress={() => {
                      setSearch(course.course_name);
                      setSelectedCourse(course);
                      setIsFocused(false);
                    }}
                  >
                    {course.club_name === course.course_name
                      ? course.course_name
                      : `${course.club_name} - ${course.course_name}`}
                  </Text>
                ))}
              </YStack>
            </ScrollView>
          )}
          {search.length < 2 && isFocused && leagueCourses.length === 0 && (
            <ScrollView width="$20">
              <YStack
                gap="$4"
                borderWidth={1}
                borderColor="$black11"
                p="$3"
                style={{ borderRadius: 8 }}
              >
                {nearbyCourses.map((course) => (
                  <Text
                    key={course.id}
                    fontSize="$5"
                    onPress={() => {
                      setSearch(course.course_name);
                      setSelectedCourse(course);
                      setIsFocused(false);
                    }}
                  >
                    {course.club_name === course.course_name
                      ? course.course_name
                      : `${course.club_name} - ${course.course_name}`}
                  </Text>
                ))}
              </YStack>
            </ScrollView>
          )}
          {search.length > 0 && isFocused && (
            <ScrollView width="$20">
              <YStack
                gap="$4"
                borderWidth={1}
                borderColor="$black11"
                p="$3"
                style={{ borderRadius: 8 }}
              >
                {isSearching ? (
                  <Text fontSize="$5" style={{ textAlign: "center" }}>
                    Searching...
                  </Text>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses
                    .map((course) => (
                      <Text
                        key={course.id}
                        fontSize="$5"
                        onPress={() => {
                          const displayName =
                            course.club_name === course.course_name
                              ? course.course_name
                              : `${course.club_name} - ${course.course_name}`;
                          setSearch(displayName);
                          setSelectedCourse(course);
                          setIsFocused(false);
                        }}
                        pressStyle={{ opacity: 0.7 }}
                      >
                        {course.club_name === course.course_name
                          ? course.course_name
                          : `${course.club_name} - ${course.course_name}`}
                      </Text>
                    ))
                    .slice(0, 6)
                ) : (
                  <Text
                    fontSize="$5"
                    style={{ textAlign: "center", color: "#666" }}
                  >
                    No courses found
                  </Text>
                )}
              </YStack>
            </ScrollView>
          )}
        </YStack>

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
