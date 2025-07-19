import { View, Text, YStack, Button, Input, Label, XStack } from "tamagui";
import { Image } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { uploadImage } from "src/api/uploadImage";
import { v4 as uuidv4 } from "uuid";
import { PlayerAvatar } from "../../UI/PlayerAvatar";
import { avatarColors } from "src/constants/Colors";

export function EnterLeagueName({
  leagueName,
  setLeagueName,
  numberOfPlayers,
  setNumberOfPlayers,
  setLeagueAvatar,
  leagueAvatar,
  leagueAvatarColor,
  setLeagueAvatarColor,
  onNextStep,
}: {
  leagueName: string;
  setLeagueName: (text: string) => void;
  numberOfPlayers: string;
  setNumberOfPlayers: (text: string) => void;
  setLeagueAvatar: (text: string) => void;
  leagueAvatar: string;
  leagueAvatarColor: string;
  setLeagueAvatarColor: (color: string) => void;
  onNextStep: () => void;
}) {
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
      setLeagueAvatar(localUri); // Set local URI for immediate display

      // Upload to blob storage in background (don't switch URLs immediately)
      try {
        const path = `leagues/${uuidv4()}.jpg`;
        const uploadedUrl = await uploadImage(localUri, path);

        if (uploadedUrl) {
          console.log("Image uploaded successfully:", uploadedUrl);
        } else {
          console.log("Upload failed, keeping local URI");
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const colors = avatarColors;

  const handleLeagueName = async () => {
    if (leagueName === "") {
      Alert.alert("Please enter a league name");
      return;
    }
    if (numberOfPlayers === "") {
      Alert.alert("Please enter a number of players");
      return;
    }
    if (Number(numberOfPlayers) < 2) {
      Alert.alert("Please enter a number of players greater than 2");
      return;
    }
    if (Number(numberOfPlayers) > 8) {
      Alert.alert("Please enter a number of players less than 8");
      return;
    }
    if (leagueAvatarColor === "") {
      Alert.alert("Please select a league avatar color");
      return;
    }
    onNextStep();
  };

  return (
    <View gap="$8">
      <YStack gap="$4">
        <YStack>
          <Text fontSize="$8" fontWeight="bold" style={{ textAlign: "center" }}>
            Create Your League
          </Text>
        </YStack>
        <YStack gap="$1">
          <Label fontSize="$4" fontWeight="bold">
            League Name
          </Label>
          <Input
            placeholder="Enter League Name"
            value={leagueName}
            onChangeText={setLeagueName}
          />
        </YStack>
        <XStack width="100%" style={{ justifyContent: "space-between" }}>
          <Label fontSize="$4" fontWeight="bold">
            Number of Players (including you)
          </Label>
          <Input
            width="$6"
            placeholder="3-8"
            keyboardType="numeric"
            value={numberOfPlayers}
            onChangeText={setNumberOfPlayers}
          />
        </XStack>
        <YStack gap="$4">
          <Label fontSize="$4" fontWeight="bold">
            League Avatar Photo
          </Label>
          <XStack
            gap="$6"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ alignItems: "center" }}>
              <PlayerAvatar
                name={leagueName}
                avatarUrl={leagueAvatar}
                size="$6"
                color={leagueAvatarColor}
              />
            </View>

            <Button
              fontSize="$5"
              variant="outlined"
              borderColor="$blue10"
              color="$blue10"
              fontWeight="bold"
              onPress={pickImage}
            >
              <Image size="$1" color="$blue10" /> Upload Photo
            </Button>
          </XStack>
          <YStack>
            <Label fontSize="$4" fontWeight="bold">
              League Avatar Color
            </Label>
            <XStack
              gap="$2"
              p="$2"
              style={{
                alignItems: "space-between",
                justifyContent: "space-between",
              }}
            >
              {Object.keys(colors).map((color, index) => {
                const colorValue = colors[color as keyof typeof colors];
                const isSelected = leagueAvatarColor === colorValue;
                return (
                  <View
                    key={index}
                    onPress={() =>
                      setLeagueAvatarColor(colors[color as keyof typeof colors])
                    }
                    style={{
                      width: 25,
                      height: 25,
                      backgroundColor: colors[color as keyof typeof colors],
                      borderRadius: "100%",
                      transform: [{ scale: isSelected ? 1.3 : 1 }],
                    }}
                  />
                );
              })}
            </XStack>
          </YStack>
        </YStack>
      </YStack>
      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="100%"
        onPress={handleLeagueName}
      >
        Add Players
      </Button>
    </View>
  );
}
