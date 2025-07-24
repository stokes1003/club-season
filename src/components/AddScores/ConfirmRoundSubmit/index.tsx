import { Text, YStack, XStack, Button, View, Spinner } from "tamagui";
import { Trophy } from "@tamagui/lucide-icons";
import { PlayerAvatar } from "../../UI/PlayerAvatar";
import { GolfCourse } from "src/types/golfCourse";

type LeagueCourse = {
  id: string;
  course_name: string;
  club_name: string;
  times_played: number;
  external_course_id: number;
};

type CourseSelection = GolfCourse | LeagueCourse;

export function ConfirmRoundSubmit({
  isSubmitting,
  submitRound,
  handleHome,
  scoresByPlayer,
  selectedCourse,
  isMajor,
  majorName,
}: {
  isSubmitting: boolean;
  submitRound: () => void;

  handleHome: () => void;
  scoresByPlayer: {
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
      display_name: string;
    };
  };
  selectedCourse: CourseSelection | null;
  leagueId: string;
  isMajor: string;
  majorName: string;
}) {
  console.log("ConfirmRoundSubmit scoresByPlayer:", scoresByPlayer);
  console.log("ConfirmRoundSubmit Object.keys:", Object.keys(scoresByPlayer));

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <YStack gap="$3" style={{ alignItems: "center" }}>
          <Text fontWeight="bold" fontSize="$8">
            Confirm Round Details
          </Text>
          {isMajor === "yes" && (
            <View
              width={300}
              bg="$green10"
              height="$3"
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <XStack gap="$2">
                <Trophy size={20} color="$white1" />
                <Text
                  fontSize="$7"
                  color="$white1"
                  fontWeight="bold"
                  style={{ textAlign: "center" }}
                >
                  {majorName}
                </Text>
              </XStack>
            </View>
          )}
          <Text fontWeight="bold" fontSize="$6">
            {selectedCourse?.club_name === selectedCourse?.course_name
              ? selectedCourse?.course_name
              : `${selectedCourse?.club_name} - ${selectedCourse?.course_name}`}
          </Text>

          <Text fontSize="$5" color="$black11">
            {new Date().toLocaleDateString()}
          </Text>
        </YStack>
        <XStack gap="$4" style={{ alignItems: "center" }}>
          <Text width="$6" style={{ textAlign: "center" }} fontWeight="bold">
            Player
          </Text>
          <Text width="$6" style={{ textAlign: "center" }} fontWeight="bold">
            Gross
          </Text>
          <Text width="$6" style={{ textAlign: "center" }} fontWeight="bold">
            HCP
          </Text>
          <Text width="$6" style={{ textAlign: "center" }} fontWeight="bold">
            Net
          </Text>
        </XStack>
        <YStack gap="$4" style={{ alignItems: "center" }}>
          {Object.keys(scoresByPlayer)
            .filter((playerId) => playerId !== "undefined")
            .map((playerId) => (
              <XStack key={playerId} gap="$4" style={{ alignItems: "center" }}>
                <View width="$6" style={{ alignItems: "center" }}>
                  <PlayerAvatar
                    name={scoresByPlayer[playerId].display_name}
                    avatarUrl={scoresByPlayer[playerId].avatar_url}
                    size="$4"
                  />
                </View>
                <Text width="$6" style={{ textAlign: "center" }} fontSize="$5">
                  {scoresByPlayer[playerId].gross}
                </Text>
                <Text width="$6" style={{ textAlign: "center" }} fontSize="$5">
                  {scoresByPlayer[playerId].hcp}
                </Text>
                <Text width="$6" style={{ textAlign: "center" }} fontSize="$5">
                  {scoresByPlayer[playerId].gross -
                    scoresByPlayer[playerId].hcp}
                </Text>
              </XStack>
            ))}
        </YStack>
      </YStack>
      <XStack gap="$4">
        <Button
          fontSize="$5"
          variant="outlined"
          borderColor={isMajor === "yes" ? "$green10" : "$blue10"}
          color={isMajor === "yes" ? "$green10" : "$blue10"}
          fontWeight="bold"
          onPress={handleHome}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          bg={isMajor === "yes" ? "$green10" : "$blue10"}
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width="$14"
          onPress={submitRound}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner size="small" color="$white1" />
          ) : (
            "Confirm & Submit"
          )}
        </Button>
      </XStack>
    </YStack>
  );
}
