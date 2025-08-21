import { YStack, XStack, Text, Separator, View } from "tamagui";
import { Alert, Pressable } from "react-native";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { ChevronDown, ChevronRight } from "@tamagui/lucide-icons";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { League } from "../..";
import { Player } from "src/types/player";
import { useState } from "react";
import { useUser } from "src/context/UserContext";
import { useGetPlayerRole } from "src/hooks/useGetPlayerRole";

export function LeaguePlayerDetails({
  selectedLeague,
  setSelectedPlayer = () => {},
}: {
  selectedLeague: League;
  setSelectedPlayer?: (player: Player | null) => void;
}) {
  const players = useGetPlayers(selectedLeague.id);
  const { user } = useUser();

  const playerRole = useGetPlayerRole(user?.id || "", selectedLeague.id);
  const isCommissioner = playerRole?.toLowerCase() === "commissioner";

  const [showPlayers, setShowPlayers] = useState(true);
  return (
    <YStack gap="$6" style={{ alignItems: "center", width: "100%" }}>
      <YStack gap="$6">
        <XStack style={{ justifyContent: "space-between" }} width={320}>
          <Text fontSize="$8" fontWeight="bold">
            Players
          </Text>
          <Pressable onPress={() => setShowPlayers(!showPlayers)}>
            {showPlayers ? <ChevronDown /> : <ChevronRight />}
          </Pressable>
        </XStack>

        {showPlayers && (
          <YStack gap="$4">
            <Separator width={320} borderColor="$black11" />
            {players?.map((player) => (
              <YStack key={player.player_id} gap="$4">
                <Pressable
                  onPress={() => {
                    if (isCommissioner || player.user_id === user?.id) {
                      setSelectedPlayer(player);
                    } else {
                      Alert.alert(
                        "You do not have permission to view this player's details."
                      );
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
                    <XStack gap="$4" style={{ alignItems: "center" }}>
                      <PlayerAvatar
                        name={player.name}
                        avatarUrl={player.avatar_url}
                        size="$5"
                        color={player.player_color || undefined}
                      />
                      <YStack gap="$1">
                        <Text fontSize="$6" fontWeight="400">
                          {player.name}
                        </Text>

                        <Text fontSize="$4" color="$black10">
                          {player.player_role.charAt(0).toUpperCase() +
                            player.player_role.slice(1)}
                        </Text>
                      </YStack>
                    </XStack>

                    {(isCommissioner || player.user_id === user?.id) && (
                      <View>
                        <ChevronRight />
                      </View>
                    )}
                  </XStack>
                </Pressable>

                <Separator width={320} borderColor="$black11" />
              </YStack>
            ))}
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
