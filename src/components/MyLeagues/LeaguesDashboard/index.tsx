import { Button, YStack } from "tamagui";
import { Pressable } from "react-native";
import { Text } from "tamagui";
import { Separator } from "tamagui";
import { useRouter } from "expo-router";
import { useUser } from "src/context/UserContext";
import { LeagueCard } from "./LeagueCard/index";

export function LeaguesDashboard({
  setSelectedLeague,
}: {
  setSelectedLeague: any;
}) {
  const router = useRouter();
  const { user } = useUser();
  const leagues = user?.leagues;

  return (
    <>
      <YStack width="100%">
        <Text fontSize="$6" fontWeight="bold">
          Manage and customize your leagues
        </Text>
      </YStack>
      {leagues && leagues?.length > 0 && (
        <YStack gap="$4" style={{ alignItems: "center" }} width="100%">
          <Separator width={320} borderColor="$black11" />
          {leagues?.map((league) => (
            <Pressable
              key={league.id}
              onPress={() => setSelectedLeague(league)}
            >
              <YStack width="100%" gap="$4" style={{ alignItems: "center" }}>
                <LeagueCard league={league} />
                <Separator width={320} borderColor="$black11" />
              </YStack>
            </Pressable>
          ))}
        </YStack>
      )}

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
