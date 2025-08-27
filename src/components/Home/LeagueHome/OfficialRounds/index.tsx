import { YStack, Text, ScrollView, XStack, Card } from "tamagui";
import { LeagueRoundCard } from "../../LeagueRoundCard";
import { useGetOfficalRounds } from "src/hooks/useGetOfficalRounds";
import { useOfficalRounds } from "src/context/OfficalRoundsContext";
import { League } from "../../../../context/SelectedLeagueContext";

export function OfficialRounds({ league }: { league: League }) {
  const { refreshTrigger } = useOfficalRounds();

  const leagueRounds = useGetOfficalRounds(league?.id || "", refreshTrigger);

  return (
    <YStack gap="$4" width="100%" style={{ alignItems: "center" }} mb="$8">
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
        {leagueRounds && leagueRounds.length > 0 ? (
          <XStack>
            {leagueRounds.map((round) => (
              <LeagueRoundCard key={round._id} roundData={round} />
            ))}
          </XStack>
        ) : (
          <Text>No rounds played</Text>
        )}
      </ScrollView>
    </YStack>
  );
}
