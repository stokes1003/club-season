import { YStack, ScrollView } from "tamagui";
import { Leaderboard } from "../../src/components/Home/Leaderboard";
import { OfficialRounds } from "../../src/components/Home/OfficialRounds";
import { LeagueName } from "../../src/components/Home/LeagueName";

export default function TabOneScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack
        flex={1}
        style={{ alignItems: "center" }}
        py="$5"
        bg="$background"
      >
        <YStack
          style={{ alignItems: "center", justifyContent: "center" }}
          gap="$6"
        >
          <LeagueName />
          <Leaderboard />
          <OfficialRounds />
        </YStack>
      </YStack>
    </ScrollView>
  );
}
