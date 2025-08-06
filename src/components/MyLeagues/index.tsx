import { YStack } from "tamagui";
import { LeaguesDashboard } from "./LeaguesDashboard/index";
import { useState } from "react";
import { LeagueDetails } from "./LeagueDetails";

export type League = {
  id: string;
  name: string;
  image_url: string;
  avatar_color: string | null;
  created_at: string;
  created_by: string;
  isCreator: boolean;
};

export function MyLeagues() {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  return (
    <YStack gap="$8" style={{ alignItems: "center" }} width={320}>
      {selectedLeague ? (
        <LeagueDetails selectedLeague={selectedLeague} />
      ) : (
        <LeaguesDashboard setSelectedLeague={setSelectedLeague} />
      )}
    </YStack>
  );
}
