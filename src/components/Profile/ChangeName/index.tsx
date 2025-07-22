import { YStack, Text, Button, Input } from "tamagui";
import { useState, useEffect } from "react";
import { useUser } from "src/hooks/useUser";

export function ChangeName() {
  const user = useUser();

  if (!user) {
    return <Text>Loading...</Text>;
  }
  return (
    <YStack gap="$8" mb="$4" style={{ alignItems: "center" }}>
      <YStack gap="$6" style={{ alignItems: "flex-start" }}>
        <Text fontSize="$8" fontWeight="bold">
          Change Your Name
        </Text>
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="bold">
            Current Name
          </Text>
          <Text fontSize="$5">{user.name}</Text>
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="bold">
            New Name
          </Text>
          <Input width="$20" placeholder="Enter your new name" />
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
