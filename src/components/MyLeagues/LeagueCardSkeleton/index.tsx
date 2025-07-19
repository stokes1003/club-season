import { YStack, Card, XStack, Avatar } from "tamagui";

export function LeagueCardSkeleton() {
  return (
    <Card
      width={360}
      height={150}
      scale={0.9}
      alignItems="center"
      justifyContent="center"
      backgroundColor="white"
      borderWidth={2}
      borderColor="$borderColor"
      borderRadius="$6"
      overflow="hidden"
      shadowColor="black"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.15}
      shadowRadius={8}
      elevation={8}
    >
      <XStack
        gap="$6"
        style={{
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <YStack
          width="$5"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Avatar size="$8" circular background="$gray5" />
        </YStack>
        <YStack gap="$1" style={{ alignItems: "flex-end" }}>
          <YStack
            width="$8"
            height="$6"
            background="$gray5"
            style={{ borderRadius: 8 }}
          />
          <YStack
            width="$6"
            height="$4"
            background="$gray5"
            style={{ borderRadius: 8 }}
          />
          <XStack gap="$2">
            <YStack
              width="$4"
              height="$4"
              background="$gray5"
              style={{ borderRadius: 8 }}
            />
            <YStack
              width="$6"
              height="$4"
              background="$gray5"
              style={{ borderRadius: 8 }}
            />
          </XStack>
          <XStack gap="$2">
            <YStack
              width="$4"
              height="$4"
              background="$gray5"
              style={{ borderRadius: 8 }}
            />
            <YStack
              width="$6"
              height="$4"
              background="$gray5"
              style={{ borderRadius: 8 }}
            />
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
}
