import { YStack, ScrollView } from "tamagui";
import { Home } from "../../src/components/Home";

export default function TabOneScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack
        flex={1}
        style={{ alignItems: "center" }}
        py="$5"
        bg="$background"
      >
        <Home />
      </YStack>
    </ScrollView>
  );
}
