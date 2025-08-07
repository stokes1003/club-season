import { YStack } from "tamagui";
import { LeaguesDashboard } from "./LeaguesDashboard/index";
import { useState } from "react";
import { LeagueProfile } from "./LeagueProfile";
import { Player } from "src/types/player";
import { PlayerProfile } from "./PlayerProfile";

export type League = {
  id: string;
  name: string;
  image_url: string;
  avatar_color: string | null;
  created_at: string;
  created_by: string;
  isCreator: boolean;
};

type NavigationState =
  | { type: "dashboard" }
  | { type: "league"; league: League }
  | { type: "player"; player: Player; league: League };

export function MyLeagues() {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    type: "dashboard",
  });

  const navigateToDashboard = () => setNavigationState({ type: "dashboard" });
  const navigateToLeague = (league: League) =>
    setNavigationState({ type: "league", league });
  const navigateToPlayer = (player: Player | null, league?: League) => {
    if (player && league) {
      setNavigationState({ type: "player", player, league });
    } else {
      navigateToDashboard();
    }
  };

  const navigateBackToLeague = () => {
    if (navigationState.type === "player") {
      setNavigationState({ type: "league", league: navigationState.league });
    } else {
      navigateToDashboard();
    }
  };

  const renderCurrentScreen = () => {
    switch (navigationState.type) {
      case "dashboard":
        return <LeaguesDashboard setSelectedLeague={navigateToLeague} />;

      case "league":
        return (
          <LeagueProfile
            selectedLeague={navigationState.league}
            setSelectedLeague={navigateToDashboard}
            setSelectedPlayer={(player) =>
              navigateToPlayer(player, navigationState.league)
            }
          />
        );

      case "player":
        return (
          <PlayerProfile
            selectedPlayer={navigationState.player}
            setSelectedPlayer={navigateBackToLeague}
          />
        );

      default:
        return <LeaguesDashboard setSelectedLeague={navigateToLeague} />;
    }
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }} width={320} mb="$8">
      {renderCurrentScreen()}
    </YStack>
  );
}
