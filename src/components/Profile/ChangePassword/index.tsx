import { YStack, Text, Button, Input } from "tamagui";
import { useUser } from "src/hooks/useUser";

export function ChangePassword() {
  const user = useUser();

  if (!user) {
    return <Text>Loading...</Text>;
  }
  return (
    <YStack gap="$8" mb="$4" style={{ alignItems: "center" }}>
      <YStack gap="$6" style={{ alignItems: "flex-start" }}>
        <Text fontSize="$8" fontWeight="bold">
          Change Your Password
        </Text>
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="bold">
            Enter Your Current Password
          </Text>
          <Input width="$20" placeholder="Enter your current password" />
        </YStack>
        <YStack gap="$4">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              Enter Your New Password
            </Text>
            <Input width="$20" placeholder="Enter your new password" />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              Confirm Your New Password
            </Text>
            <Input width="$20" placeholder="Confirm your new password" />
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
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          color="$blue10"
          fontSize="$5"
          fontWeight="bold"
          width="$20"
        >
          Cancel
        </Button>
      </YStack>
    </YStack>
  );
}
