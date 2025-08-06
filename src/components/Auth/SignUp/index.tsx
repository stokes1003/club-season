import { useState } from "react";
import { supabase } from "src/lib/supabase";
import { Alert } from "react-native";
import {
  YStack,
  Text,
  View,
  Label,
  Input,
  Button,
  XStack,
  Spinner,
} from "tamagui";
import {
  getEmailValidationMessage,
  validatePassword,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  type PasswordValidation,
} from "src/utils/validation";

type SignUpProps = {
  onToggleMode: () => void;
};

export function SignUp({ onToggleMode }: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      isValid: false,
      errors: [],
      strength: "weak",
    });
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const validateEmail = () => {
    const error = getEmailValidationMessage(email);
    setEmailError(error);
    return !error;
  };

  const validatePasswordField = (password: string) => {
    const validation = validatePassword(password);
    setPasswordValidation(validation);
    return validation.isValid;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  async function signUpWithEmail() {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail()) {
      return;
    }

    if (!validatePasswordField(password)) {
      Alert.alert("Error", "Please fix password requirements");
      return;
    }

    if (!validateConfirmPassword()) {
      return;
    }

    setLoading(true);
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      Alert.alert("Signup Error", error.message);
    } else if (user && !session) {
      Alert.alert(
        "Check your email",
        "We've sent you a verification email. Please check your inbox and spam folder."
      );
      onToggleMode();
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else if (session) {
      Alert.alert("Success", "You're signed up and logged in!");
    }
    setLoading(false);
  }

  function handleSignUp() {
    signUpWithEmail();
  }

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePasswordField(text);

    // Clear confirm password error if passwords now match
    if (confirmPassword && text === confirmPassword) {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      setConfirmPasswordError(null);
    }
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$4" style={{ alignItems: "center" }} width="$20">
        <Text fontSize="$8" fontWeight="bold">
          Welcome to Club Season
        </Text>
        <Text fontSize="$4" color="$black10" style={{ textAlign: "center" }}>
          Create an account to track rounds, manage your league, and compete all
          season long.
        </Text>
      </YStack>
      <YStack gap="$2" style={{ alignItems: "center" }}>
        <View>
          <Label fontSize="$5">Name</Label>
          <Input
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Enter Name"
            width="$20"
          />
        </View>
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
          <Label fontSize="$5">Password</Label>
          <Input
            onChangeText={handlePasswordChange}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
            width="$20"
            borderColor={
              passwordValidation.errors.length > 0 ? "#ff4444" : undefined
            }
          />
          {password && (
            <YStack gap="$1" style={{ marginTop: 4 }}>
              <XStack gap="$2" style={{ alignItems: "center" }}>
                <Text
                  fontSize="$3"
                  style={{
                    color: getPasswordStrengthColor(
                      passwordValidation.strength
                    ),
                  }}
                >
                  {getPasswordStrengthText(passwordValidation.strength)}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 4,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 2,
                  }}
                >
                  <View
                    style={{
                      width: `${passwordValidation.strength === "weak" ? 33 : passwordValidation.strength === "medium" ? 66 : 100}%`,
                      height: "100%",
                      backgroundColor: getPasswordStrengthColor(
                        passwordValidation.strength
                      ),
                      borderRadius: 2,
                    }}
                  />
                </View>
              </XStack>
              {passwordValidation.errors.length > 0 && (
                <YStack gap="$1">
                  {passwordValidation.errors.map((error, index) => (
                    <Text key={index} fontSize="$3" color="#ff4444">
                      • {error}
                    </Text>
                  ))}
                </YStack>
              )}
            </YStack>
          )}
        </View>
        <View>
          <Label fontSize="$5">Confirm Password</Label>
          <Input
            onChangeText={handleConfirmPasswordChange}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
            autoCapitalize={"none"}
            width="$20"
            borderColor={confirmPasswordError ? "#ff4444" : undefined}
          />
          {confirmPasswordError && (
            <Text fontSize="$3" color="#ff4444" style={{ marginTop: 4 }}>
              {confirmPasswordError}
            </Text>
          )}
        </View>
      </YStack>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <View>
          {loading ? (
            <Spinner size="small" color="$white1" />
          ) : (
            <Button
              disabled={loading}
              onPress={() => handleSignUp()}
              fontSize="$5"
              fontWeight="bold"
              bg="$blue10"
              color="$white1"
              width="$20"
            >
              Sign Up
            </Button>
          )}
        </View>
      </YStack>
      <XStack gap="$2" style={{ alignItems: "center" }}>
        <View>
          <Text>Already have an account?</Text>
        </View>
        <View onPress={onToggleMode}>
          <Text fontSize="$5" color="$blue10">
            Sign In
          </Text>
        </View>
      </XStack>
    </YStack>
  );
}
