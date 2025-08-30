import { YStack } from "@tamagui/stacks";
import { Alert, Pressable } from "react-native";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { Text, XStack, View, Separator, Button } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { supabase } from "src/lib/supabase";
import { User } from "src/types/user";
import { useNavigation } from "src/context/NavigationContext";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "src/api/uploadImage";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useUser } from "src/context/UserContext";

export function Profile({ user }: { user: User }) {
  const { setCurrentProfileState } = useNavigation();
  const [profileImage, setProfileImage] = useState(user.avatar_url);
  const { refreshUser } = useUser();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;

      setProfileImage(localUri);

      try {
        const path = `users/${user.id}/${uuidv4()}.jpg`;
        const uploadedUrl = await uploadImage(localUri, path);

        if (uploadedUrl) {
          const { error } = await supabase.auth.updateUser({
            data: { avatar_url: uploadedUrl },
          });

          if (error) {
            console.error("Error updating user avatar:", error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
          } else {
            setProfileImage(uploadedUrl);

            const {
              data: { session },
            } = await supabase.auth.refreshSession();
            if (session) {
              refreshUser();
            }

            Alert.alert("Success", "Profile picture updated successfully!");
          }
        } else {
          Alert.alert("Error", "Failed to upload image. Please try again.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert("Error", "Failed to upload image. Please try again.");
      }
    }
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }} width="100%" px="$4">
      <Pressable onPress={pickImage}>
        <PlayerAvatar
          name={user.name || ""}
          avatarUrl={profileImage || ""}
          size="$10"
          color={user.player_color || "#6B7280"}
        />
      </Pressable>
      <YStack gap="$6" width="100%">
        <Pressable
          onPress={() => {
            setCurrentProfileState("changeName");
          }}
        >
          <XStack style={{ justifyContent: "space-between" }}>
            <YStack gap="$2">
              <Text fontSize="$6" fontWeight="bold">
                NAME
              </Text>
              <Text fontSize="$5">{user.name}</Text>
            </YStack>
            <View mt="$3">
              <ChevronRight color="$black10" size="$2" />
            </View>
          </XStack>
        </Pressable>

        <Separator width="100%" borderColor="$black11" />

        <Pressable
          onPress={() => {
            setCurrentProfileState("changeEmail");
          }}
        >
          <XStack style={{ justifyContent: "space-between" }} width="100%">
            <YStack gap="$2">
              <Text fontSize="$6" fontWeight="bold">
                EMAIL
              </Text>
              <Text fontSize="$5">{user.email}</Text>
            </YStack>
            <View mt="$3">
              <ChevronRight color="$black10" size="$2" />
            </View>
          </XStack>
        </Pressable>
        <Separator width="100%" borderColor="$black11" />
        <Pressable
          onPress={() => {
            setCurrentProfileState("changePassword");
          }}
        >
          <XStack style={{ justifyContent: "space-between" }} width="100%">
            <YStack gap="$2">
              <Text fontSize="$6" fontWeight="bold">
                PASSWORD
              </Text>
              <Text fontSize="$5">************</Text>
            </YStack>
            <View mt="$3">
              <ChevronRight color="$black10" size="$2" />
            </View>
          </XStack>
        </Pressable>
      </YStack>
      <YStack gap="$4" width="100%">
        <Button
          onPress={() => setCurrentProfileState("inviteFriends")}
          bg="$white1"
          borderWidth="$1"
          borderColor="$blue10"
          color="$blue10"
          fontSize="$5"
          fontWeight="bold"
          width="100%"
        >
          Invite Friends
        </Button>
        <Button
          onPress={() => supabase.auth.signOut()}
          bg="$blue10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width="100%"
        >
          Logout
        </Button>
      </YStack>
    </YStack>
  );
}
