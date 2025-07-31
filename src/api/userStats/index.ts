import { getBasicStats } from "./getBasicStats";
import { getBestWorstRounds } from "./getBestWorstRounds";
import { getCourseStats } from "./getCourseStats";
import { getWinStats } from "./getWinStats";

export async function getUserStats(userId: string) {
  try {
    // Get all stats in parallel for better performance
    const [basicStats, bestWorstRounds, courseStats, winStats] =
      await Promise.all([
        getBasicStats(userId),
        getBestWorstRounds(userId),
        getCourseStats(userId),
        getWinStats(userId),
      ]);

    // Check if any of the stats failed
    if (!basicStats || !bestWorstRounds || !courseStats || !winStats) {
      console.error("One or more stat functions returned null");
      return null;
    }

    // Combine all stats into the final object
    return {
      ...basicStats,
      ...bestWorstRounds,
      ...courseStats,
      ...winStats,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
}

// Export individual functions for testing or specific use cases
export { getBasicStats, getBestWorstRounds, getCourseStats, getWinStats };
