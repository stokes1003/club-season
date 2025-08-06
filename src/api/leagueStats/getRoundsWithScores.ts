import { getLeagueScores } from "./getLeagueScores";
import { getPlayersByLeague } from "../getPlayersByLeague";
import { getLeagueCourses } from "../getLeagueCourses";
import { getLeagueRounds } from "./getLeagueRounds";

export const getRoundsWithScores = async (leagueId: string) => {
  //Get all players for a league
  const players = await getPlayersByLeague(leagueId);
  //Get all courses for a league
  const courses = await getLeagueCourses(leagueId);
  // Get all rounds for the league
  const rounds = await getLeagueRounds(leagueId);

  if (!rounds || !players) return null;

  // Get scores for each round
  const roundsWithScores = await Promise.all(
    rounds.map(async (round) => {
      const scores = await getLeagueScores(round.id);
      return {
        ...round,
        scores: scores || [],
      };
    })
  );

  return { rounds: roundsWithScores, players, courses };
};
