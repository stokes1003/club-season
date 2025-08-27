import { ScrollView, View } from "tamagui";
import { AddScores } from "../../src/components/AddScores";

export default function AddScoresScreen() {
  return (
    <View flex={1} items="center" bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} py="$8" px="$8" mb="$10">
        <AddScores />
      </ScrollView>
    </View>
  );
}
