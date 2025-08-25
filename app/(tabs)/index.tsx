import { YStack, ScrollView } from "tamagui";
import { Home } from "../../src/components/Home";
import { Keyboard, Pressable } from "react-native";

export default function TabOneScreen() {
  return (
    <YStack flex={1} items="center" bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} py="$5">
        <Pressable onPress={() => Keyboard.dismiss()}>
          <Home />
        </Pressable>
      </ScrollView>
    </YStack>
  );
}
