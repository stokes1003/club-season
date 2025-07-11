import { Avatar, Card, Text, XStack, YStack, View } from "tamagui";
import { Medal } from "@tamagui/lucide-icons";

type Player = {
  avatar_url: string;
  avg_gross_score: number;
  avg_net_score: number;
  best_gross_score: number;
  best_net_score: number;
  gross_points: number;
  name: string;
  net_points: number;
  player_id: string;
};

type PlayerCardProps = {
  playerData: Player;
  index?: number;
};

export function PlayerCard({ playerData, index }: PlayerCardProps) {
  // Safety check for playerData
  if (!playerData) {
    return null;
  }

  const getBoxShadow = () => {
    if (index === 0) return "0 0 12px rgba(255, 215, 0, 0.6)";
    if (index === 1) return "0 0 12px rgba(167, 167, 173, 0.6)";
    if (index === 2) return "0 0 12px rgba(167, 112, 68, 0.6)";
    return "none";
  };

  return (
    <YStack gap="$3">
      <Card
        animation="bouncy"
        width={240}
        height={280}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        borderWidth={0}
        borderRadius="$6"
        padding="$3"
        style={{
          boxShadow: getBoxShadow(),
        }}
        aria-label={`Player card for ${playerData.name || "Unknown Player"}`}
      >
        <View style={{ position: "absolute", top: 8, left: 8 }}>
          {index === 0 && <Medal size={24} color="#D6AF36" />}
          {index === 1 && <Medal size={24} color="#A7A7AD" />}
          {index === 2 && <Medal size={24} color="#A77044" />}
        </View>
        <YStack gap="$3" style={{ alignItems: "center" }}>
          <Avatar circular size="$10">
            <Avatar.Image
              accessibilityLabel={playerData.name || "Unknown Player"}
              src={playerData.avatar_url || ""}
            />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>

          <Text fontSize="$6" fontWeight="bold">
            {playerData.name || "Unknown Player"}
          </Text>

          <XStack gap="$4" style={{ justifyContent: "space-between" }}>
            <Text
              fontSize="$6"
              width={60}
              fontWeight="bold"
              style={{ textAlign: "right" }}
            >
              Points
            </Text>
            <Text fontSize="$6" width={60}>
              {playerData.net_points || 0}
            </Text>
          </XStack>

          <XStack gap="$4" style={{ justifyContent: "space-between" }}>
            <Text
              fontSize="$6"
              fontWeight="bold"
              width={60}
              style={{ textAlign: "right" }}
            >
              AVG
            </Text>
            <Text fontSize="$6" width={60}>
              {playerData.avg_net_score && playerData.avg_net_score > 0
                ? parseFloat(playerData.avg_net_score.toString()).toFixed(1)
                : "-"}
            </Text>
          </XStack>

          <XStack gap="$4" style={{ justifyContent: "space-between" }}>
            <Text
              fontSize="$6"
              fontWeight="bold"
              width={60}
              style={{ textAlign: "right" }}
            >
              Best
            </Text>
            <Text fontSize="$6" width={60}>
              {playerData.best_net_score || 0}
            </Text>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}
