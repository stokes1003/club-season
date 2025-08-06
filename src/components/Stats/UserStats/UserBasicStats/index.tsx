import { YStack, XStack, View, Text, Separator } from "tamagui";
import { PlayerAvatar } from "../../../UI/PlayerAvatar";
import { User } from "src/types/user";
import { useGetUserStats } from "src/hooks/useGetUserStats";

type UserBasicStatsProps = {
  user: User | null;
};

export function UserBasicStats({ user }: UserBasicStatsProps) {
  const { userStats } = useGetUserStats(user);

  const basicStats = [
    {
      value: userStats?.avg_gross_score,
      label: "AVG Gross",
    },
    {
      value: userStats?.rounds_played,
      label: "Rounds Played",
    },
    {
      value: userStats?.avg_net_score,
      label: "AVG Net",
    },
  ];

  return (
    <>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <PlayerAvatar
          name={user?.name || "Unknown Player"}
          avatarUrl={user?.avatar_url || ""}
          size="$10"
          color={user?.player_color || "#6B7280"}
        />
        <Text fontSize="$8" fontWeight="bold">
          {user?.name || "Unknown Player"}
        </Text>
      </YStack>
      <XStack style={{ justifyContent: "space-evenly" }}>
        {basicStats.map((stat, index) => (
          <YStack
            key={stat.label}
            gap="$3"
            style={{ alignItems: "center" }}
            width="$8"
          >
            <View
              width="$7"
              height="$7"
              borderColor="$black10"
              borderWidth="$0.25"
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "100%",
              }}
            >
              <Text
                fontSize="$8"
                fontWeight="bold"
                style={{ textAlign: "center" }}
              >
                {stat.value}
              </Text>
            </View>
            <Text
              fontSize="$6"
              fontWeight="bold"
              style={{ textAlign: "center" }}
            >
              {stat.label}
            </Text>
          </YStack>
        ))}
      </XStack>
      <Separator width="100%" borderColor="$black10" />
    </>
  );
}
