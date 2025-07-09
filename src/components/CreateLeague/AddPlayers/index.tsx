import { View, Text, YStack, Button, Input, Label } from "tamagui";
import { Image } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export function AddPlayers({
  players,
  setPlayers,
  numberOfPlayers,
  currentPlayerIndex,
  setCurrentPlayerIndex,
  setCurrentStep,
}: {
  players: Array<{ name: string; image: string; email: string }>;
  setPlayers: (
    players: Array<{ name: string; image: string; email: string }>
  ) => void;
  numberOfPlayers: string;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  setCurrentStep: (step: string) => void;
}) {
  // Safety check to ensure players array exists and has the correct length
  if (!players || players.length === 0) {
    return (
      <View gap="$8">
        <Text fontSize="$6" style={{ textAlign: "center" }}>
          Loading players...
        </Text>
      </View>
    );
  }
  const pickImage = async () => {
    // Request permissions first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        image: result.assets[0].uri,
      };
      setPlayers(updatedPlayers);
    }
  };

  const handleSubmit = () => {
    if (players[currentPlayerIndex].name === "") {
      Alert.alert("Please enter a player name");
      return;
    }
    if (players[currentPlayerIndex].email === "") {
      Alert.alert("Please enter a player email");
      return;
    }
    if (currentPlayerIndex === Number(numberOfPlayers) - 1) {
      setCurrentPlayerIndex(0);
      setCurrentStep("confirm-create-league");
    } else {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    }
  };

  return (
    <View gap="$8">
      <YStack gap="$4">
        <YStack>
          <Text fontSize="$8" fontWeight="bold" style={{ textAlign: "center" }}>
            Add Player {currentPlayerIndex + 1}
          </Text>
        </YStack>
        <YStack gap="$4">
          <YStack gap="$1">
            <Label fontSize="$4" fontWeight="bold">
              Player Name
            </Label>
            <Input
              value={players[currentPlayerIndex].name}
              onChangeText={(text) => {
                const updatedPlayers = [...players];
                updatedPlayers[currentPlayerIndex] = {
                  ...updatedPlayers[currentPlayerIndex],
                  name: text,
                };
                setPlayers(updatedPlayers);
              }}
              placeholder={`Golfer ${currentPlayerIndex + 1}`}
            />
          </YStack>
          <YStack gap="$1">
            <Label fontSize="$4" fontWeight="bold">
              Player Image
            </Label>
            <Button
              onPress={pickImage}
              fontSize="$5"
              variant="outlined"
              borderColor="$blue10"
              color="$blue10"
              fontWeight="bold"
            >
              <Image size="$1" color="$blue10" /> Upload Photo
            </Button>
          </YStack>
          <YStack gap="$1">
            <Label fontSize="$4" fontWeight="bold">
              Player Email
            </Label>
            <Input
              value={players[currentPlayerIndex].email}
              onChangeText={(text) => {
                const updatedPlayers = [...players];
                updatedPlayers[currentPlayerIndex] = {
                  ...updatedPlayers[currentPlayerIndex],
                  email: text,
                };
                setPlayers(updatedPlayers);
              }}
              placeholder={`golfer${currentPlayerIndex + 1}@example.com`}
            />
          </YStack>
        </YStack>
      </YStack>
      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="100%"
        onPress={handleSubmit}
      >
        {currentPlayerIndex === Number(numberOfPlayers) - 1
          ? "Submit Players"
          : "Next Player"}
      </Button>
    </View>
  );
}
