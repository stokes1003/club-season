import { getPlayersByLeague } from "src/api/getPlayersByLeague";
import { useEffect, useState } from "react";
import { Player } from "../../src/types/player";

export function getPlayers(leagueId: string, refreshTrigger?: number) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayersByLeague(leagueId ?? "");
      setPlayers(data || []);
    };
    fetchPlayers();
  }, [leagueId, refreshTrigger]);

  return players;
}
