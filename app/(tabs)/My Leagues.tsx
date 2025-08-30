import { ScrollView, View } from "tamagui";
import { MyLeagues } from "src/components/MyLeagues";
import { Keyboard, Pressable } from "react-native";

export default function MyLeaguesScreen() {
  return (
    <View flex={1} items="center" bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} py="$8" px="$4">
        <Pressable onPress={() => Keyboard.dismiss()}>
          <MyLeagues />
        </Pressable>
      </ScrollView>
    </View>
  );
}
