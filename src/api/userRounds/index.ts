import { getRecentUserScores } from "./getRecentUserScores";
import { getRoundsForScores } from "./getRoundsForScores";
import { getLeagueAndCourses } from "./getLeagueAndCourses";
import { transformUserRounds } from "./transformUserRounds";
import { getLeaguePlayerIds } from "./getLeaguePlayerIds";

export async function getUserRounds(userId: string, limit: number = 10) {
  try {
    const leaguePlayerIds = await getLeaguePlayerIds(userId);
    if (!leaguePlayerIds || leaguePlayerIds.length === 0) {
      return [];
    }

    const scores = await getRecentUserScores(leaguePlayerIds, limit);
    if (!scores || scores.length === 0) {
      return [];
    }

    const rounds = await getRoundsForScores(
      scores.map((score) => score.round_id)
    );
    if (!rounds || rounds.length === 0) {
      return [];
    }

    const leaguesAndCourses = await getLeagueAndCourses(
      rounds.map((round) => round.league_id),
      rounds.map((round) => round.course_id)
    );

    if (!leaguesAndCourses) {
      console.error("Failed to fetch leagues or courses");
      return [];
    }

    return transformUserRounds(
      scores,
      rounds,
      leaguesAndCourses.leagues,
      leaguesAndCourses.courses
    );
  } catch (error) {
    console.error("Error fetching user rounds:", error);
    return [];
  }
}

export {
  getRecentUserScores,
  getRoundsForScores,
  getLeagueAndCourses,
  transformUserRounds,
  getLeaguePlayerIds,
};
