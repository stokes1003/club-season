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
    currentMyLeaguesState,
    navigateToDashboard,
    navigateToLeague,
    navigateToPlayer,
    navigateToCourse,
    navigateBack,
  } = useNavigation();

  const renderCurrentScreen = () => {
    switch (currentMyLeaguesState.type) {
      case "dashboard":
        navigationAnalytics.trackNavigation("previous", "dashboard");
        return <LeaguesDashboard setSelectedLeague={navigateToLeague} />;

      case "league":
        navigationAnalytics.trackNavigation("previous", "league", {
          leagueId: currentMyLeaguesState.league.id,
        });
        return (
          <LeagueProfile
            selectedLeague={currentMyLeaguesState.league}
            setSelectedLeague={navigateToDashboard}
            setSelectedPlayer={(player) => {
              if (
                NavigationGuards.canNavigateToPlayer(
                  player,
                  currentMyLeaguesState.league
                )
              ) {
                navigateToPlayer(player, currentMyLeaguesState.league);
              }
            }}
            setSelectedCourse={(course) => {
              if (
                NavigationGuards.canNavigateToCourse(
                  course,
                  currentMyLeaguesState.league
                )
              ) {
                navigateToCourse(course, currentMyLeaguesState.league);
              }
            }}
          />
        );

      case "player":
        navigationAnalytics.trackNavigation("previous", "player", {
          playerId: currentMyLeaguesState.player.player_id,
          leagueId: currentMyLeaguesState.league.id,
        });
        return (
          <PlayerProfile
            selectedPlayer={currentMyLeaguesState.player}
            setSelectedPlayer={navigateBack}
            selectedLeague={currentMyLeaguesState.league}
          />
        );

      case "course":
        navigationAnalytics.trackNavigation("previous", "course", {
          courseId: currentMyLeaguesState.course.id,
          leagueId: currentMyLeaguesState.league.id,
        });
        return (
          <CourseProfile
            selectedCourse={currentMyLeaguesState.course}
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
