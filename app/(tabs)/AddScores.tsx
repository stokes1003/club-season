import { ScrollView, View } from "tamagui";
import { AddScores } from "../../src/components/AddScores";
import { Keyboard, Pressable } from "react-native";

export default function AddScoresScreen() {
  return (
    <View flex={1} items="center" bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} py="$10" px="$8">
        <Pressable onPress={() => Keyboard.dismiss()}>
          <AddScores />
        </Pressable>
      </ScrollView>
    </View>
  );
}
