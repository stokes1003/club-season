import { View } from "tamagui";
import { Settings } from "../../src/components/Settings";

export default function SettingsScreen() {
  return (
    <View flex={1} items="center" bg="$background" pt="$10" px="$8">
      <Settings />
    </View>
  );
}
