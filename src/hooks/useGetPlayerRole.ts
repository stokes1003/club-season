import { useState, useEffect } from "react";
import { getPlayerRoleByLeague } from "src/api/getPlayerRoleByLeague";

export const useGetPlayerRole = (userId: string, leagueId: string) => {
  const [playerRole, setPlayerRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerRole = async () => {
      if (userId && leagueId) {
        const role = await getPlayerRoleByLeague(userId, leagueId);
        setPlayerRole(role);
      }
    };

    fetchPlayerRole();
  }, [userId, leagueId]);

  return playerRole;
};
