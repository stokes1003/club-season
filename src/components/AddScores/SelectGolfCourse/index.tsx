import { useState, useEffect } from "react";
import { Alert, Pressable, View } from "react-native";
import { Button, Input, ScrollView, Text, YStack } from "tamagui";
import { searchCourses } from "../../../api/getGolfCourses";
import { GolfCourse } from "../../../types/golfCourse";
import { getLeagueCourses } from "../../../api/getLeagueCourses";
import { CourseSelection, LeagueCourse } from "src/types/courseSelection";
import { SelectDate } from "./SelectDate";
import { MajorTournamentSelector } from "./MajorTournamentSelector";

export function SelectGolfCourse({
  setCurrentStep,
  setSelectedCourse,
  selectedCourse,
  isMajor,
  setIsMajor,
  majorName,
  setMajorName,
  leagueId,
  date,
  setDate,
}: {
  setCurrentStep: (step: string) => void;
  setSelectedCourse: (course: CourseSelection) => void;
  selectedCourse: CourseSelection | null;
  isMajor: string;
  setIsMajor: (isMajor: string) => void;
  majorName: string;
  setMajorName: (majorName: string) => void;
  leagueId: string;
  date: Date;
  setDate: (date: Date) => void;
}) {
  const [leagueCourses, setLeagueCourses] = useState<LeagueCourse[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [courses, setCourses] = useState<GolfCourse[]>([]);

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
            placeholder="Type to search courses....."
            value={search}
            onChangeText={setSearch}
            fontSize="$5"
            onFocus={() => setIsFocused(true)}
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
                  <Pressable
                    key={course.id}
                    onPress={() => {
                      setSearch(course.course_name);
                      setSelectedCourse(course);
                      setIsFocused(false);
                    }}
                    style={{ opacity: 0.7 }}
                  >
                    <YStack gap="$1">
                      <Text fontSize="$5">
                        {course.club_name === course.course_name
                          ? course.course_name
                          : `${course.club_name} - ${course.course_name}`}
                      </Text>
                      <Text fontSize="$3" color="$black11">
                        {course.location.city}, {course.location.state}
                      </Text>
                    </YStack>
                  </Pressable>
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
                      <Pressable
                        key={course.id}
                        onPress={() => {
                          const displayName =
                            course.club_name === course.course_name
                              ? course.course_name
                              : `${course.club_name} - ${course.course_name}`;
                          setSearch(displayName);
                          setSelectedCourse(course);
                          setIsFocused(false);
                        }}
                        style={{ opacity: 0.7 }}
                      >
                        <YStack gap="$1">
                          <Text fontSize="$5">
                            {course.club_name === course.course_name
                              ? course.course_name
                              : `${course.club_name} - ${course.course_name}`}
                          </Text>
                          <Text fontSize="$3" color="$black11">
                            {course.location.city}, {course.location.state}
                          </Text>
                        </YStack>
                      </Pressable>
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
        <MajorTournamentSelector
          isMajor={isMajor}
          setIsMajor={setIsMajor}
          majorName={majorName}
          setMajorName={setMajorName}
        />
        <SelectDate date={date} setDate={setDate} />
      </YStack>

      <Button
        bg={isMajor === "yes" ? "$green10" : "$blue10"}
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$20"
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
