import { YStack, Text, ScrollView, XStack } from "tamagui";
import { RoundCard } from "../RoundCard";
import { useEffect, useState } from "react";
import { getLeagueRounds } from "../../api/getLeagueRounds";

type Score = {
  player: string;
  player_img: string;
  gross: number;
  hcp: number;
  net: number;
};

type Round = {
  _id: string;
  course: string;
  course_img: string;
  date: string;
  isMajor?: boolean;
  majorName?: string;
  scores: Score[];
};

export function OfficialRounds() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const leagueId = "7d1b13c1-56cd-4dbf-80e5-f4362c4879de";

  useEffect(() => {
    const fetchRounds = async () => {
      const data = await getLeagueRounds(leagueId);
      setRounds(data || []);
    };
    fetchRounds();
  }, []);

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
        <XStack gap="$3">
          {rounds?.map((round) => (
            <RoundCard key={round._id} roundData={round} />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
