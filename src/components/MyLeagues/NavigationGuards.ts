import { League } from "./index";
import { Player } from "src/types/player";

type NavigationState =
  | { type: "dashboard" }
  | { type: "league"; league: League }
  | { type: "player"; player: Player; league: League }
  | { type: "course"; course: any; league: League };

export class NavigationGuards {
  static canNavigateToPlayer(player: Player | null, league?: League): boolean {
    if (!player || !league) {
      console.warn("Navigation blocked: Missing player or league data");
      return false;
    }

    if (!player.player_id || !league.id) {
      console.warn("Navigation blocked: Invalid player or league data");
      return false;
    }

    return true;
  }

  static canNavigateToCourse(course: any, league?: League): boolean {
    if (!course || !league) {
      console.warn("Navigation blocked: Missing course or league data");
      return false;
    }

    if (!course.id || !league.id) {
      console.warn("Navigation blocked: Invalid course or league data");
      return false;
    }

    return true;
  }

  static canNavigateToLeague(league?: League): boolean {
    if (!league) {
      console.warn("Navigation blocked: Missing league data");
      return false;
    }

    if (!league.id) {
      console.warn("Navigation blocked: Invalid league data");
      return false;
    }

    return true;
  }

  static validateNavigationState(state: NavigationState): boolean {
    switch (state.type) {
      case "dashboard":
        return true;

      case "league":
        return this.canNavigateToLeague(state.league);

      case "player":
        return this.canNavigateToPlayer(state.player, state.league);

      case "course":
        return this.canNavigateToCourse(state.course, state.league);

      default:
        console.warn("Navigation blocked: Invalid navigation state type");
        return false;
    }
  }
}
