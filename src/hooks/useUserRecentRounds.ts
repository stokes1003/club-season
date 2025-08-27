import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";
import { getUserRounds } from "../api/userRounds";
import { type UserRound } from "../api/userRounds/transformUserRounds";

export function useUserRecentRounds(userId: string, limit: number = 10) {
  const [rounds, setRounds] = useState<UserRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger: refreshTriggerUser } = useUser();

  useEffect(() => {
    if (!userId) {
      setRounds([]);
      setLoading(false);
      return;
    }

    const fetchRounds = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserRounds(userId, limit);

        const sortedRounds = data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setRounds(sortedRounds as any);
      } catch (err) {
        console.error("Error fetching user rounds:", err);
        setError("Failed to load recent rounds");
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, [userId, limit, refreshTriggerUser]);

  const refresh = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUserRounds(userId, limit);
      setRounds(data as any);
    } catch (err) {
      console.error("Error refreshing user rounds:", err);
      setError("Failed to refresh recent rounds");
    } finally {
      setLoading(false);
    }
  };

  return { rounds, loading, error, refresh };
}
