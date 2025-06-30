import { YStack, ScrollView } from "tamagui";
import { Leaderboard } from "../components/Leaderboard";
import { OfficialRounds } from "../components/OfficialRounds";
import { LeagueName } from "../components/LeagueName";

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
