import { ScrollView, Text, View } from "tamagui";
import { AddScores } from "../../src/components/AddScores";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { router, Stack } from "expo-router";
import { useNavigation } from "src/context/NavigationContext";

export default function AddScoresScreen() {
  const { addScoresState, setAddScoresState } = useNavigation();

  if (!addScoresState) {
    console.warn("addScoresState is undefined");
    return <Text>Loading...</Text>; // or return null
  }

  const handleBack = () => {
    if (
      addScoresState.step === "enter-player-scores" &&
      addScoresState.playerIndex &&
      addScoresState.playerIndex > 0
    ) {
      setAddScoresState({
        ...addScoresState,
        playerIndex: addScoresState.playerIndex - 1,
      });
    } else if (
      addScoresState.step === "enter-player-scores" &&
      addScoresState.playerIndex === 0
    ) {
      setAddScoresState({ step: "select-golf-course" });
    } else if (addScoresState.step === "select-golf-course") {
      setAddScoresState({ step: "select-league" });
    }
    if (addScoresState.step === "confirm-round-submit") {
      setAddScoresState({
        step: "enter-player-scores",
        playerIndex: addScoresState.playerIndex || 0,
      });
    }
  };

  const handleHome = () => {
    setAddScoresState({ step: "select-league", playerIndex: 0 });
    router.push("/");
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Scores",
          headerShown: true,
          headerRight: () => (
            <View pr="$2">
              <Pressable
                onPress={handleHome}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{ padding: 4 }}
              >
                <X size={24} />
              </Pressable>
            </View>
          ),
          headerLeft:
            addScoresState.step !== "select-league"
              ? () => (
                  <View pl="$2">
                    <Pressable
                      onPress={handleBack}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={{ padding: 4 }}
                    >
                      <ArrowLeft size={24} />
                    </Pressable>
                  </View>
                )
              : undefined,
        }}
      />
      <View flex={1} items="center" bg="$background">
        <ScrollView
          showsVerticalScrollIndicator={false}
          py="$8"
          px="$8"
          mb="$10"
        >
          <AddScores />
        </ScrollView>
      </View>
    </>
  );
}
