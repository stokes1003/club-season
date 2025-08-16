import { View, Text, YStack, Button, Input, Label, XStack } from "tamagui";
import { Image } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { uploadImage } from "src/api/uploadImage";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "src/context/UserContext";
import { useEffect } from "react";
import { PlayerAvatar } from "../../UI/PlayerAvatar";
import { avatarColors } from "src/constants/Colors";

const colors = avatarColors;

export function AddPlayers({
  players,
  setPlayers,
  numberOfPlayers,
  currentPlayerIndex,
  setCurrentPlayerIndex,
  setCurrentStep,
}: {
  players: Array<{
    name: string;
    image: string;
    email: string;
    color: string;
    role: string;
  }>;
  setPlayers: (
    players: Array<{
      name: string;
      image: string;
      email: string;
      color: string;
      role: string;
    }>
  ) => void;
  numberOfPlayers: string;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  setCurrentStep: (step: string) => void;
}) {
  const { user } = useUser();

  // Initialize first player with user data when component mounts
  useEffect(() => {
    if (user && players.length > 0 && currentPlayerIndex === 0) {
      const updatedPlayers = [...players];
      updatedPlayers[0] = {
        ...updatedPlayers[0],
        name: user.name || "",
        email: user.email || "",
        image: user.avatar_url || "",
        role: "commissioner",
      };
      setPlayers(updatedPlayers);
    }
  }, [user, currentPlayerIndex]);

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getAvailableColors = (currentIndex: number) => {
    // Get all colors that are currently selected by other players
    const selectedColors = players
      .map((player, index) => (index !== currentIndex ? player.color : null))
      .filter((color) => color !== null);

    // Filter out colors that are already selected
    return Object.keys(colors).filter((colorKey) => {
      const colorValue = colors[colorKey as keyof typeof colors];
      return !selectedColors.includes(colorValue);
    });
  };

  const validateName = (name: string, currentIndex: number) => {
    const trimmedName = name.trim();

    // Check if name is empty or only whitespace
    if (!trimmedName) {
      return { isValid: false, message: "Please enter a player name" };
    }

    // Check minimum length (at least 2 characters)
    if (trimmedName.length < 2) {
      return {
        isValid: false,
        message: "Name must be at least 2 characters long",
      };
    }

    // Check maximum length (reasonable limit)
    if (trimmedName.length > 50) {
      return {
        isValid: false,
        message: "Name must be less than 50 characters",
      };
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(trimmedName)) {
      return {
        isValid: false,
        message:
          "Name can only contain letters, spaces, hyphens, and apostrophes",
      };
    }

    // Check for duplicate names (case-insensitive)
    const currentName = trimmedName.toLowerCase();
    for (let i = 0; i < players.length; i++) {
      if (
        i !== currentIndex &&
        players[i].name.trim().toLowerCase() === currentName
      ) {
        return {
          isValid: false,
          message: "This name is already taken by another player",
        };
      }
    }

    return { isValid: true, message: "" };
  };

  const handleSubmit = () => {
    const nameValidation = validateName(
      players[currentPlayerIndex].name,
      currentPlayerIndex
    );
    if (!nameValidation.isValid) {
      Alert.alert("Invalid Name", nameValidation.message);
      return;
    }

    if (players[currentPlayerIndex].email === "") {
      Alert.alert("Please enter a player email");
      return;
    }
    if (!validateEmail(players[currentPlayerIndex].email)) {
      Alert.alert("Please enter a valid email address");
      return;
    }
    if (!players[currentPlayerIndex].color) {
      Alert.alert("Please select a player color");
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
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect={false}
              placeholder={`Golfer ${currentPlayerIndex + 1}`}
              keyboardType="default"
              onChangeText={(text) => {
                const updatedPlayers = [...players];
                updatedPlayers[currentPlayerIndex] = {
                  ...updatedPlayers[currentPlayerIndex],
                  name: text,
                  role: "player",
                };
                setPlayers(updatedPlayers);
              }}
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
                <PlayerAvatar
                  name={players[currentPlayerIndex].name}
                  avatarUrl={players[currentPlayerIndex].image}
                  size="$5"
                  color={players[currentPlayerIndex].color}
                />
              </View>
              <Button
                onPress={pickImage}
                fontSize="$5"
                variant="outlined"
                borderColor="$blue10"
                color="$blue10"
                fontWeight="bold"
              >
                <Image size="$1" color="$blue10" />
                {players[currentPlayerIndex].image
                  ? "Change Photo"
                  : "Upload Photo"}
              </Button>
            </XStack>
          </YStack>
          <YStack>
            <Label fontSize="$4" fontWeight="bold">
              Player Color
            </Label>
            <XStack
              gap="$2"
              p="$2"
              style={{
                alignItems: "space-between",
                justifyContent: "space-between",
              }}
            >
              {getAvailableColors(currentPlayerIndex).map((colorKey, index) => {
                const colorValue = colors[colorKey as keyof typeof colors];
                const isSelected =
                  players[currentPlayerIndex].color === colorValue;
                return (
                  <View
                    key={index}
                    onPress={() => {
                      const updatedPlayers = [...players];
                      updatedPlayers[currentPlayerIndex] = {
                        ...updatedPlayers[currentPlayerIndex],
                        color: colorValue,
                      };
                      setPlayers(updatedPlayers);
                    }}
                    style={{
                      width: 25,
                      height: 25,
                      backgroundColor: colorValue,
                      borderRadius: "100%",
                      transform: [{ scale: isSelected ? 1.3 : 1 }],
                    }}
                  />
                );
              })}
            </XStack>
          </YStack>
          <YStack gap="$1">
            <Label fontSize="$4" fontWeight="bold">
              Player Email
            </Label>

            <Input
              value={players[currentPlayerIndex].email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              autoFocus={false}
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
