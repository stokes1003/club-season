import { createContext, useContext, useState, ReactNode } from "react";
import { League } from "../components/MyLeagues/index";
import { Player } from "src/types/player";
import { useRouter } from "expo-router";

type NavigationState =
  | { type: "dashboard" }
  | {
      type: "createLeague";
      step: "league-name" | "add-players" | "confirm-create-league";
      playerIndex?: number;
    }
  | { type: "league"; league: League }
  | { type: "player"; player: Player; league: League }
  | { type: "course"; course: any; league: League }
  | { type: "profile" }
  | { type: "changePassword" }
  | { type: "changeEmail" }
  | { type: "changeName" };

type NavigationContextType = {
  currentMyLeaguesState: NavigationState;
  setCreateLeagueState: (state: {
    step: "league-name" | "add-players" | "confirm-create-league";
    playerIndex?: number;
  }) => void;
  setCurrentProfileState: (
    state: "profile" | "changePassword" | "changeEmail" | "changeName"
  ) => void;
  currentProfileState:
    | "profile"
    | "changePassword"
    | "changeEmail"
    | "changeName";
  navigationHistory: NavigationState[];
  navigateTo: (state: NavigationState) => void;
  navigateBack: () => void;
  navigateToDashboard: () => void;
  navigateToLeague: (league: League) => void;
  navigateToPlayer: (player: Player | null, league?: League) => void;
  navigateToCourse: (course: any, league: League) => void;
  navigateToCreateLeague: (
    step: "league-name" | "add-players" | "confirm-create-league",
    playerIndex?: number
  ) => void;
  createLeagueState: {
    step: "league-name" | "add-players" | "confirm-create-league";
    playerIndex?: number;
  };
  canGoBack: boolean;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [currentMyLeaguesState, setCurrentMyLeaguesState] =
    useState<NavigationState>({
      type: "dashboard",
    });
  const [currentProfileState, setCurrentProfileState] = useState<
    "profile" | "changePassword" | "changeEmail" | "changeName"
  >("profile");
  const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>(
    []
  );
  const [createLeagueState, setCreateLeagueState] = useState<{
    step: "league-name" | "add-players" | "confirm-create-league";
    playerIndex?: number;
  }>({
    step: "league-name",
  });
  const navigateToCreateLeague = (
    step: "league-name" | "add-players" | "confirm-create-league",
    playerIndex?: number
  ) => {
    setCreateLeagueState({ step, playerIndex });
    navigateTo({ type: "createLeague", step, playerIndex });
  };

  const navigateTo = (newState: NavigationState) => {
    setNavigationHistory((prev) => [...prev, currentMyLeaguesState]);
    setCurrentMyLeaguesState(newState);
  };

  const navigateBack = () => {
    if (navigationHistory.length > 0) {
      const previousState = navigationHistory[navigationHistory.length - 1];
      setCurrentMyLeaguesState(previousState);
      setNavigationHistory((prev) => prev.slice(0, -1));
    } else {
      navigateToDashboard();
    }
  };

  const navigateToDashboard = () => navigateTo({ type: "dashboard" });
  const navigateToLeague = (league: League) =>
    navigateTo({ type: "league", league });

  const navigateToPlayer = (player: Player | null, league?: League) => {
    if (player && league) {
      navigateTo({ type: "player", player, league });
    } else {
      navigateToDashboard();
    }
  };

  const navigateToCourse = (course: any, league: League) => {
    navigateTo({ type: "course", course, league });
  };

  const value = {
    createLeagueState,
    setCreateLeagueState,
    navigateToCreateLeague,
    currentMyLeaguesState,
    currentProfileState,
    navigationHistory,
    navigateTo,
    navigateBack,
    setCurrentProfileState,
    navigateToDashboard,
    navigateToLeague,
    navigateToPlayer,
    navigateToCourse,
    canGoBack: navigationHistory.length > 0,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
