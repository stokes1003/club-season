import {
  View,
  Text,
  YStack,
  Button,
  Input,
  Label,
  XStack,
  Avatar,
} from "tamagui";
import { Image } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { uploadImage } from "src/api/uploadImage";
import { v4 as uuidv4 } from "uuid";
import { useRandomColor } from "app/hooks/useRandomColor";

export function EnterLeagueName({
  leagueName,
  setLeagueName,
  numberOfPlayers,
  setNumberOfPlayers,
  setLeagueAvatar,
  leagueAvatar,
  onNextStep,
}: {
  leagueName: string;
  setLeagueName: (text: string) => void;
  numberOfPlayers: string;
  setNumberOfPlayers: (text: string) => void;
  setLeagueAvatar: (text: string) => void;
  leagueAvatar: string;
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
              <Avatar size="$6" circular>
                <Avatar.Image
                  src={leagueAvatar}
                  onError={(error) => {
                    console.log("Avatar image failed to load:", error);
                  }}
                />

                <Avatar.Fallback
                  backgroundColor={useRandomColor() as any}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text fontSize="$8" style={{ color: "white" }}>
                    {leagueName.charAt(0)}
                  </Text>
                </Avatar.Fallback>
              </Avatar>
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
