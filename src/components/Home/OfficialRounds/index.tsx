import { YStack, Text, ScrollView, XStack } from "tamagui";
import { RoundCard } from "../RoundCard";
import { useUser } from "../../../context/UserContext";
import { useGetOfficalRounds } from "app/hooks/useGetOfficalRounds";
import { useOfficalRounds } from "src/context/OfficalRoundsContext";

export function OfficialRounds() {
  const { user } = useUser();
  const leagueId = user?.leagues?.[0]?.id;
  const { refreshTrigger } = useOfficalRounds();
  const rounds = useGetOfficalRounds(leagueId ?? "", refreshTrigger);

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
        <XStack>
          {rounds?.map((round) => (
            <RoundCard key={round._id} roundData={round} />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
