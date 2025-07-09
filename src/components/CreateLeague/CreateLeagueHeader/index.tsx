import { View, XStack } from "tamagui";
import { ArrowLeft, X } from "@tamagui/lucide-icons";

export function CreateLeagueHeader({
  currentStep,
  handleHome,
  setCurrentStep,
  currentPlayerIndex,
  setCurrentPlayerIndex,
}: {
  currentStep: string;
  handleHome: () => void;
  setCurrentStep: (step: string) => void;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
}) {
  return (
    <View>
      {currentStep === "league-name" && (
        <View
          style={{
            alignSelf: "flex-end",
          }}
          onPress={handleHome}
        >
          <X />
        </View>
      )}
      {currentStep === "add-players" && (
        <XStack
          width="100%"
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <View
            style={{ alignItems: "center" }}
            onPress={() => {
              if (currentPlayerIndex > 0) {
                setCurrentPlayerIndex(currentPlayerIndex - 1);
              } else {
                setCurrentStep("league-name");
              }
            }}
          >
            <ArrowLeft />
          </View>
          <View style={{ alignItems: "center" }} onPress={handleHome}>
            <X />
          </View>
        </XStack>
      )}
    </View>
  );
}
