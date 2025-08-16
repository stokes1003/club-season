import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { YStack } from "tamagui";
import { useUser } from "src/context/UserContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ForgotPassword } from "./ForgotPassword";

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
        <SignIn
          onToggleMode={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
        />
      ) : mode === "signUp" ? (
        <SignUp
          onToggleMode={() => setMode(mode === "signUp" ? "signIn" : "signUp")}
        />
      ) : (
        <ForgotPassword
          onToggleMode={() =>
            setMode(mode === "forgotPassword" ? "signIn" : "forgotPassword")
          }
        />
      )}
    </YStack>
  );
}
