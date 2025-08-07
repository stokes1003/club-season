import { Button, YStack } from "tamagui";
import { Pressable } from "react-native";
import { Text } from "tamagui";
import { Separator } from "tamagui";
import { useRouter } from "expo-router";
import { useUser } from "src/hooks/useUser";
import { LeagueCard } from "./LeagueCard/index";

export function LeaguesDashboard({
  setSelectedLeague,
}: {
  setSelectedLeague: any;
}) {
  const router = useRouter();
  const user = useUser();
  const leagues = user?.leagues;

  if (leagues?.length === 0) {
    return (
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Text>No leagues found</Text>
      </YStack>
    );
  }

  return (
    <>
      <YStack>
        <Text fontSize="$6" fontWeight="bold">
          Manage and customize your leagues.
        </Text>
      </YStack>

      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Separator width={320} borderColor="$black10" />
        {leagues?.map((league) => (
          <Pressable key={league.id} onPress={() => setSelectedLeague(league)}>
            <YStack width="100%" gap="$4" style={{ alignItems: "center" }}>
              <LeagueCard league={league} />
              <Separator width={320} borderColor="$black10" />
            </YStack>
          </Pressable>
        ))}
      </YStack>

      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="100%"
        onPress={() => {
          router.push("/CreateLeague");
        }}
      >
        Create A League
      </Button>
    </>
  );
}
