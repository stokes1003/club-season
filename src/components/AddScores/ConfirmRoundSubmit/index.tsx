import { Text, YStack, XStack, Button, View, Spinner, Image } from "tamagui";
import { Trophy } from "@tamagui/lucide-icons";
import { PlayerAvatar } from "../../UI/PlayerAvatar";
import { GolfCourse } from "src/types/golfCourse";
import { Pressable } from "react-native";
import { useUploadImage } from "src/hooks/useUploadImage";

type LeagueCourse = {
  id: string;
  course_name: string;
  club_name: string;
  times_played: number;
  external_course_id: number;
  photo_url: string;
};

type CourseSelection = GolfCourse | LeagueCourse;

export function ConfirmRoundSubmit({
  isSubmitting,
  handleHome,
  scoresByPlayer,
  selectedCourse,
  coursePhotoUrl,
  isMajor,
  majorName,
  handleSubmitRound,
  date,
  setCoursePhotoUrl,
}: {
  isSubmitting: boolean;
  handleSubmitRound: () => void;
  handleHome: () => void;
  scoresByPlayer: {
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
      display_name: string;
      player_color: string;
    };
  };
  selectedCourse: CourseSelection;
  coursePhotoUrl: string;
  isMajor: string;
  majorName: string;
  date: Date;
  setCoursePhotoUrl: (url: string) => void;
}) {
  const { pickImage, isUploading } = useUploadImage();

  const handleImageUpload = async () => {
    const imageUrl = await pickImage("courses", selectedCourse.id.toString());
    if (imageUrl) {
      setCoursePhotoUrl(imageUrl);
    }
  };

  return (
    <YStack gap="$6" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <YStack gap="$6" style={{ alignItems: "center" }}>
          <YStack>
            <Text fontWeight="bold" fontSize="$8">
              Confirm Round Details
            </Text>
          </YStack>
          <YStack gap="$4">
            <Pressable onPress={handleImageUpload} disabled={isUploading}>
              <YStack gap="$2" style={{ alignItems: "center" }}>
                <Image
                  source={{
                    uri:
                      coursePhotoUrl ||
                      "https://www.golfcoursearchitecture.net/Portals/0/EasyDNNNews/12339/images/generic-golf-image-950-534-p-L-95.webp",
                  }}
                  style={{ width: 300, height: 150, borderRadius: 2 }}
                />
                <Text fontSize="$4" color="$blue10">
                  {isUploading ? "Uploading..." : "Change Photo"}
                </Text>
              </YStack>
            </Pressable>

            <YStack style={{ alignItems: "center" }}>
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
              <YStack gap="$2" style={{ alignItems: "center" }}>
                <Text fontWeight="600" fontSize="$5">
                  {selectedCourse?.club_name === selectedCourse?.course_name
                    ? selectedCourse?.course_name
                    : `${selectedCourse?.club_name} - ${selectedCourse?.course_name}`}
                </Text>
                <Text fontSize="$5" color="$black11">
                  {date.toLocaleDateString()}
                </Text>
              </YStack>
            </YStack>
            <YStack gap="$3">
              <XStack gap="$4" style={{ alignItems: "center" }}>
                <Text
                  width="$6"
                  style={{ textAlign: "center" }}
                  fontWeight="500"
                >
                  Player
                </Text>
                <Text
                  width="$6"
                  style={{ textAlign: "center" }}
                  fontWeight="500"
                >
                  Gross
                </Text>
                <Text
                  width="$6"
                  style={{ textAlign: "center" }}
                  fontWeight="500"
                >
                  HCP
                </Text>
                <Text
                  width="$6"
                  style={{ textAlign: "center" }}
                  fontWeight="500"
                >
                  Net
                </Text>
              </XStack>
              <YStack gap="$4" style={{ alignItems: "center" }}>
                {Object.keys(scoresByPlayer)
                  .filter((playerId) => playerId !== "undefined")
                  .map((playerId) => (
                    <XStack
                      key={playerId}
                      gap="$4"
                      style={{ alignItems: "center" }}
                    >
                      <View width="$6" style={{ alignItems: "center" }}>
                        <PlayerAvatar
                          name={scoresByPlayer[playerId].display_name}
                          avatarUrl={scoresByPlayer[playerId].avatar_url}
                          size="$4"
                          color={scoresByPlayer[playerId].player_color}
                        />
                      </View>
                      <Text
                        width="$6"
                        style={{ textAlign: "center" }}
                        fontSize="$5"
                      >
                        {scoresByPlayer[playerId].gross}
                      </Text>
                      <Text
                        width="$6"
                        style={{ textAlign: "center" }}
                        fontSize="$5"
                      >
                        {scoresByPlayer[playerId].hcp}
                      </Text>
                      <Text
                        width="$6"
                        style={{ textAlign: "center" }}
                        fontSize="$5"
                      >
                        {scoresByPlayer[playerId].gross -
                          scoresByPlayer[playerId].hcp}
                      </Text>
                    </XStack>
                  ))}
              </YStack>
            </YStack>
          </YStack>
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
          onPress={handleSubmitRound}
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
