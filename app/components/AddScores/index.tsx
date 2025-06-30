import { YStack, Text, XStack, Button, View } from "tamagui";
import { SelectGolfCourse } from "./SelectGolfCourse";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { EnterPlayerScores } from "./EnterPlayerScores";
import { useState } from "react";
import { ConfirmRoundSubmit } from "./ConfirmRoundSubmit";
import { useRouter } from "expo-router";

export function AddScores() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("select-golf-course");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHome = () => {
    router.push("/");
    setCurrentStep("select-golf-course");
    setCurrentPlayerIndex(0);
  };
  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$8">
        {currentStep === "select-golf-course" && (
          <View
            style={{
              alignSelf: "flex-end",
            }}
            onPress={handleHome}
          >
            <X />
          </View>
        )}
        {currentStep !== "select-golf-course" && (
          <XStack
            width="$20"
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <View
              width="$6"
              style={{ alignItems: "center" }}
              onPress={() => {
                if (currentStep === "enter-player-scores") {
                  if (currentPlayerIndex === 0) {
                    setCurrentStep("select-golf-course");
                  } else setCurrentPlayerIndex((prev) => prev - 1);
                } else {
                  setCurrentStep("enter-player-scores");
                }
              }}
            >
              <ArrowLeft />
            </View>
            <View
              width="$6"
              style={{ alignItems: "center" }}
              onPress={handleHome}
            >
              <X />
            </View>
          </XStack>
        )}
        {currentStep === "select-golf-course" && (
          <SelectGolfCourse setCurrentStep={setCurrentStep} />
        )}
        {currentStep === "enter-player-scores" && (
          <EnterPlayerScores
            setCurrentStep={setCurrentStep}
            currentPlayerIndex={currentPlayerIndex}
            setCurrentPlayerIndex={setCurrentPlayerIndex}
          />
        )}
        {currentStep === "confirm-round-submit" && (
          <ConfirmRoundSubmit
            setCurrentStep={setCurrentStep}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setCurrentPlayerIndex={setCurrentPlayerIndex}
            handleHome={handleHome}
          />
        )}
      </YStack>
    </YStack>
  );
}
