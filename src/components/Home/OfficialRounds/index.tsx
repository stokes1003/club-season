import { YStack, Text, ScrollView, XStack, Card } from "tamagui";
import { RoundCard } from "../RoundCard";
import { useGetOfficalRounds } from "src/hooks/useGetOfficalRounds";
import { useOfficalRounds } from "src/context/OfficalRoundsContext";
import { League } from "../../../context/SelectedLeagueContext";

export function OfficialRounds({ league }: { league: League }) {
  const leagueId = league.id;
  console.log("OfficialRounds - League ID:", leagueId);
  const { refreshTrigger } = useOfficalRounds();

  const rounds = useGetOfficalRounds(leagueId, refreshTrigger);

  return (
    <YStack gap="$4" width="100%">
      <Text fontWeight="bold" fontSize="$8" style={{ textAlign: "center" }}>
        Official Rounds
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={344}
        decelerationRate="fast"
        snapToAlignment="center"
      >
        {rounds?.length > 0 ? (
          <Card
            backgroundColor="white"
            borderWidth={0}
            borderRadius="$6"
            mx="$4"
            style={{
              boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <XStack>
              {rounds?.map((round) => (
                <RoundCard key={round._id} roundData={round} />
              ))}
            </XStack>
          </Card>
        ) : (
          <Card
            alignItems="center"
            justifyContent="center"
            backgroundColor="white"
            borderWidth={0}
            borderRadius="$6"
            mx="$4"
            style={{
              boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Text>No rounds played yet</Text>
          </Card>
        )}
      </ScrollView>
    </YStack>
  );
}
