import { Card, XStack, YStack, Text, View } from "tamagui";
import { Image } from "expo-image";
import { PlayerAvatar } from "../../UI/PlayerAvatar";

type Round = {
  _id: string;
  course: string;
  course_img: string;
  date: string;
  isMajor?: boolean;
  majorName?: string;
  scores: {
    player: string;
    gross: number;
    hcp: number;
    net: number;
    player_img: string;
    player_color: string;
  }[];
};

type RoundCardProps = {
  roundData: Round;
};

export function RoundCard({ roundData }: RoundCardProps) {
  // Safety check for roundData
  if (!roundData) {
    return null;
  }

  // Safety check for date
  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <XStack>
      <Card
        animation="bouncy"
        width={336}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        alignItems="center"
        backgroundColor="white"
        borderWidth={2}
        borderColor="$borderColor"
        borderRadius="$6"
        overflow="hidden"
        shadowColor="black"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.15}
        shadowRadius={8}
        elevation={8}
      >
        <YStack gap="$4" style={{ alignItems: "center" }} pb="$4">
          <Image
            source={{ uri: roundData.course_img }}
            style={{ width: 344, height: 200 }}
            contentFit="cover"
          />

          {roundData.isMajor && (
            <View
              style={{
                position: "absolute",
                bottom: 305,
                backgroundColor: "green",
                width: "100%",
                height: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text fontWeight="bold" color="white" fontSize="$6">
                {roundData.majorName || "Major"}
              </Text>
            </View>
          )}

          <YStack gap="$2" style={{ alignItems: "center" }}>
            <Text
              fontWeight="bold"
              fontSize="$6"
              style={{ textAlign: "center" }}
            >
              {roundData.course || "Unknown Course"}
            </Text>
            <Text fontSize="$6" color="$black11" opacity={0.7}>
              {formatDate(roundData.date)}
            </Text>
          </YStack>

          <XStack gap={48} style={{ alignItems: "center" }}>
            <Text fontWeight="bold" width={40} style={{ textAlign: "center" }}>
              PLR
            </Text>
            <Text fontWeight="bold" width={32} style={{ textAlign: "center" }}>
              GRS
            </Text>
            <Text fontWeight="bold" width={32} style={{ textAlign: "center" }}>
              NET
            </Text>
            <Text fontWeight="bold" width={32} style={{ textAlign: "center" }}>
              HCP
            </Text>
          </XStack>

          {roundData.scores
            ?.slice()
            .sort((a, b) => a.net - b.net)
            .map((score, index) => (
              <XStack key={index} gap={48} style={{ alignItems: "center" }}>
                <PlayerAvatar
                  name={score.player}
                  avatarUrl={score.player_img}
                  size="$4"
                  color={score.player_color}
                />
                <Text width={32} fontSize="$6" style={{ textAlign: "center" }}>
                  {score?.gross || 0}
                </Text>
                <Text width={32} fontSize="$6" style={{ textAlign: "center" }}>
                  {score?.net || 0}
                </Text>
                <Text width={32} fontSize="$6" style={{ textAlign: "center" }}>
                  {score?.hcp || 0}
                </Text>
              </XStack>
            ))}
        </YStack>
      </Card>
    </XStack>
  );
}
