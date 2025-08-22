import { View } from "tamagui";
import { Stack } from "expo-router";
import { CreateLeague } from "src/components/CreateLeague";
import { Pressable } from "react-native";
import { useNavigation } from "src/context/NavigationContext";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { router } from "expo-router";

export default function CreateLeagueScreen() {
  const { createLeagueState, setCreateLeagueState } = useNavigation();

  const handleBack = () => {
    console.log("handleBack called, current step:", createLeagueState.step);
    if (createLeagueState.step === "confirm-create-league") {
      setCreateLeagueState({
        step: "add-players",
        playerIndex: createLeagueState.playerIndex,
      });
    } else if (
      createLeagueState.step === "add-players" &&
      createLeagueState.playerIndex &&
      createLeagueState.playerIndex > 0
    ) {
      setCreateLeagueState({
        ...createLeagueState,
        playerIndex: createLeagueState.playerIndex - 1,
      });
    } else if (createLeagueState.step === "add-players") {
      setCreateLeagueState({
        step: "league-name",
      });
    } else {
      router.push("/(tabs)/My Leagues");
    }
  };
  console.log("createLeagueState", createLeagueState);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create League",
          headerShown: true,
          headerRight: () => (
            <View pr="$2">
              <Pressable onPress={() => router.push("/(tabs)/My Leagues")}>
                <X size={22} />
              </Pressable>
            </View>
          ),
          headerLeft: () => (
            <View pl="$2">
              <Pressable
                onPress={() => {
                  console.log("Pressable pressed");
                  handleBack();
                }}
              >
                <ArrowLeft size={22} />
              </Pressable>
            </View>
          ),
        }}
      />
      <View flex={1} items="center" bg="$background" px="$8">
        <CreateLeague />
      </View>
    </>
  );
}
