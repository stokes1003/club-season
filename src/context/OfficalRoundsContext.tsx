import { createContext, useContext, useState } from "react";

type OfficalRoundsContextType = {
  refreshTrigger: number;
  triggerRefresh: () => void;
};

const OfficalRoundsContext = createContext<
  OfficalRoundsContextType | undefined
>(undefined);

export function OfficalRoundsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <OfficalRoundsContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </OfficalRoundsContext.Provider>
  );
}

export function useOfficalRounds() {
  const context = useContext(OfficalRoundsContext);
  if (context === undefined) {
    throw new Error(
      "useOfficalRounds must be used within a OfficalRoundsProvider"
    );
  }
  return context;
}
