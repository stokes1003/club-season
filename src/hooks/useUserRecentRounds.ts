import { useState, useEffect } from "react";
import { getUserRecentRounds } from "../api/getUserRecentRounds";

type UserRound = {
  id: string;
  league_name: string;
  course_name: string;
  course_img: string;
  date: string;
  is_major: boolean;
  major_name: string | null;
  gross_score: number;
  net_score: number;
  handicap: number;
  gross_points: number;
  net_points: number;
};

export function useUserRecentRounds(userId: string, limit: number = 10) {
  const [rounds, setRounds] = useState<UserRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const data = await getUserRecentRounds(userId, limit);
        setRounds(data);
      } catch (err) {
        console.error("Error fetching user rounds:", err);
        setError("Failed to load recent rounds");
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, [userId, limit]);

  const refresh = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUserRecentRounds(userId, limit);
      setRounds(data);
    } catch (err) {
      console.error("Error refreshing user rounds:", err);
      setError("Failed to refresh recent rounds");
    } finally {
      setLoading(false);
    }
  };

  return { rounds, loading, error, refresh };
}
