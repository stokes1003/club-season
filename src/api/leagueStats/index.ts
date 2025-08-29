import { getPlayersByLeague } from "../playerStats";
import { getLeagueCourses } from "../getLeagueCourses";
import { getLeagueRounds } from "./getLeagueRounds";
import { getLeagueScores } from "./getLeagueScores";
import { calculateBestWorstScores } from "./calculations/calculateBestWorstScores";

export async function getLeagueStats(leagueId: string) {
  // Get all data using existing APIs
  const players = await getPlayersByLeague(leagueId);
  const courses = await getLeagueCourses(leagueId);
  const rounds = await getLeagueRounds(leagueId);

  if (!players || !rounds || players.length === 0 || rounds.length === 0) {
    return null;
  }

  // Get scores for best/worst calculations (still needed for course/date info)
  const roundsWithScores = await Promise.all(
    rounds.map(async (round) => {
      const scores = await getLeagueScores(round.id);
      return {
        ...round,
        scores: scores || [],
      };
    })
  );

  // Flatten scores for best/worst calculations
  const allScores: Array<{
    score: number;
    player: any;
    round: any;
    course: any;
  }> = [];

  const allNetScores: Array<{
    score: number;
    player: any;
    round: any;
    course: any;
  }> = [];

  for (const round of roundsWithScores) {
    for (const score of round.scores) {
      const player = players.find(
        (p) => p.player_id === score.league_player_id
      );
      const course = courses.find(
        (c) => c.external_course_id === round.course_id
      );

      allScores.push({
        score: score.gross_score,
        player,
        round,
        course,
      });

      allNetScores.push({
        score: score.net_score,
        player,
        round,
        course,
      });
    }
  }

  // Calculate best/worst scores
  const grossScores = calculateBestWorstScores(allScores);
  const netScores = calculateBestWorstScores(allNetScores);

  // Find top performers from players data
  const bestAverage = players.reduce(
    (best, current) => (current.avg_gross < best.avg_gross ? current : best),
    players[0]
  );

  const bestNetAverage = players.reduce(
    (best, current) => (current.avg_net < best.avg_net ? current : best),
    players[0]
  );

  const mostWins = players.reduce(
    (most, current) => (current.gross_wins > most.gross_wins ? current : most),
    players[0]
  );

  const mostNetWins = players.reduce(
    (most, current) => (current.net_wins > most.net_wins ? current : most),
    players[0]
  );

  const mostMajorWins = players.reduce((most, current) => {
    return current.major_wins > most.major_wins ? current : most;
  }, players[0]);

  const mostNetMajorWins = players.reduce(
    (most, current) =>
      current.net_major_wins > most.net_major_wins ? current : most,
    players[0]
  );

  return {
    best_score: grossScores.best_score,
    worst_score: grossScores.worst_score,
    best_net_score: netScores.best_score,
    worst_net_score: netScores.worst_score,
    most_wins: {
      player: {
        name: mostWins.name,
        avatar_url: mostWins.avatar_url,
        color: mostWins.player_color,
      },
      wins: mostWins.gross_wins,
    },
    most_net_wins: {
      player: {
        name: mostNetWins.name,
        avatar_url: mostNetWins.avatar_url,
        color: mostNetWins.player_color,
      },
      wins: mostNetWins.net_wins,
    },
    most_major_wins: {
      player: {
        name: mostMajorWins.name,
        avatar_url: mostMajorWins.avatar_url,
        color: mostMajorWins.player_color,
      },
      wins: mostMajorWins.major_wins,
    },
    most_net_major_wins: {
      player: {
        name: mostNetMajorWins.name,
        avatar_url: mostNetMajorWins.avatar_url,
        color: mostNetMajorWins.player_color,
      },
      wins: mostNetMajorWins.net_major_wins,
    },
    best_average: {
      player: {
        name: bestAverage.name,
        avatar_url: bestAverage.avatar_url,
        color: bestAverage.player_color,
      },
      score: bestAverage.avg_gross,
    },
    best_net_average: {
      player: {
        name: bestNetAverage.name,
        avatar_url: bestNetAverage.avatar_url,
        color: bestNetAverage.player_color,
      },
      score: bestNetAverage.avg_net,
    },
  };
}
