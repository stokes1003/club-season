import {
  Avatar,
  Button,
  Text,
  YStack,
  Separator,
  ScrollView,
  XStack,
  View,
} from "tamagui";
import { supabase } from "../../lib/supabase";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useUser } from "app/hooks/useUser";

export function Profile() {
  const user = useUser();
  const router = useRouter();

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack gap="$8" mt="$6" mb="$4" style={{ alignItems: "center" }}>
        <YStack
          onPress={() => {
            console.log("avatar");
          }}
        >
          <Avatar circular size="$12">
            <Avatar.Image src={user.avatar_url || ""} />
          </Avatar>
        </YStack>
        <YStack gap="$6">
          <XStack
            style={{ justifyContent: "space-between" }}
            onPress={() => {
              router.push("/Profile/ChangeName");
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
              console.log("email");
              router.push("/Profile/ChangeEmail");
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
              console.log("password");
              router.push("/Profile/ChangePassword");
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
    </ScrollView>
  );
}
