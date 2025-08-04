import { Card, YStack, Text, XStack } from "tamagui";
import { useUser } from "src/context/UserContext";
import { PlayerAvatar } from "../../../../UI/PlayerAvatar";
import { useGetUserStats } from "src/hooks/useGetUserStats";

export function UserStatsCard() {
  const { user } = useUser();
  const { userStats } = useGetUserStats(user);

  return (
    <YStack gap="$2" style={{ alignItems: "center" }}>
      <Card
        animation="bouncy"
        width={300}
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
          boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <YStack gap="$4" style={{ alignItems: "center" }}>
          <PlayerAvatar
            name={user?.name || "Unknown Player"}
            avatarUrl={user?.avatar_url || ""}
            size="$10"
            color={user?.player_color || "#6B7280"}
          />
          <Text fontSize="$6" fontWeight="bold">
            {user?.name || "Unknown Player"}
          </Text>

          <XStack gap="$2" style={{ justifyContent: "space-between" }}>
            <Text
              fontSize="$6"
              fontWeight="bold"
              width={60}
              style={{ textAlign: "right" }}
            >
              AVG
            </Text>
            <Text fontSize="$6" width={60}>
              {userStats?.avg_net_score && userStats?.avg_net_score > 0
                ? parseFloat(userStats?.avg_net_score.toString()).toFixed(1)
                : "-"}
            </Text>
          </XStack>

          <XStack gap="$2" style={{ justifyContent: "space-between" }}>
            <Text
              fontSize="$6"
              fontWeight="bold"
              width={70}
              style={{ textAlign: "right" }}
            >
              Rounds
            </Text>
            <Text fontSize="$6" width={70}>
              {userStats?.rounds_played && userStats?.rounds_played > 0
                ? userStats?.rounds_played.toString()
                : "-"}
            </Text>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}
