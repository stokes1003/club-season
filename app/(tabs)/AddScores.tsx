import { View } from "tamagui";
import { AddScores } from "../components/AddScores";

export default function AddScoresScreen() {
  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <AddScores />
    </View>
  );
}
