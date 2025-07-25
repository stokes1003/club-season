import { Card, Text, XStack, YStack, View } from "tamagui";
import { Medal } from "@tamagui/lucide-icons";
import { Player } from "src/types/player";
import { PlayerAvatar } from "../../../UI/PlayerAvatar";

type PlayerCardProps = {
  playerData: Player;
  index?: number;
  isNet: boolean;
};

export function PlayerCard({ playerData, index, isNet }: PlayerCardProps) {
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
        width={260}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        borderWidth={0}
        borderRadius="$6"
        padding="$6"
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
          <PlayerAvatar
            name={playerData.name || "Unknown Player"}
            avatarUrl={playerData.avatar_url || ""}
            size="$10"
            color={playerData.player_color || "#6B7280"}
          />

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
              {isNet
                ? playerData.net_points || 0
                : playerData.gross_points || 0}
            </Text>
          </XStack>
          <XStack gap="$4" style={{ justifyContent: "space-between" }}>
            <Text
              fontSize="$6"
              fontWeight="bold"
              width={60}
              style={{ textAlign: "right" }}
            >
              Wins
            </Text>
            <Text fontSize="$6" width={60}>
              {isNet ? playerData.net_wins || 0 : playerData.gross_wins || 0}
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
              {isNet
                ? playerData.avg_net && playerData.avg_net > 0
                  ? parseFloat(playerData.avg_net.toString()).toFixed(1)
                  : "-"
                : playerData.avg_gross && playerData.avg_gross > 0
                ? parseFloat(playerData.avg_gross.toString()).toFixed(1)
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
              {isNet ? playerData.best_net || 0 : playerData.best_gross || 0}
            </Text>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}
