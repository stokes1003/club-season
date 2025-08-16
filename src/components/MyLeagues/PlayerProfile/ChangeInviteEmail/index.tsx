import { YStack, Text, Input, XStack, Spinner, Button } from "tamagui";
import { Alert, Pressable } from "react-native";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Player } from "src/types/player";
import { League } from "../..";
import { useState } from "react";
import { isValidEmail } from "src/utils/validation";
import { updatePlayerInviteEmail } from "src/api/players/updatePlayerInviteEmail";

export function ChangeInviteEmail({
  setMode,
  selectedPlayer,
  selectedLeague,
  setSelectedPlayer,
}: {
  setMode: (mode: "change-email" | "profile") => void;
  selectedPlayer: Player;
  selectedLeague: League;
  setSelectedPlayer: (player: Player) => void;
}) {
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = async () => {
    setLoading(true);
    if (!newEmail) {
      Alert.alert("Error", "New email cannot be empty");
      return;
    }
    if (newEmail === selectedPlayer.invite_email) {
      Alert.alert("Error", "New email cannot be the same as the current email");
      return;
    }
    if (!isValidEmail(newEmail)) {
      Alert.alert("Error", "Invalid email");
      return;
    }
    await updatePlayerInviteEmail(selectedPlayer.player_id, newEmail);
    Alert.alert("Success", "Invite email changed successfully");
    setLoading(false);
    setMode("profile");
    setSelectedPlayer({
      ...selectedPlayer,
      invite_email: newEmail,
    });
  };
  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <YStack gap="$4">
        <Text fontSize="$8" fontWeight="bold">
          Change Invite Email
        </Text>
        <Text fontSize="$4" fontWeight="400">
          Change the email that will be used to invite the player to
          {selectedLeague.name}.
        </Text>
      </YStack>
      <YStack gap="$6">
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold">
            Current Invite Email
          </Text>
          <Text fontSize="$5" fontWeight="400">
            {selectedPlayer.invite_email}
          </Text>
        </YStack>
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold">
            New Invite Email
          </Text>
          <Input
            placeholder="Enter new invite email"
            value={newEmail}
            onChangeText={setNewEmail}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={handleChangeEmail}
            onBlur={() => setNewEmail(newEmail.trim())}
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
          onPress={handleChangeEmail}
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
