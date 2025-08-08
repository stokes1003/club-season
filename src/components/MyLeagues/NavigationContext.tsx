import { createContext, useContext, useState, ReactNode } from "react";
import { League } from "./index";
import { Player } from "src/types/player";

type NavigationState =
  | { type: "dashboard" }
  | { type: "league"; league: League }
  | { type: "player"; player: Player; league: League }
  | { type: "course"; course: any; league: League };

type NavigationContextType = {
  currentState: NavigationState;
  navigationHistory: NavigationState[];
  navigateTo: (state: NavigationState) => void;
  navigateBack: () => void;
  navigateToDashboard: () => void;
  navigateToLeague: (league: League) => void;
  navigateToPlayer: (player: Player | null, league?: League) => void;
  navigateToCourse: (course: any, league: League) => void;
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
  const [currentState, setCurrentState] = useState<NavigationState>({
    type: "dashboard",
  });
  const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>(
    []
  );

  const navigateTo = (newState: NavigationState) => {
    setNavigationHistory((prev) => [...prev, currentState]);
    setCurrentState(newState);
  };

  const navigateBack = () => {
    if (navigationHistory.length > 0) {
      const previousState = navigationHistory[navigationHistory.length - 1];
      setCurrentState(previousState);
      setNavigationHistory((prev) => prev.slice(0, -1));
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
    currentState,
    navigationHistory,
    navigateTo,
    navigateBack,
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
