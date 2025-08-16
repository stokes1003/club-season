import { useState } from "react";
import { Alert } from "react-native";
import { YStack, Text, Spinner, Button, RadioGroup } from "tamagui";
import { Player } from "src/types/player";
import { League } from "src/components/MyLeagues";
import { updatePlayerRole } from "src/api/players/updatePlayerRole";
import { RadioGroupItemWithLabel } from "src/components/UI/RadioGroup";

export function ChangePlayerRole({
  setMode,
  selectedPlayer,
  selectedLeague,
  setSelectedPlayer,
}: {
  setMode: (mode: "change-role" | "profile") => void;
  selectedPlayer: Player;
  selectedLeague: League;
  setSelectedPlayer: (player: Player) => void;
}) {
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeRole = async () => {
    setLoading(true);
    if (!newRole) {
      Alert.alert("Error", "New role cannot be empty");
      return;
    }
    if (newRole === selectedPlayer.player_role) {
      Alert.alert("Error", "New role cannot be the same as the current role");
      return;
    }
    await updatePlayerRole(selectedPlayer.player_id, newRole);
    Alert.alert("Success", "Player role changed successfully");
    setSelectedPlayer({
      ...selectedPlayer,
      player_role: newRole,
    });
    setLoading(false);
    setMode("profile");
  };

  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <YStack gap="$4">
        <Text fontSize="$8" fontWeight="bold">
          Change Player Role
        </Text>
        <Text fontSize="$4" fontWeight="400">
          Change the role of the player in {selectedLeague.name}.
        </Text>
      </YStack>
      <YStack gap="$6">
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold">
            Current Role
          </Text>
          <Text fontSize="$5" fontWeight="400">
            {selectedPlayer.player_role}
          </Text>
        </YStack>
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold">
            New Role
          </Text>
          <RadioGroup value={newRole} onValueChange={setNewRole}>
            <RadioGroupItemWithLabel
              size="$5"
              value="commissioner"
              label="Commissioner"
            />
            <RadioGroupItemWithLabel size="$5" value="player" label="Player" />
          </RadioGroup>
        </YStack>
      </YStack>
      <YStack gap="$4">
        <Button
          bg="$blue10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width="100%"
          onPress={handleChangeRole}
        >
          {loading ? <Spinner size="small" color="$white1" /> : "Submit"}
        </Button>
        <Button
          variant="outlined"
          color="$blue10"
          fontSize="$5"
          fontWeight="bold"
          width="100%"
          onPress={() => setMode("profile")}
        >
          Cancel
        </Button>
      </YStack>
    </YStack>
  );
}
