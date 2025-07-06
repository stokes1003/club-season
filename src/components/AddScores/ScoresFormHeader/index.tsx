import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { YStack, XStack, View } from "tamagui";

export function ScoresFormHeader({
  currentStep,
  handleHome,
  currentPlayerIndex,
  setCurrentStep,
  setCurrentPlayerIndex,
}: {
  currentStep: string;
  handleHome: () => void;
  currentPlayerIndex: number;
  setCurrentStep: (step: string) => void;
  setCurrentPlayerIndex: (index: number) => void;
}) {
  return (
    <YStack>
      {currentStep === "select-league" && (
        <View
          style={{
            alignSelf: "flex-end",
          }}
          onPress={handleHome}
        >
          <X />
        </View>
      )}
      {currentStep !== "select-league" && (
        <XStack
          width="100%"
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <View
            style={{ alignItems: "center" }}
            onPress={() => {
              if (currentStep === "select-golf-course") {
                setCurrentStep("select-league");
              } else {
                if (currentStep === "enter-player-scores") {
                  if (currentPlayerIndex === 0) {
                    setCurrentStep("select-golf-course");
                  } else setCurrentPlayerIndex(currentPlayerIndex - 1);
                } else {
                  setCurrentStep("enter-player-scores");
                }
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
    </YStack>
  );
}
