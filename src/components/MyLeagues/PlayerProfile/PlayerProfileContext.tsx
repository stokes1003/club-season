import { createContext, useContext, useState, ReactNode } from "react";
import { Player } from "src/types/player";
import { League } from "..";

type PlayerProfileMode =
  | "profile"
  | "change-name"
  | "change-email"
  | "change-role";

type PlayerProfileContextType = {
  mode: PlayerProfileMode;
  setMode: (mode: PlayerProfileMode) => void;
  selectedPlayer: Player;
  selectedLeague: League;
  setSelectedPlayer: (player: Player | null) => void;
};

const PlayerProfileContext = createContext<
  PlayerProfileContextType | undefined
>(undefined);

export const usePlayerProfile = () => {
  const context = useContext(PlayerProfileContext);
  if (!context) {
    throw new Error(
      "usePlayerProfile must be used within a PlayerProfileProvider"
    );
  }
  return context;
};

export const PlayerProfileProvider = ({
  children,
  selectedPlayer,
  selectedLeague,
  setSelectedPlayer,
}: {
  children: ReactNode;
  selectedPlayer: Player;
  selectedLeague: League;
  setSelectedPlayer: (player: Player | null) => void;
}) => {
  const [mode, setMode] = useState<PlayerProfileMode>("profile");

  const value = {
    mode,
    setMode,
    selectedPlayer,
    selectedLeague,
    setSelectedPlayer,
  };

  return (
    <PlayerProfileContext.Provider value={value}>
      {children}
    </PlayerProfileContext.Provider>
  );
};
