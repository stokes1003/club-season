import { useEffect, useState } from "react";
import { Round } from "../../src/types/round";
import { getLeagueRounds } from "src/api/getLeagueRounds";

export function getOfficialRounds(leagueId: string, refreshTrigger?: number) {
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    const fetchRounds = async () => {
      const data = await getLeagueRounds(leagueId);
      setRounds(data || []);
    };
    fetchRounds();
  }, [leagueId, refreshTrigger]);

  return rounds;
}
