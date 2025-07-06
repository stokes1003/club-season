import { View } from "tamagui";
import { MyLeagues } from "src/components/MyLeagues";

export default function MyLeaguesScreen() {
  return (
    <View flex={1} items="center" bg="$background" pt="$10" px="$8">
      <MyLeagues />
    </View>
  );
}
