import { useState } from "react";
import { Alert } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "src/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import {
  Button,
  Input,
  Label,
  Separator,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { getEmailValidationMessage } from "src/utils/validation";

type SignInProps = {
  onToggleMode: () => void;
};

export function SignIn({ onToggleMode }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = () => {
    const error = getEmailValidationMessage(email);
    setEmailError(error);
    return !error;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    if (!validateEmail()) {
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert("Sign In Error", error.message);
    setLoading(false);
  }

  async function signInWithGoogle() {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "club-season://auth/callback",
        },
      });

      if (error) {
        console.error("Google sign in error:", error);
        Alert.alert("Sign In Error", "Failed to sign in with Google");
      } else {
        console.log("OAuth initiated:", data);
        // Open the OAuth URL in a web browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          "club-season://auth/callback"
        );

        if (result.type === "success") {
          // Handle successful authentication
          console.log("OAuth successful:", result.url);
        } else {
          console.log("OAuth cancelled or failed:", result.type);
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      Alert.alert("Sign In Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(null);
    }
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }} width="$20">
        <Text fontSize="$8" fontWeight="bold">
          Welcome to Club Season
        </Text>
        <Text fontSize="$4" color="$black10" style={{ textAlign: "center" }}>
          You've got rounds to track, leagues to manage, and a season to compete
          in.
        </Text>
      </YStack>
      <YStack gap="$4" style={{ alignItems: "center" }}>
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
        <View>
          <XStack
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <View>
              <Label fontSize="$5">Password</Label>
            </View>
            <View onPress={() => onToggleMode()}>
              <Text fontSize="$4" color="$blue10">
                Forgot Password?
              </Text>
            </View>
          </XStack>

          <Input
            onChangeText={handlePasswordChange}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
            width="$20"
            borderColor={passwordError ? "#ff4444" : undefined}
          />
          {passwordError && (
            <Text fontSize="$3" color="#ff4444" style={{ marginTop: 4 }}>
              {passwordError}
            </Text>
          )}
        </View>
      </YStack>
      <YStack gap="$6" style={{ alignItems: "center" }}>
        <View>
          <Button
            disabled={loading}
            onPress={() => signInWithEmail()}
            bg="$blue10"
            color="$white1"
            fontSize="$5"
            fontWeight="bold"
            width="$20"
          >
            Sign In
          </Button>
        </View>
        <XStack style={{ alignItems: "center" }} gap="$2" mx="$10">
          <Separator borderColor="$black10" />
          <Text>Or</Text>
          <Separator borderColor="$black10" />
        </XStack>
        <View>
          <Button
            onPress={() => signInWithGoogle()}
            fontSize="$5"
            fontWeight="bold"
            color="$blue10"
            width="$20"
          >
            Sign In with Google
          </Button>
        </View>
      </YStack>

      <XStack gap="$2">
        <Text fontSize="$5" color="$black10">
          Don't have an account?
        </Text>
        <View onPress={() => onToggleMode()}>
          <Text fontSize="$5" color="$blue10">
            Sign Up
          </Text>
        </View>
      </XStack>
    </YStack>
  );
}
