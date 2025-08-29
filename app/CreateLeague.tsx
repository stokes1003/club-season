import { View, ScrollView } from "tamagui";
import { Stack, router } from "expo-router";
import { CreateLeague } from "src/components/CreateLeague";
import { Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "src/context/NavigationContext";
import { ArrowLeft, X } from "@tamagui/lucide-icons";

export default function CreateLeagueScreen() {
  const { createLeagueState, setCreateLeagueState } = useNavigation();

  const handleBack = () => {
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
                  handleBack();
                }}
              >
                <ArrowLeft size={22} />
              </Pressable>
            </View>
          ),
        }}
      />

      <View flex={1} items="center" bg="$background">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false} px="$4" pb="$8">
            <CreateLeague />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
