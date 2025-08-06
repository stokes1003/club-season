import { useEffect, useState } from "react";
import { getLeagueStats } from "src/api/getLeagueStats";
import type { LeagueStats } from "src/types/leagueStats";

export function useGetLeagueStats(leagueId: string) {
  const [leagueStats, setLeagueStats] = useState<LeagueStats | null>(null);

  useEffect(() => {
    const fetchLeagueStats = async () => {
      const leagueStats = await getLeagueStats(leagueId);
      setLeagueStats(leagueStats);
    };
    fetchLeagueStats();
  }, [leagueId]);

  return leagueStats;
}
