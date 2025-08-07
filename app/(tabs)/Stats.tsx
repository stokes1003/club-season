import { ScrollView, View } from "tamagui";
import { Stats } from "../../src/components/Stats";

export default function StatsScreen() {
  return (
    <View flex={1} items="center" bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} py="$8" px="$4">
        <Stats />
      </ScrollView>
    </View>
  );
}
