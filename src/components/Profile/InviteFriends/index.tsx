import { useState } from "react";
import { Button, Input, Spinner, Text, YStack } from "tamagui";
import { sendEmail } from "src/api/sendEmail";
import { useUser } from "src/context/UserContext";
import { Alert } from "react-native";

export function InviteFriends() {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleInvite = async () => {
    setLoading(true);
    try {
      await sendEmail({
        to: email,
        subject: `You've been invited to join Club Season`,
        html: `
          <p>You've been invited to join Club Season by ${user?.name || user?.email}.</p>
          <p>You can view the league and manage your settings by downloading the Club Season app in the app store.</p>
          `,
      });

      setEmail("");
      Alert.alert("Invite sent successfully");
    } catch (error: any) {
      console.error(`Failed to send email to ${email}:`, error);
      Alert.alert("Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack gap="$8" mb="$4" style={{ alignItems: "flex-start" }} width={320}>
      <YStack gap="$4">
        <Text fontSize="$8" fontWeight="bold">
          Invite Friends
        </Text>
        <Text fontSize="$5" fontWeight="400">
          Share Club Season with your friends and family to get them to join
          your leagues.
        </Text>
      </YStack>

      <Input
        placeholder="Enter email address"
        width="100%"
        borderWidth="$1"
        borderColor="$borderColor"
        value={email}
        onChangeText={setEmail}
      />
      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="100%"
        onPress={handleInvite}
      >
        {loading ? <Spinner size="small" color="$white1" /> : "Send Invite"}
      </Button>
    </YStack>
  );
}
