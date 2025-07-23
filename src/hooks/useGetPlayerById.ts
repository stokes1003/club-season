import { useEffect, useState } from "react";
import { getPlayerById } from "src/api/getPlayerById";

export const useGetPlayerById = (userId: string) => {
  const [playerName, setPlayerName] = useState<string>("");

  useEffect(() => {
    const getPlayerName = async () => {
      if (userId) {
        const name = await getPlayerById(userId);
        setPlayerName(name || "Unknown");
      }
    };

    getPlayerName();
  }, [userId]);

  return playerName;
};
