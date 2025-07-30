import { Text, YStack, XStack, View, Separator, Button } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { supabase } from "src/lib/supabase";
import { User } from "src/types/user";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "src/api/uploadImage";
import { Alert } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { PlayerAvatar } from "../UI/PlayerAvatar";

export function Profile({
  setMode,
  user,
}: {
  setMode: (mode: "name" | "email" | "password" | "profile") => void;
  user: User;
}) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
    });
    if (!result.canceled) {
      const imageUrl = await uploadImage(
        result.assets[0].uri,
        user.id + uuidv4()
      );
      const { data, error } = await supabase.auth.updateUser({
        data: {
          avatar_url: imageUrl,
        },
      });
      if (error) {
        Alert.alert("Error", error.message);
      }
      Alert.alert("Success", "Avatar updated successfully");
    }
  };
  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack onPress={pickImage}>
        <PlayerAvatar
          name={user.name || ""}
          avatarUrl={user.avatar_url || ""}
          size="$12"
        />
      </YStack>
      <YStack gap="$6">
        <XStack
          style={{ justifyContent: "space-between" }}
          onPress={() => {
            setMode("name");
          }}
        >
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              NAME
            </Text>
            <Text fontSize="$5">{user.name}</Text>
          </YStack>
          <View mt="$3">
            <ChevronRight color="$black10" size="$1" />
          </View>
        </XStack>

        <Separator width="$20" borderColor="$black10" />

        <XStack
          style={{ justifyContent: "space-between" }}
          onPress={() => {
            setMode("email");
          }}
        >
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              EMAIL
            </Text>
            <Text fontSize="$5">{user.email}</Text>
          </YStack>
          <View mt="$3">
            <ChevronRight color="$black10" size="$1" />
          </View>
        </XStack>
        <Separator width="$20" borderColor="$black10" />
        <XStack
          style={{ justifyContent: "space-between" }}
          onPress={() => {
            setMode("password");
          }}
        >
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              PASSWORD
            </Text>
            <Text fontSize="$5">************</Text>
          </YStack>
          <View mt="$3">
            <ChevronRight color="$black10" size="$1" />
          </View>
        </XStack>
      </YStack>

      <Button
        onPress={() => supabase.auth.signOut()}
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$20"
      >
        Logout
      </Button>
    </YStack>
  );
}
