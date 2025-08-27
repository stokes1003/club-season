import {
  Text,
  YStack,
  XStack,
  View,
  Button,
  Spinner,
  Separator,
} from "tamagui";
import { PlayerAvatar } from "../../UI/PlayerAvatar";

export function ConfirmCreateLeague({
  leagueName,
  players,
  leagueAvatar,
  handleHome,
  isSubmitting,
  handleCreateLeague,
  leagueAvatarColor,
}: {
  leagueName: string;
  players: any[];
  leagueAvatar: string;
  handleHome: () => void;
  isSubmitting: boolean;
  handleCreateLeague: () => void;
  leagueAvatarColor: string;
}) {
  return (
    <YStack gap="$8" style={{ alignItems: "center" }} width="100%">
      <YStack gap="$6" width="100%">
        <YStack style={{ alignItems: "center" }}>
          <Text fontSize="$8" fontWeight="bold">
            Confirm Create League
          </Text>
        </YStack>

        <YStack gap="$2" style={{ alignItems: "center" }}>
          <PlayerAvatar
            name={leagueName}
            avatarUrl={leagueAvatar}
            size="$8"
            color={leagueAvatarColor}
          />

          <Text fontSize="$8" fontWeight="bold">
            {leagueName}
          </Text>
        </YStack>
        <YStack gap="$4" px="$4">
          {players.map((player, index) => (
            <YStack
              key={index}
              width="100%"
              gap="$6"
              style={{ alignSelf: "flex-start" }}
            >
              <XStack gap="$3" width="100%">
                <View
                  width="$1"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text fontSize="$8">{index + 1}.</Text>
                </View>

                <PlayerAvatar
                  name={player.name}
                  avatarUrl={player.image}
                  size="$4"
                  color={player.color}
                />

                <YStack gap="$1" width="100%">
                  <Text fontSize="$6" fontWeight="bold">
                    {player.name}
                  </Text>
                  <Text fontSize="$5">{player.email}</Text>
                </YStack>
              </XStack>
              {index !== players.length - 1 && (
                <Separator width="100%" borderColor="$black10" />
              )}
            </YStack>
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
          width="$12"
          onPress={handleHome}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          bg="$blue10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          width="$14"
          onPress={handleCreateLeague}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner size="small" color="$white1" />
          ) : (
            "Create League"
          )}
        </Button>
      </XStack>
    </YStack>
  );
}
