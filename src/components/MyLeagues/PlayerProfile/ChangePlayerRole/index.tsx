import { useState } from "react";
import { Alert, Pressable } from "react-native";
import { YStack, Text, Input, XStack, Spinner, Button } from "tamagui";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Player } from "src/types/player";
import { League } from "src/components/MyLeagues";

export function ChangePlayerRole({
  setMode,
  selectedPlayer,
  selectedLeague,
}: {
  setMode: (mode: "change-role" | "profile") => void;
  selectedPlayer: Player;
  selectedLeague: League;
}) {
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeRole = async () => {
    setLoading(true);
    if (!newRole) {
      Alert.alert("Error", "New role cannot be empty");
      return;
    }
    // if (newRole === selectedPlayer.role) {
    //   Alert.alert("Error", "New role cannot be the same as the current role");
    //   return;
    // }
    // TODO: Implement API call to change role
    setLoading(false);
    setMode("profile");
  };
  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <XStack style={{ alignItems: "flex-start", width: "100%" }}>
        <Pressable onPress={() => setMode("profile")}>
          <ArrowLeft />
        </Pressable>
      </XStack>
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
            Player
          </Text>
        </YStack>
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold">
            New Role
          </Text>
          <Input
            placeholder="Enter new role"
            value={newRole}
            onChangeText={setNewRole}
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
