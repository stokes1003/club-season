import { View } from "tamagui";
import { Profile } from "../../src/components/Profile";

export default function ProfileScreen() {
  return (
    <View flex={1} items="center" bg="$background" pt="$10" px="$8">
      <Profile />
    </View>
  );
}
