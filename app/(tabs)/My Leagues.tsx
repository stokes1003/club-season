import { ScrollView, View } from "tamagui";
import { MyLeagues } from "src/components/MyLeagues";

export default function MyLeaguesScreen() {
  return (
    <View flex={1} items="center" bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} pt="$10">
        <MyLeagues />
      </ScrollView>
    </View>
  );
}
