import { useEffect, useState } from "react";
import { getLeagueStats } from "src/api/leagueStats/index";
import type { LeagueStats } from "src/types/leagueStats";

export function useGetLeagueStats(leagueId: string) {
  const [leagueStats, setLeagueStats] = useState<LeagueStats | null>(null);
  console.log(leagueStats);

  useEffect(() => {
    const fetchLeagueStats = async () => {
      const leagueStats = await getLeagueStats(leagueId);
      setLeagueStats(leagueStats);
    };
    fetchLeagueStats();
  }, [leagueId]);

  return leagueStats;
}
