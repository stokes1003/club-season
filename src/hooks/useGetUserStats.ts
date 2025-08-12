import { useEffect } from "react";
import { User } from "../types/user";
import { useState } from "react";
import { getUserStats } from "../api/userStats";

export function useGetUserStats(user: User | null) {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<{
    rounds_played: number;
    avg_net_score: number;
    best_net_score: {
      score: number;
      course_name: string;
      date: Date;
    };
    worst_net_score: {
      score: number;
      course_name: string;
      date: Date;
    };
    avg_gross_score: number;
    best_gross_score: {
      score: number;
      course_name: string;
      date: Date;
    };
    worst_gross_score: {
      score: number;
      course_name: string;
      date: Date;
    };
    most_played_course?: {
      course_name: string;
      times_played: number;
      avg_score: number;
    };
    best_course: {
      course_name: string;
      avg_score: number;
      times_played: number;
    };
    worst_course: {
      course_name: string;
      avg_score: number;
      times_played: number;
    };
    net_wins: number;
    gross_wins: number;
  } | null>(null);

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
