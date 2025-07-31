import { getRounds } from "./getRounds";
import { getCoursesForRounds } from "./getCoursesForRounds";
import { getScoresForRounds } from "./getScoresForRounds";
import { getPlayersForScores } from "./getPlayersForScores";
import { transformRoundData } from "./transformRoundData";

export async function getLeagueRounds(leagueId: string) {
  try {
    const rounds = await getRounds(leagueId);
    if (!rounds) {
      console.error("No rounds found");
      return null;
    }

    // Get courses and scores in parallel first
    const [courses, scores] = await Promise.all([
      getCoursesForRounds(rounds.map((round) => round.course_id)),
      getScoresForRounds(rounds.map((round) => round.id)),
    ]);

    if (!courses || !scores) {
      console.error("Failed to fetch courses or scores");
      return null;
    }

    // Get player IDs from scores and fetch players
    const playerIds = Array.from(scores.values())
      .flat()
      .map((score: any) => score.league_player_id);
    const players = await getPlayersForScores(playerIds);

    if (!courses || !scores || !players) {
      console.error("Failed to fetch required data");
      return null;
    }

    return transformRoundData(rounds, courses, scores, players);
  } catch (error) {
    console.error("Error fetching league rounds:", error);
    return null;
  }
}

export {
  getRounds,
  getCoursesForRounds,
  getScoresForRounds,
  getPlayersForScores,
  transformRoundData,
};
