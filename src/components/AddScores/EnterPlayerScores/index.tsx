import { useState } from "react";
import { Button, Input, Text, XStack, YStack } from "tamagui";
import { PlayerAvatar } from "../../UI/PlayerAvatar";
import { useNavigation } from "src/context/NavigationContext";

type AddScoresData = {
  players: {
    id: string;
    display_name: string;
    avatar_url: string;
    player_color: string;
  }[];
};

export function EnterPlayerScores({
  addScoresData,
  setScoresByPlayer,
  scoresByPlayer,
  isMajor,
}: {
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
  const { addScoresState, setAddScoresState } = useNavigation();
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
    const currentPlayerIndex = addScoresState.playerIndex || 0;

    if (currentPlayerIndex === addScoresData.players.length - 1) {
      setAddScoresState({
        step: "confirm-round-submit",
        playerIndex: addScoresState.playerIndex || 0,
      });
    } else {
      setAddScoresState({
        step: "enter-player-scores",
        playerIndex: currentPlayerIndex + 1,
      });
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
  const currentPlayer = addScoresData.players[addScoresState.playerIndex || 0];
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
          />
          <Input
            placeholder={`${playerName}'s Gross`}
            width="$20"
            value={grossInput}
            onChangeText={setGrossInput}
            fontSize="$5"
            keyboardType="numeric"
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
        {addScoresState.playerIndex === addScoresData.players.length - 1
          ? "Submit Scores"
          : "Next Player"}
      </Button>
    </YStack>
  );
}
