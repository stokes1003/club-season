import { YStack, Text, Card, XStack, Avatar } from "tamagui";
import { useUser } from "app/hooks/useUser";

export function LeaguesCard() {
  const user = useUser();

  const leagues = user?.leagues;

  return (
    <YStack>
      {leagues?.map((league) => {
        return (
          <Card
            key={league.id}
            width={320}
            height={100}
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
            alignItems="center"
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
            pt="$3"
          >
            <XStack
              gap="$2"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <YStack width="$5" style={{ justifyContent: "center" }}>
                <Avatar size="$6" circular>
                  <Avatar.Image
                    src={require("../../../../assets/images/Hammer.webp")}
                  />
                </Avatar>
              </YStack>
              <YStack gap="$1" width="$13" style={{ alignItems: "center" }}>
                <Text fontSize="$5" fontWeight="bold">
                  {league.name}
                </Text>
                <Text fontSize="$4">4 Players</Text>
                <Text fontSize="$4">Last Round:</Text>
              </YStack>
            </XStack>
          </Card>
        );
      })}
    </YStack>
  );
}
