import { YStack, Text, Button, Input, Spinner } from "tamagui";
import { useState } from "react";
import { User } from "src/types/user";
import { Alert } from "react-native";
import { supabase } from "src/lib/supabase";
import { useNavigation } from "src/context/NavigationContext";

export function ChangeName({ user }: { user: User }) {
  const { setCurrentProfileState } = useNavigation();
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeName = async () => {
    if (!newName) {
      Alert.alert("Error", "Please enter a new name");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: newName,
        },
      });
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      Alert.alert("Success", "Name updated successfully");
      setNewName("");
    } catch (error) {
      Alert.alert("Error", "Failed to update name");
    } finally {
      setLoading(false);
      setCurrentProfileState("profile");
    }
  };

  return (
    <YStack gap="$8" mb="$4" style={{ alignItems: "center" }} width={320}>
      <YStack gap="$6" style={{ alignItems: "flex-start" }} width="100%">
        <Text fontSize="$8" fontWeight="bold">
          Change Your Name
        </Text>
        <YStack gap="$2" width="100%">
          <Text fontSize="$6" fontWeight="bold">
            Current Name
          </Text>
          <Text fontSize="$5">{user.name}</Text>
        </YStack>

        <YStack gap="$2" width="100%">
          <Text fontSize="$6" fontWeight="bold">
            New Name
          </Text>
          <Input
            width="100%"
            placeholder="Enter your new name"
            value={newName}
            onChangeText={setNewName}
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
          onPress={() => setCurrentProfileState("profile")}
        >
          Cancel
        </Button>
      </YStack>
    </YStack>
  );
}
