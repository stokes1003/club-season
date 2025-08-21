import { YStack } from "tamagui";
import { LeaguesDashboard } from "./LeaguesDashboard/index";
import { LeagueProfile } from "./LeagueProfile";
import { PlayerProfile } from "./PlayerProfile";
import { CourseProfile } from "./CourseProfile";
import { useNavigation } from "../../context/NavigationContext";
import { navigationAnalytics } from "./NavigationAnalytics";
import { NavigationGuards } from "./NavigationGuards";

export type League = {
  id: string;
  name: string;
  image_url: string;
  avatar_color: string | null;
  created_at: string;
  created_by: string;
  isCreator: boolean;
};

function MyLeaguesContent() {
  const {
    currentState,
    navigateToDashboard,
    navigateToLeague,
    navigateToPlayer,
    navigateToCourse,
    navigateBack,
    canGoBack,
  } = useNavigation();
  console.log("currentState", currentState);

  const renderCurrentScreen = () => {
    const fromScreen = currentState.type;

    switch (currentState.type) {
      case "dashboard":
        navigationAnalytics.trackNavigation("previous", "dashboard");
        return <LeaguesDashboard setSelectedLeague={navigateToLeague} />;

      case "league":
        navigationAnalytics.trackNavigation("previous", "league", {
          leagueId: currentState.league.id,
        });
        return (
          <LeagueProfile
            selectedLeague={currentState.league}
            setSelectedLeague={navigateToDashboard}
            setSelectedPlayer={(player) => {
              if (
                NavigationGuards.canNavigateToPlayer(
                  player,
                  currentState.league
                )
              ) {
                navigateToPlayer(player, currentState.league);
              }
            }}
            setSelectedCourse={(course) => {
              if (
                NavigationGuards.canNavigateToCourse(
                  course,
                  currentState.league
                )
              ) {
                navigateToCourse(course, currentState.league);
              }
            }}
          />
        );

      case "player":
        navigationAnalytics.trackNavigation("previous", "player", {
          playerId: currentState.player.player_id,
          leagueId: currentState.league.id,
        });
        return (
          <PlayerProfile
            selectedPlayer={currentState.player}
            setSelectedPlayer={navigateBack}
            selectedLeague={currentState.league}
          />
        );

      case "course":
        navigationAnalytics.trackNavigation("previous", "course", {
          courseId: currentState.course.id,
          leagueId: currentState.league.id,
        });
        return (
          <CourseProfile
            selectedCourse={currentState.course}
            setSelectedCourse={navigateBack}
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

export function MyLeagues() {
  return <MyLeaguesContent />;
}
