import { View, Text, YStack, Button, Input, Label, XStack } from "tamagui";
import { Image } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export function EnterLeagueName({
  leagueName,
  setLeagueName,
  numberOfPlayers,
  setNumberOfPlayers,
  setLeagueAvatar,
  onNextStep,
}: {
  leagueName: string;
  setLeagueName: (text: string) => void;
  numberOfPlayers: string;
  setNumberOfPlayers: (text: string) => void;
  setLeagueAvatar: (text: string) => void;
  onNextStep: () => void;
}) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });
    if (!result.canceled) {
      setLeagueAvatar(result.assets[0].uri);
    }
  };

  const handleLeagueName = () => {
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
        <YStack gap="$1">
          <Label fontSize="$4" fontWeight="bold">
            League Avatar Photo
          </Label>
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
