import { YStack, ScrollView } from "tamagui";
import { Home } from "../../src/components/Home";

export default function TabOneScreen() {
  return (
    <YStack flex={1} items="center" bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} py="$5">
        <Home />
      </ScrollView>
    </YStack>
  );
}
