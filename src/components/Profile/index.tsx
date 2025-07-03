import { Text, YStack } from "tamagui";

export function Profile() {
  return (
    <YStack gap="$4">
      <Text>Avatar</Text>
      <Text>Name</Text>
      <Text>Email</Text>
      <Text>Password</Text>
    </YStack>
  );
}
