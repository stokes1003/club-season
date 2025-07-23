import { View } from "tamagui";
import { Stats } from "../../src/components/Stats";

export default function StatsScreen() {
  return (
    <View flex={1} items="center" bg="$background" pt="$10" px="$8">
      <Stats />
    </View>
  );
}
