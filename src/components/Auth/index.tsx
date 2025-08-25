import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { YStack } from "tamagui";
import { useUser } from "src/context/UserContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ForgotPassword } from "./ForgotPassword";
import { Keyboard, Pressable } from "react-native";

export default function Auth() {
  const router = useRouter();
  const { user } = useUser();
  const [mode, setMode] = useState<"signIn" | "signUp" | "forgotPassword">(
    "signIn"
  );

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <YStack gap="$8" mt="$15" style={{ alignItems: "center" }} bg="$background">
      {mode === "signIn" ? (
        <Pressable onPress={() => Keyboard.dismiss()}>
          <SignIn setMode={setMode} />
        </Pressable>
      ) : mode === "signUp" ? (
        <Pressable onPress={() => Keyboard.dismiss()}>
          <SignUp setMode={setMode} />
        </Pressable>
      ) : (
        <Pressable onPress={() => Keyboard.dismiss()}>
          <ForgotPassword setMode={setMode} />
        </Pressable>
      )}
    </YStack>
  );
}
