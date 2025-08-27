import { Separator, Text, View, YStack } from "tamagui";
import { useUser } from "src/context/UserContext";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";
import { Pressable } from "react-native";
import { PlayerLeaguesCard } from "./PlayerLeaguesCard";

export function PlayerLeaguesList() {
  const { user } = useUser();
  const leagues = user?.leagues;
  const { setSelectedLeague } = useSelectedLeague();
  return (
    <YStack width="100%" gap="$4" px="$4">
      <View width="100%">
        <Text fontSize="$8" fontWeight="bold">
          Leagues
        </Text>
      </View>
      <YStack gap="$3" width="100%">
        {leagues?.map((league, index) => (
          <YStack key={league.id} gap="$4">
            <Pressable onPress={() => setSelectedLeague(league)}>
              <PlayerLeaguesCard league={league} />
            </Pressable>
            <Separator width="100%" borderColor="$black11" />
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
}
