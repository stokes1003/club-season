import { Text, Button, YStack } from "tamagui";
import { LeaguesCard } from "./LeaguesCard";
import { useRouter } from "expo-router";

export function MyLeagues() {
  const router = useRouter();
  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Text fontSize="$8" fontWeight="bold">
          MY LEAGUES
        </Text>
      </YStack>
      <YStack gap="$4">
        <LeaguesCard />
        <LeaguesCard />
        <LeaguesCard />
      </YStack>

      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$20"
        onPress={() => {
          router.push("/CreateLeague");
        }}
      >
        Create A League
      </Button>
    </YStack>
  );
}
