import { YStack, Text, Card, XStack, Avatar } from "tamagui";
import { useUser } from "app/hooks/useUser";
import { useGetPlayers } from "app/hooks/useGetPlayers";
import { useGetPlayerById } from "app/hooks/useGetPlayerById";

function LeagueCard({ league }: { league: any }) {
  const players = useGetPlayers(league.id);

  const playerName = useGetPlayerById(league.created_by);
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
          <Avatar size="$8" circular>
            <Avatar.Image src={league.image_url} />
            <Avatar.Fallback>
              <Text>{league.name.charAt(0)}</Text>
            </Avatar.Fallback>
          </Avatar>
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
  console.log(user);

  return (
    <YStack>
      {leagues?.map((league) => (
        <LeagueCard key={league.id} league={league} />
      ))}
    </YStack>
  );
}
