import { YStack, XStack, View, Text, Spinner } from "tamagui";
import { PlayerAvatar } from "../../../UI/PlayerAvatar";
import { User } from "src/types/user";
import { useGetUserStats } from "src/hooks/useGetUserStats";
import { Pressable } from "react-native";
import { router } from "expo-router";

type UserBasicStatsProps = {
  user: User | null;
};

export function UserBasicStats({ user }: UserBasicStatsProps) {
  const { userStats, loading } = useGetUserStats(user);

  const basicStats = [
    {
      value: userStats?.avg_gross_score,
      label: "AVG",
    },
    {
      value: userStats?.rounds_played,
      label: "Rounds",
    },
    {
      value: userStats?.avg_net_score,
      label: "AVG Net",
    },
  ];

  return (
    <>
      <YStack gap="$6" style={{ alignItems: "center" }}>
        <YStack gap="$2" style={{ alignItems: "center" }}>
          <Pressable
            onPress={() => {
              router.push("/(tabs)/Profile");
            }}
          >
            <PlayerAvatar
              name={user?.name || "Unknown Player"}
              avatarUrl={user?.avatar_url || ""}
              size="$10"
              color={user?.player_color || "#6B7280"}
            />
          </Pressable>
          <Text fontSize="$8" fontWeight="bold">
            {user?.name || "Unknown Player"}
          </Text>
        </YStack>
      </YStack>

      <XStack gap="$4" style={{ justifyContent: "center" }}>
        {basicStats.map((stat) => (
          <YStack
            key={stat.label}
            gap="$3"
            style={{ alignItems: "center" }}
            width="$8"
          >
            <View
              width="$4"
              height="$4"
              borderColor="$black11"
              borderWidth="$0.25"
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                fontSize="$4"
                fontWeight="bold"
                style={{ textAlign: "center" }}
              >
                {loading ? <Spinner /> : stat.value}
              </Text>
            </View>
            <Text
              fontSize="$5"
              fontWeight="500"
              style={{ textAlign: "center" }}
            >
              {stat.label}
            </Text>
          </YStack>
        ))}
      </XStack>
    </>
  );
}
