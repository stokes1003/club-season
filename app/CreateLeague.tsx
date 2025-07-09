import { View } from "tamagui";
import { Stack } from "expo-router";
import { CreateLeague } from "src/components/CreateLeague";

export default function CreateLeagueScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Create League",
          presentation: "modal",
        }}
      />
      <View flex={1} items="center" bg="$background" px="$8">
        <CreateLeague />
      </View>
    </>
  );
}
