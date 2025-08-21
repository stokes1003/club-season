import { router } from "expo-router";
import { YStack, Text, Image, View, Button } from "tamagui";

export function IntroScreen() {
  return (
    <YStack gap="$8" p="$6">
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../../../../../assets/images/ClubSeason.png")}
          width={320}
          height={200}
        />
      </View>
      <YStack gap="$4">
        <Text fontSize="$8" fontWeight="bold">
          Welcome to Club Season
        </Text>
        <Text fontSize="$6" fontWeight="400">
          Create a league, invite your friends and start competing.
        </Text>
      </YStack>
      <View style={{ alignItems: "center" }}>
        <Button
          bg="$blue10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width="100%"
          onPress={() => {
            router.push("/CreateLeague");
          }}
        >
          Create A League
        </Button>
      </View>
    </YStack>
  );
}
