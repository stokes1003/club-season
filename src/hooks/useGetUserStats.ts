import { useEffect } from "react";
import { User } from "../types/user";
import { useState } from "react";
import { getUserStats } from "src/api/getUserStats";

export function useGetUserStats(user: User | null) {
  const [userStats, setUserStats] = useState<{
    rounds_played: number;
    avg_net_score: number;
    best_net_score: number;
    avg_gross_score: number;
    best_gross_score: number;
    net_wins: number;
    gross_wins: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserStats() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const stats = await getUserStats(user.id);
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserStats();
  }, [user]);

  return { userStats, loading: loading };
}
