import { YStack } from "@tamagui/stacks";
import { Pressable } from "react-native";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { Text, XStack, View, Separator, Button } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { supabase } from "src/lib/supabase";
import { User } from "src/types/user";
import { useNavigation } from "src/context/NavigationContext";
import * as ImagePicker from "expo-image-picker";

export function Profile({ user }: { user: User }) {
  const { setCurrentProfileState } = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const { error } = await supabase.storage
        .from("avatars")
        .upload(user.id, uri);

      if (error) {
        console.error("Error uploading avatar:", error);
      } else {
        const { data, error: updateError } = await supabase
          .from("users")
          .update({ avatar_url: uri })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating user avatar:", updateError);
        }
      }
    }
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }} width={320}>
      <YStack onPress={pickImage}>
        <PlayerAvatar
          name={user.name || ""}
          avatarUrl={user.avatar_url || ""}
          size="$12"
        />
      </YStack>
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
              <ChevronRight color="$black10" size="$1" />
            </View>
          </XStack>
        </Pressable>

        <Separator width={320} borderColor="$black10" />

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
              <ChevronRight color="$black10" size="$1" />
            </View>
          </XStack>
        </Pressable>
        <Separator width="100%" borderColor="$black10" />
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
              <ChevronRight color="$black10" size="$1" />
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
