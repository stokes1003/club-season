import { YStack, Text, XStack, View, Spinner } from "tamagui";
import { useUser } from "src/context/UserContext";
import { PlayerAvatar } from "../../../UI/PlayerAvatar";
import { useGetUserStats } from "src/hooks/useGetUserStats";
import { Pressable } from "react-native";
import { router } from "expo-router";

export function UserDetails() {
  const { user } = useUser();
  const { userStats } = useGetUserStats(user);

  return (
    <XStack
      gap="$4"
      px="$4"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Pressable onPress={() => router.push("/(tabs)/Profile")}>
        <XStack gap="$4" style={{ alignItems: "center" }}>
          <PlayerAvatar
            name={user?.name || "Unknown Player"}
            avatarUrl={user?.avatar_url || ""}
            size="$6"
            color={user?.player_color || "#6B7280"}
          />

          <YStack>
            <Text fontSize="$6" fontWeight="bold">
              {user?.name || "Unknown Player"}
            </Text>
            <Text fontSize="$4" fontWeight="400" color="$black11">
              Est. {user?.created_at.split("-")[0]}
            </Text>
          </YStack>
        </XStack>
      </Pressable>
      <XStack gap="$4">
        <YStack gap="$2" style={{ alignItems: "center" }}>
          <View
            width="$4"
            height="$4"
            borderColor="$black10"
            borderWidth="$0.25"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text fontSize="$4">
              {userStats?.avg_gross_score && userStats?.avg_gross_score > 0 ? (
                parseFloat(userStats?.avg_gross_score.toString()).toFixed(1)
              ) : (
                <Spinner />
              )}
            </Text>
          </View>
          <Text fontSize="$4" fontWeight="bold">
            AVG
          </Text>
        </YStack>

        <YStack gap="$2" style={{ alignItems: "center" }}>
          <View
            width="$4"
            height="$4"
            borderColor="$black10"
            borderWidth="$0.25"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text fontSize="$4">
              {userStats?.rounds_played && userStats?.rounds_played > 0 ? (
                userStats?.rounds_played.toString()
              ) : (
                <Spinner />
              )}
            </Text>
          </View>
          <Text fontSize="$4" fontWeight="bold">
            Rounds
          </Text>
        </YStack>
      </XStack>
    </XStack>
  );
}
