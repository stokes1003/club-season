import { YStack, Text, Button, Input, Spinner } from "tamagui";
import { useState } from "react";
import { User } from "src/types/user";
import { Alert } from "react-native";
import { supabase } from "src/lib/supabase";
import { ArrowLeft } from "@tamagui/lucide-icons";

export function ChangeName({
  setMode,
  user,
}: {
  setMode: (mode: "name" | "email" | "password" | "profile") => void;
  user: User;
}) {
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
      setMode("profile");
    }
  };

  return (
    <YStack gap="$8" mb="$4" style={{ alignItems: "center" }}>
      <YStack
        onPress={() => setMode("profile")}
        style={{ alignSelf: "flex-start" }}
      >
        <ArrowLeft />
      </YStack>
      <YStack gap="$6" style={{ alignItems: "flex-start" }}>
        <Text fontSize="$8" fontWeight="bold">
          Change Your Name
        </Text>
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="bold">
            Current Name
          </Text>
          <Text fontSize="$5">{user.name}</Text>
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="bold">
            New Name
          </Text>
          <Input
            width="$20"
            placeholder="Enter your new name"
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
          width="$20"
          onPress={handleChangeName}
        >
          {loading ? <Spinner size="small" color="$white1" /> : "Submit"}
        </Button>
        <Button
          variant="outlined"
          color="$blue10"
          fontSize="$5"
          fontWeight="bold"
          width="$20"
          onPress={() => setMode("profile")}
        >
          Cancel
        </Button>
      </YStack>
    </YStack>
  );
}
