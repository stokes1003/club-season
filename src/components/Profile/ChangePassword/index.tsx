import { useState } from "react";
import { supabase } from "src/lib/supabase";
import { YStack, Text, Button, Input, Spinner } from "tamagui";
import { Alert } from "react-native";
import { User } from "src/types/user";
import { ArrowLeft } from "@tamagui/lucide-icons";

export function ChangePassword({
  setMode,
  user,
}: {
  setMode: (mode: "name" | "email" | "password" | "profile") => void;
  user: User;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword() {
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
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
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update password");
    } finally {
      setLoading(false);
      setMode("profile");
    }
  }

  return (
    <YStack gap="$8" mb="$4" style={{ alignItems: "center" }}>
      <YStack
        onPress={() => setMode("profile")}
        style={{ alignSelf: "flex-start" }}
      >
        <ArrowLeft />
      </YStack>
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
              onChangeText={setNewPassword}
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              Confirm Your New Password
            </Text>
            <Input
              width="$20"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
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
        >
          {loading ? <Spinner size="small" color="$white1" /> : "Submit"}
        </Button>
        <Button
          variant="outlined"
          color="$blue10"
          fontSize="$5"
          fontWeight="bold"
          width="$20"
          onPress={() => setMode("profile")}
        >
          Cancel
        </Button>
      </YStack>
    </YStack>
  );
}
