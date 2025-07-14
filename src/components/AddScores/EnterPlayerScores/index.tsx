import { useState } from "react";
import { Avatar, Button, Input, Text, XStack, YStack } from "tamagui";

type AddScoresData = {
  players: {
    id: string;
    name: string;
    avatar_url: string;
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
    };
  }) => void;
  scoresByPlayer: {
    [key: string]: {
      hcp: number;
      gross: number;
      avatar_url: string;
    };
  };
  isMajor: string;
}) {
  const [handicapInput, setHandicapInput] = useState("");
  const [grossInput, setGrossInput] = useState("");

  const handleSubmitScores = () => {
    if (currentPlayerIndex === addScoresData.players.length - 1) {
      setCurrentStep("confirm-round-submit");
      setCurrentPlayerIndex(0);
    } else {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setHandicapInput("");
      setGrossInput("");
    }
    setScoresByPlayer({
      ...scoresByPlayer,
      [addScoresData.players[currentPlayerIndex].id]: {
        hcp: Number(handicapInput),
        gross: Number(grossInput),
        avatar_url: addScoresData.players[currentPlayerIndex].avatar_url,
      },
    });
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack>
        <Text fontWeight="bold" fontSize="$8">
          Enter Player Scores
        </Text>
      </YStack>

      <YStack gap="$4" style={{ alignItems: "center" }}>
        <XStack style={{ alignItems: "center" }} gap="$3">
          <Avatar circular size="$4">
            <Avatar.Image
              src={addScoresData.players[currentPlayerIndex].avatar_url}
            />
            <Avatar.Fallback backgroundColor="red" />
          </Avatar>
          <Text fontSize="$5" fontWeight="bold">
            {addScoresData.players[currentPlayerIndex].name}
          </Text>
        </XStack>
        <YStack gap="$4">
          <Input
            placeholder={`${addScoresData.players[currentPlayerIndex].name}'s HCP`}
            width="$18"
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
            placeholder={`${addScoresData.players[currentPlayerIndex].name}'s Gross`}
            width="$18"
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
        width="$18"
        onPress={handleSubmitScores}
      >
        {currentPlayerIndex === addScoresData.players.length - 1
          ? "Submit Scores"
          : "Next Player"}
      </Button>
    </YStack>
  );
}
