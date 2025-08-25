import { useState } from "react";
import { Keyboard } from "react-native";
import { Button, Input, Text, XStack, YStack } from "tamagui";
import { PlayerAvatar } from "../../UI/PlayerAvatar";

type AddScoresData = {
  players: {
    id: string;
    display_name: string;
    avatar_url: string;
    player_color: string;
  }[];
};

export function EnterPlayerScores({
  setCurrentStep,
  currentPlayerIndex,
  setCurrentPlayerIndex,
  addScoresData,
  setScoresByPlayer,
  scoresByPlayer,
  isMajor,
}: {
  setCurrentStep: (step: string) => void;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  addScoresData: AddScoresData;
  setScoresByPlayer: (scores: {
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
      display_name: string;
      player_color: string;
    };
  }) => void;
  scoresByPlayer: {
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
      display_name: string;
      player_color: string;
    };
  };
  isMajor: string;
}) {
  const [handicapInput, setHandicapInput] = useState("");
  const [grossInput, setGrossInput] = useState("");

  const handleSubmitScores = () => {
    // Safety check to ensure currentPlayer exists and has an id
    if (!currentPlayer || !currentPlayer.id) {
      console.error(
        "Current player is undefined or missing id:",
        currentPlayer
      );
      return;
    }

    // Clean up any existing "undefined" entries
    const cleanScoresByPlayer = { ...scoresByPlayer };
    delete cleanScoresByPlayer["undefined"];

    if (currentPlayerIndex === addScoresData.players.length - 1) {
      setCurrentStep("confirm-round-submit");
      setCurrentPlayerIndex(0);
    } else {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setHandicapInput("");
      setGrossInput("");
    }
    setScoresByPlayer({
      ...cleanScoresByPlayer,
      [currentPlayer.id]: {
        hcp: Number(handicapInput),
        gross: Number(grossInput),
        avatar_url: playerAvatarUrl,
        display_name: playerName,
        player_color: playerAvatarColor,
      },
    });
  };

  // Safety check for current player data
  const currentPlayer = addScoresData.players[currentPlayerIndex];
  const playerName = currentPlayer?.display_name || "Unknown Player";
  const playerAvatarUrl = currentPlayer?.avatar_url || "";
  const playerAvatarColor = currentPlayer?.player_color || "";

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack>
        <Text fontWeight="bold" fontSize="$8">
          Enter Player Scores
        </Text>
      </YStack>

      <YStack gap="$4" style={{ alignItems: "center" }}>
        <XStack gap="$3" style={{ alignItems: "center" }}>
          <PlayerAvatar
            name={playerName}
            avatarUrl={playerAvatarUrl}
            size="$4"
            color={playerAvatarColor}
          />
          <Text fontSize="$6" fontWeight="bold">
            {playerName}
          </Text>
        </XStack>

        <YStack gap="$4">
          <Input
            placeholder={`${playerName}'s HCP`}
            width="$20"
            value={handicapInput}
            onChangeText={setHandicapInput}
            fontSize="$5"
            keyboardType="numeric"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            autoFocus={false}
            onBlur={() => {
              Keyboard.dismiss();
            }}
          />
          <Input
            placeholder={`${playerName}'s Gross`}
            width="$20"
            value={grossInput}
            onChangeText={setGrossInput}
            fontSize="$5"
            keyboardType="numeric"
            onBlur={() => {
              Keyboard.dismiss();
            }}
          />
        </YStack>
      </YStack>

      <Button
        bg={isMajor === "yes" ? "$green10" : "$blue10"}
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$20"
        onPress={handleSubmitScores}
      >
        {currentPlayerIndex === addScoresData.players.length - 1
          ? "Submit Scores"
          : "Next Player"}
      </Button>
    </YStack>
  );
}
