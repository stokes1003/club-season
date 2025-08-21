import { useState } from "react";
import { supabase } from "src/lib/supabase";
import { YStack, Text, Button, Input, Spinner, View, XStack } from "tamagui";
import { Alert } from "react-native";
import { User } from "src/types/user";
import {
  validatePassword,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  type PasswordValidation,
} from "src/utils/validation";
import { useNavigation } from "src/context/NavigationContext";

export function ChangePassword({ user }: { user: User }) {
  const { setCurrentProfileState } = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      isValid: false,
      errors: [],
      strength: "weak",
    });
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

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
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  async function handleChangePassword() {
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!validatePasswordField(newPassword)) {
      Alert.alert("Error", "Please fix password requirements");
      setLoading(false);
      return;
    }

    if (!validateConfirmPassword()) {
      setLoading(false);
      return;
    }

    try {
      if (!user.email) {
        Alert.alert("Error", "User email not found");
        setLoading(false);
        return;
      }

      // Verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        Alert.alert("Error", "Current password is incorrect");
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        Alert.alert("Error", updateError.message);
      } else {
        Alert.alert("Success", "Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordValidation({ isValid: false, errors: [], strength: "weak" });
        setConfirmPasswordError(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update password");
    } finally {
      setLoading(false);
      setCurrentProfileState("profile");
    }
  }

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
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
      <YStack gap="$6" style={{ alignItems: "flex-start" }}>
        <Text fontSize="$8" fontWeight="bold">
          Change Your Password
        </Text>
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="bold">
            Enter Your Current Password
          </Text>
          <Input
            width="$20"
            placeholder="Enter your current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoComplete="password"
            autoCorrect={false}
          />
        </YStack>
        <YStack gap="$4">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              Enter Your New Password
            </Text>
            <Input
              width="$20"
              placeholder="Enter your new password"
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              borderColor={
                passwordValidation.errors.length > 0 ? "#ff4444" : undefined
              }
            />
            {newPassword && (
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
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              Confirm Your New Password
            </Text>
            <Input
              width="$20"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              borderColor={confirmPasswordError ? "#ff4444" : undefined}
            />
            {confirmPasswordError && (
              <Text fontSize="$3" color="#ff4444" style={{ marginTop: 4 }}>
                {confirmPasswordError}
              </Text>
            )}
          </YStack>
        </YStack>
      </YStack>

      <YStack gap="$4">
        <Button
          bg="$blue10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width="$20"
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? <Spinner size="small" color="$white1" /> : "Submit"}
        </Button>
        <Button
          variant="outlined"
          color="$blue10"
          fontSize="$5"
          fontWeight="bold"
          width="$20"
          onPress={() => setCurrentProfileState("profile")}
        >
          Cancel
        </Button>
      </YStack>
    </YStack>
  );
}
