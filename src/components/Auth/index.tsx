import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { YStack } from "tamagui";
import { useUser } from "src/hooks/useUser";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ForgotPassword } from "./ForgotPassword";

export default function Auth() {
  const router = useRouter();
  const user = useUser();
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
        <SignIn mode={mode} setMode={setMode} />
      ) : mode === "signUp" ? (
        <SignUp mode={mode} setMode={setMode} />
      ) : (
        <ForgotPassword mode={mode} setMode={setMode} />
      )}
    </YStack>
  );
}
