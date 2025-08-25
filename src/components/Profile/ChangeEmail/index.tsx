import { YStack, Text, Button, Input, Spinner } from "tamagui";
import { User } from "src/types/user";
import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "src/lib/supabase";
import { useNavigation } from "src/context/NavigationContext";

export function ChangeEmail({ user }: { user: User }) {
  const { setCurrentProfileState } = useNavigation();
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = async () => {
    if (!newEmail || newEmail === user.email) {
      Alert.alert("Error", "Please enter a new email");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      Alert.alert("Success", "Email updated successfully");
      setNewEmail("");
    } catch (error) {
      Alert.alert("Error", "Failed to update email");
    } finally {
      setLoading(false);
      setCurrentProfileState("profile");
    }
  };

  return (
    <YStack gap="$8" mb="$4" style={{ alignItems: "center" }} width={320}>
      <YStack gap="$6" style={{ alignItems: "flex-start" }} width="100%">
        <Text fontSize="$8" fontWeight="bold">
          Change Your Email
        </Text>
        <YStack gap="$2" width="100%">
          <Text fontSize="$6" fontWeight="bold">
            Current Email
          </Text>
          <Text fontSize="$5">{user.email}</Text>
        </YStack>

        <YStack gap="$2" width="100%">
          <Text fontSize="$6" fontWeight="bold">
            New Email
          </Text>
          <Input
            width="100%"
            placeholder="Enter your new email"
            value={newEmail}
            onChangeText={setNewEmail}
          />
        </YStack>
      </YStack>

      <YStack gap="$4" width="100%">
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
          onPress={() => setCurrentProfileState("profile")}
        >
          Cancel
        </Button>
      </YStack>
    </YStack>
  );
}
