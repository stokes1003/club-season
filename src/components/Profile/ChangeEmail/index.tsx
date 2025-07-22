import { YStack, Text, Button, Input } from "tamagui";
import { useUser } from "src/hooks/useUser";

export function ChangeEmail() {
  const user = useUser();

  if (!user) {
    return <Text>Loading...</Text>;
  }
  return (
    <YStack gap="$8" mb="$4" style={{ alignItems: "center" }}>
      <YStack gap="$6" style={{ alignItems: "flex-start" }}>
        <Text fontSize="$8" fontWeight="bold">
          Change Your Email
        </Text>
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="bold">
            Current Email
          </Text>
          <Text fontSize="$5">{user.email}</Text>
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="bold">
            New Email
          </Text>
          <Input width="$20" placeholder="Enter your new email" />
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
