import { ArrowLeft } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { Player } from "src/types/player";
import { YStack, Text, Label, XStack, Separator, Button } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { League } from "..";

export function PlayerProfile({
  selectedPlayer,
  setSelectedPlayer,
  selectedLeague,
}: {
  selectedPlayer: Player;
  setSelectedPlayer: (player: Player | null) => void;
  selectedLeague: League;
}) {
  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <XStack style={{ alignItems: "flex-start", width: "100%" }}>
        <Pressable onPress={() => setSelectedPlayer(null)}>
          <ArrowLeft />
        </Pressable>
      </XStack>
      <YStack style={{ alignItems: "center" }} gap="$6">
        <Text fontSize="$8" fontWeight="bold">
          Player Profile
        </Text>
        <PlayerAvatar
          name={selectedPlayer.name}
          avatarUrl={selectedPlayer.avatar_url}
          size="$10"
          color={selectedPlayer.player_color || undefined}
        />
      </YStack>

      <YStack gap="$4">
        <Text fontSize="$5" fontWeight="400">
          Customize player details for {selectedLeague.name}. These details will
          only affect {selectedLeague.name}.
        </Text>
        <XStack
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <YStack gap="$1">
            <Label fontSize="$6" fontWeight="600">
              Display Name
            </Label>
            <Text fontSize="$5">{selectedPlayer.name}</Text>
          </YStack>
          <ChevronRight />
        </XStack>
        <Separator width={320} borderColor="$black10" />
        <XStack
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <YStack gap="$1">
            <Label fontSize="$6" fontWeight="600">
              Invitation Email
            </Label>
            <Text fontSize="$5" fontWeight="400">
              {selectedPlayer.invite_email}
            </Text>
          </YStack>
          <ChevronRight />
        </XStack>
        <Separator width={320} borderColor="$black10" />
        <XStack
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <YStack gap="$1">
            <Label fontSize="$6" fontWeight="600">
              Role
            </Label>
            <Text fontSize="$5" fontWeight="400">
              Player
            </Text>
          </YStack>
          <ChevronRight />
        </XStack>
      </YStack>
      <Button
        bg="$red10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        style={{ width: "100%" }}
      >
        Delete Player
      </Button>
    </YStack>
  );
}
