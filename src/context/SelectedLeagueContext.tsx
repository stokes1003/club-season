import { createContext, useContext, useState } from "react";

export type League = {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
  image_url: string;
};

type SelectedLeagueContextType = {
  selectedLeague: League | null;
  setSelectedLeague: (league: League | null) => void;
};

const SelectedLeagueContext = createContext<SelectedLeagueContextType | null>(
  null
);

export function SelectedLeagueProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  return (
    <SelectedLeagueContext.Provider
      value={{ selectedLeague, setSelectedLeague }}
    >
      {children}
    </SelectedLeagueContext.Provider>
  );
}

export function useSelectedLeague() {
  const context = useContext(SelectedLeagueContext);
  if (!context) {
    throw new Error(
      "useSelectedLeague must be used within a SelectedLeagueProvider"
    );
  }
  return context;
}
