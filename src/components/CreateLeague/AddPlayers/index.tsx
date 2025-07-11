import {
  View,
  Text,
  YStack,
  Button,
  Input,
  Label,
  Avatar,
  XStack,
} from "tamagui";
import { Image } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { uploadImage } from "src/api/uploadImage";
import { v4 as uuidv4 } from "uuid";
import { useRandomColor } from "app/hooks/useRandomColor";

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
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;

      // Set local URI for immediate display
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        image: localUri,
      };
      setPlayers(updatedPlayers);

      // Upload to blob storage in background (don't switch URLs immediately)
      try {
        const path = `players/${uuidv4()}.jpg`;
        const uploadedUrl = await uploadImage(localUri, path);

        if (uploadedUrl) {
          console.log("Player image uploaded successfully:", uploadedUrl);
          // Store the uploaded URL separately or in a ref for later use
          // For now, keep the local URI visible
        } else {
          console.log("Upload failed, keeping local URI");
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
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
            <XStack
              gap="$6"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <View style={{ alignItems: "center" }}>
                <Avatar size="$6" circular>
                  <Avatar.Image src={players[currentPlayerIndex].image} />
                  <Avatar.Fallback
                    backgroundColor={useRandomColor() as any}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text fontSize="$8" style={{ color: "white" }}>
                      {players[currentPlayerIndex].name.charAt(0)}
                    </Text>
                  </Avatar.Fallback>
                </Avatar>
              </View>
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
            </XStack>
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
