import { Button, YStack, Text, Separator } from "tamagui";
import { LeagueCard } from "./LeaguesCard";
import { useRouter } from "expo-router";
import { useUser } from "src/hooks/useUser";

export function MyLeagues() {
  const router = useRouter();
  const user = useUser();
  const leagues = user?.leagues;

  if (leagues?.length === 0) {
    return <Text>No leagues found</Text>;
  }

  return (
    <YStack gap="$8" style={{ alignItems: "center" }} width={320}>
      <YStack>
        <Text fontSize="$6" fontWeight="bold">
          Manage and customize your leagues.
        </Text>
      </YStack>

      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Separator width={320} borderColor="$black10" />
        {leagues?.map((league) => (
          <YStack
            key={league.id}
            width="100%"
            gap="$4"
            style={{ alignItems: "center" }}
          >
            <LeagueCard league={league} />
            <Separator width={320} borderColor="$black10" />
          </YStack>
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
    </YStack>
  );
}
