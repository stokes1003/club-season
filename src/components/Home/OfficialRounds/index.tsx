import { YStack, Text, ScrollView, XStack, Card } from "tamagui";
import { RoundCard } from "../RoundCard";
import { useGetOfficalRounds } from "src/hooks/useGetOfficalRounds";
import { useOfficalRounds } from "src/context/OfficalRoundsContext";
import { League } from "../../../context/SelectedLeagueContext";

export function OfficialRounds({ league }: { league: League }) {
  const leagueId = league.id;
  const { refreshTrigger } = useOfficalRounds();

  const rounds = useGetOfficalRounds(leagueId, refreshTrigger);

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
        {rounds?.length > 0 ? (
          <XStack>
            {rounds?.map((round) => (
              <RoundCard key={round._id} roundData={round} />
            ))}
          </XStack>
        ) : (
          <Text>No rounds played</Text>
        )}
      </ScrollView>
    </YStack>
  );
}
