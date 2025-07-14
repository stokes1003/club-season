import { getPlayersByLeague } from "src/api/getPlayersByLeague";
import { useEffect, useState } from "react";
import { Player } from "../../src/types/player";

export function useGetPlayers(leagueId: string, refreshTrigger?: number) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!leagueId) {
        setPlayers([]);
        return;
      }

      try {
        const data = await getPlayersByLeague(leagueId);
        setPlayers(data || []);
      } catch (error) {
        console.error(
          "useGetPlayers: Error fetching players for leagueId:",
          leagueId,
          error
        );
        setPlayers([]);
      }
    };
    fetchPlayers();
  }, [leagueId, refreshTrigger]);

  return players;
}
