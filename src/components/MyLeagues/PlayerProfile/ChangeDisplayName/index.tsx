import { YStack, Text, Input, Spinner, Button } from "tamagui";
import { Player } from "src/types/player";
import { League } from "../..";
import { Alert } from "react-native";
import { useState } from "react";
import { updatePlayerDisplayName } from "src/api/players/updatePlayerDisplayName";

export function ChangeDisplayName({
  selectedPlayer,
  selectedLeague,
  setMode,
  setSelectedPlayer,
}: {
  selectedPlayer: Player;
  selectedLeague: League;
  setMode: (
    mode: "change-name" | "change-email" | "change-role" | "profile"
  ) => void;
  setSelectedPlayer: (player: Player) => void;
}) {
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeName = async () => {
    setLoading(true);
    if (!newName) {
      Alert.alert("Error", "New name cannot be empty");
      return;
    }
    if (newName === selectedPlayer.name) {
      Alert.alert("Error", "New name cannot be the same as the current name");
      return;
    }
    await updatePlayerDisplayName(selectedPlayer.player_id, newName);
    setSelectedPlayer({
      ...selectedPlayer,
      name: newName,
    });

    Alert.alert("Success", "Display name changed successfully");
    setMode("profile");
    setLoading(false);
  };
  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <YStack gap="$4">
        <Text fontSize="$8" fontWeight="bold">
          Change Display Name
        </Text>
        <Text fontSize="$4" fontWeight="400">
          Change your display name to something that will be used to identify
          the player in {selectedLeague.name}.
        </Text>
      </YStack>
      <YStack gap="$6">
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold">
            Current Display Name
          </Text>
          <Text fontSize="$5" fontWeight="400">
            {selectedPlayer.name}
          </Text>
        </YStack>
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold">
            New Display Name
          </Text>
          <Input
            placeholder="Enter new display name"
            value={newName}
            onChangeText={setNewName}
          />
        </YStack>
      </YStack>
      <YStack gap="$4">
        <Button
          bg="$blue10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width="100%"
          onPress={handleChangeName}
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
