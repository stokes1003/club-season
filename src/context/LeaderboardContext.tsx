import { createContext, useContext, useState } from "react";

type LeaderboardContextType = {
  refreshTrigger: number;
  triggerRefresh: () => void;
};

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(
  undefined
);

export function LeaderboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <LeaderboardContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
}
