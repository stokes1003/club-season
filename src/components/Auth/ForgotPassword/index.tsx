import { Alert } from "react-native";
import { supabase } from "src/lib/supabase";
import { Button, Input, Label, Text, View, XStack, YStack } from "tamagui";
import { useState } from "react";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { getEmailValidationMessage } from "src/utils/validation";

interface ForgotPasswordProps {
  mode: "signIn" | "signUp" | "forgotPassword";
  setMode: (mode: "signIn" | "signUp" | "forgotPassword") => void;
}

export function ForgotPassword({ mode, setMode }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = () => {
    const error = getEmailValidationMessage(email);
    setEmailError(error);
    return !error;
  };

  async function resetPassword() {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "club-season://reset-password",
    });

    if (error) {
      Alert.alert("Reset Error", error.message);
    } else {
      Alert.alert(
        "Check your email",
        "We've sent you a password reset link. Please check your inbox and spam folder."
      );
    }
    setLoading(false);
  }

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(null);
    }
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }} width="$20">
        <Text fontSize="$8" fontWeight="bold">
          Reset Password
        </Text>
        <Text style={{ textAlign: "center" }}>
          Enter your email address to receive a password reset link.
        </Text>
      </YStack>
      <YStack gap="$2" style={{ alignItems: "center" }}>
        <View>
          <Label fontSize="$5">Email</Label>
          <Input
            onChangeText={handleEmailChange}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
            width="$20"
            borderColor={emailError ? "#ff4444" : undefined}
          />
          {emailError && (
            <Text fontSize="$3" color="#ff4444" style={{ marginTop: 4 }}>
              {emailError}
            </Text>
          )}
        </View>
      </YStack>
      <YStack gap="$6" style={{ alignItems: "center" }}>
        <View>
          <Button
            disabled={loading}
            onPress={() => {
              resetPassword();
            }}
            bg="$blue10"
            color="$white1"
            fontSize="$5"
            fontWeight="bold"
            width="$20"
          >
            Send Email
          </Button>
        </View>

        <View onPress={() => setMode("signIn")}>
          <XStack gap="$2" style={{ alignItems: "center" }}>
            <ArrowLeft size={16} color="#007AFF" />
            <Text color="$blue10" fontSize="$5">
              Back to Sign In
            </Text>
          </XStack>
        </View>
      </YStack>
    </YStack>
  );
}
