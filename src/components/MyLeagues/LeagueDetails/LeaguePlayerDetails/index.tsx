import { YStack, XStack, Text, Separator, View } from "tamagui";
import { Alert, Pressable } from "react-native";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { League } from "../..";

export function LeaguePlayerDetails({
  selectedLeague,
  isCommissioner,
}: {
  selectedLeague: League;
  isCommissioner: boolean;
}) {
  const players = useGetPlayers(selectedLeague.id);
  return (
    <YStack gap="$6" style={{ alignItems: "center", width: "100%" }}>
      <YStack gap="$6">
        <Text fontSize="$8" fontWeight="bold">
          Players
        </Text>
        <YStack gap="$4">
          <Separator width={320} borderColor="$black10" />
          {players?.map((player) => (
            <YStack key={player.player_id} gap="$4">
              <Pressable
                onPress={() => {
                  if (!isCommissioner) {
                    Alert.alert("Only commissioner can edit player details");
                    return;
                  }
                }}
              >
                <XStack
                  gap="$4"
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <XStack gap="$4">
                    <PlayerAvatar
                      name={player.name}
                      avatarUrl={player.avatar_url}
                      size="$5"
                      color={player.player_color || undefined}
                    />
                    <YStack gap="$2">
                      <Text fontSize="$6" fontWeight="400">
                        {player.name}
                      </Text>
                      <Text fontSize="$4" fontWeight="400">
                        {player.invite_email}
                      </Text>
                    </YStack>
                  </XStack>

                  <View>
                    <ChevronRight />
                  </View>
                </XStack>
              </Pressable>

              <Separator width={320} borderColor="$black10" />
            </YStack>
          ))}
        </YStack>
      </YStack>
    </YStack>
  );
}
