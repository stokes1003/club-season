import { ScrollView, View } from "tamagui";
import { Profile } from "src/components/Profile";

export default function ProfileScreen() {
  return (
    <View flex={1} items="center" bg="$background" px="$8">
      <ScrollView showsVerticalScrollIndicator={false} pt="$10">
        <Profile />
      </ScrollView>
    </View>
  );
}
