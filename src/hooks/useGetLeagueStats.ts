import { useEffect, useState } from "react";
import { getLeagueStats } from "src/api/leagueStats/index";
import type { LeagueStats } from "src/types/leagueStats";

export function useGetLeagueStats(leagueId: string) {
  const [leagueStats, setLeagueStats] = useState<LeagueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagueStats = async () => {
      try {
        const leagueStats = await getLeagueStats(leagueId);
        setLeagueStats(leagueStats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching league stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagueStats();
  }, [leagueId]);

  return { leagueStats, loading };
}
