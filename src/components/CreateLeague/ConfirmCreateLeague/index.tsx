import { Avatar, Text, YStack, XStack, View, Button } from "tamagui";
import { router } from "expo-router";

export function ConfirmCreateLeague({
  leagueName,
  players,
  leagueAvatar,
  handleHome,
}: {
  leagueName: string;
  players: any[];
  leagueAvatar: string;
  handleHome: () => void;
}) {
  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack gap="$6">
        <YStack style={{ alignItems: "center" }}>
          <Text fontSize="$8" fontWeight="bold">
            Confirm Create League
          </Text>
        </YStack>

        <YStack gap="$2" style={{ alignItems: "center" }}>
          <Avatar size="$6" circular>
            <Avatar.Image src={leagueAvatar} />
            <Avatar.Fallback
              backgroundColor="$blue10"
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text fontSize="$8" style={{ color: "white" }}>
                {leagueName.charAt(0)}
              </Text>
            </Avatar.Fallback>
          </Avatar>
          <Text fontSize="$8" fontWeight="bold">
            {leagueName}
          </Text>
        </YStack>
        <YStack gap="$4" style={{ alignSelf: "flex-start" }}>
          {players.map((player, index) => (
            <XStack gap="$3" key={player.email} width="100%">
              <View
                width="$1"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text fontSize="$7">{index + 1}.</Text>
              </View>

              <Avatar size="$4" circular>
                <Avatar.Image src={player.image} />
                <Avatar.Fallback
                  backgroundColor="$blue10"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    fontSize="$8"
                    style={{
                      color: "white",
                    }}
                  >
                    {player.name.charAt(0)}
                  </Text>
                </Avatar.Fallback>
              </Avatar>
              <YStack gap="$1">
                <Text fontSize="$6" fontWeight="bold">
                  {player.name}
                </Text>
                <Text fontSize="$5">{player.email}</Text>
              </YStack>
            </XStack>
          ))}
        </YStack>
      </YStack>
      <XStack gap="$4">
        <Button
          fontSize="$5"
          variant="outlined"
          borderColor="$blue10"
          color="$blue10"
          fontWeight="bold"
          onPress={handleHome}
        >
          Cancel
        </Button>
        <Button bg="$blue10" color="$white1" fontSize="$5" fontWeight="bold">
          Create League
        </Button>
      </XStack>
    </YStack>
  );
}
