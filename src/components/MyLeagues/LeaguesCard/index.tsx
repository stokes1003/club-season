import { YStack, Text, Card, XStack } from "tamagui";
import { useUser } from "src/hooks/useUser";
import { useGetPlayers } from "src/hooks/useGetPlayers";
import { useGetPlayerById } from "src/hooks/useGetPlayerById";
import { LeagueCardSkeleton } from "../LeagueCardSkeleton/index";
import { PlayerAvatar } from "../../UI/PlayerAvatar";

function LeagueCard({ league }: { league: any }) {
  const players = useGetPlayers(league.id);

  const playerName = useGetPlayerById(league.created_by, league.id);
  return (
    <Card
      key={league.id}
      width={360}
      height={150}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
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
          <PlayerAvatar
            name={league.name}
            avatarUrl={league.image_url}
            size="$8"
            color={league.avatar_color}
          />
        </YStack>
        <YStack gap="$1" style={{ alignItems: "flex-end" }}>
          <Text fontSize="$8" fontWeight="bold">
            {league.name}
          </Text>

          <Text fontSize="$6">{players.length} Members</Text>
          <XStack gap="$2">
            <Text fontSize="$6">Owner:</Text>
            <Text fontSize="$6">{playerName}</Text>
          </XStack>
          <XStack gap="$2">
            <Text fontSize="$6">Created:</Text>
            <Text fontSize="$6">
              {new Date(league.created_at).toLocaleDateString()}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
}

export function LeaguesCard() {
  const user = useUser();
  const leagues = user?.leagues;

  // Show skeletons while loading
  if (!leagues) {
    return (
      <YStack gap="$4">
        <LeagueCardSkeleton />
        <LeagueCardSkeleton />
        <LeagueCardSkeleton />
      </YStack>
    );
  }

  return (
    <YStack gap="$4">
      {leagues?.map((league) => (
        <LeagueCard key={league.id} league={league} />
      ))}
    </YStack>
  );
}
