import { View } from "tamagui";
import { AddScores } from "../../src/components/AddScores";

export default function AddScoresScreen() {
  return (
    <View flex={1} items="center" bg="$background" pt="$10" px="$8">
      <AddScores />
    </View>
  );
}
