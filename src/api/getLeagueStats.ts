import { supabase } from "../lib/supabase";
import { getPlayersByLeague } from "./getPlayersByLeague";
import { getLeagueCourses } from "./getLeagueCourses";
import { LeagueStats } from "../types/leagueStats";

//Get all rounds for a league
export const getLeagueRounds = async (leagueId: string) => {
  const { data, error } = await supabase
    .from("rounds")
    .select("id, date, course_id, is_major")
    .eq("league_id", leagueId);

  if (error) {
    console.error("Error fetching league stats:", error);
    return null;
  }

  return data;
};

//Get all scores for a round
export const getLeagueScores = async (roundId: string) => {
  const { data, error } = await supabase
    .from("round_scores")
    .select("id, league_player_id, gross_score, net_score, handicap")
    .eq("round_id", roundId);

  if (error) {
    console.error("Error fetching league scores:", error);
    return null;
  }

  return data;
};

export const getLeagueStats = async (
  leagueId: string
): Promise<LeagueStats | null> => {
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

  // Find Best/Worst Rounds with player and round details
  let bestScore = Infinity;
  let bestScorePlayer: any = null;
  let bestScoreRound: any = null;
  let bestScoreCourse: any = null;

  let worstScore = 0;
  let worstScorePlayer: any = null;
  let worstScoreRound: any = null;
  let worstScoreCourse: any = null;

  // Flatten all scores with their context
  const allScores: Array<{
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
    }
  }

  // Find best and worst scores
  for (const scoreData of allScores) {
    if (scoreData.score < bestScore) {
      bestScore = scoreData.score;
      bestScorePlayer = scoreData.player;
      bestScoreRound = scoreData.round;
      bestScoreCourse = scoreData.course;
    }

    if (scoreData.score > worstScore) {
      worstScore = scoreData.score;
      worstScorePlayer = scoreData.player;
      worstScoreRound = scoreData.round;
      worstScoreCourse = scoreData.course;
    }
  }

  // Find best and worst net scores for each player

  let bestNetScore = Infinity;
  let bestNetScorePlayer: any = null;
  let bestNetScoreRound: any = null;
  let bestNetScoreCourse: any = null;

  let worstNetScore = 0;
  let worstNetScorePlayer: any = null;
  let worstNetScoreRound: any = null;
  let worstNetScoreCourse: any = null;

  // Flatten all net scores with their context
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

      allNetScores.push({
        score: score.net_score,
        player,
        round,
        course,
      });
    }
  }

  // Find best and worst net scores
  for (const scoreData of allNetScores) {
    if (scoreData.score < bestNetScore) {
      bestNetScore = scoreData.score;
      bestNetScorePlayer = scoreData.player;
      bestNetScoreRound = scoreData.round;
      bestNetScoreCourse = scoreData.course;
    }

    if (scoreData.score > worstNetScore) {
      worstNetScore = scoreData.score;
      worstNetScorePlayer = scoreData.player;
      worstNetScoreRound = scoreData.round;
      worstNetScoreCourse = scoreData.course;
    }
  }

  // Calculate player averages and wins
  const playerStats = players.map((player) => {
    const playerScores = allScores.filter(
      (score) => score.player?.player_id === player.player_id
    );
    const playerNetScores = allNetScores.filter(
      (score) => score.player?.player_id === player.player_id
    );

    const avgGross =
      playerScores.length > 0
        ? playerScores.reduce((sum, score) => sum + score.score, 0) /
          playerScores.length
        : 0;

    const avgNet =
      playerNetScores.length > 0
        ? playerNetScores.reduce((sum, score) => sum + score.score, 0) /
          playerNetScores.length
        : 0;

    // Find the player's best round (lowest gross score) for win tracking
    const bestRound = playerScores.reduce(
      (best, current) => (current.score < best.score ? current : best),
      playerScores[0]
    );

    // Find the player's best major round (lowest gross score in major rounds)
    const majorRounds = playerScores.filter((score) => score.round.is_major);

    const bestMajorRound =
      majorRounds.length > 0
        ? majorRounds.reduce(
            (best, current) => (current.score < best.score ? current : best),
            majorRounds[0]
          )
        : null;

    // Calculate major wins by analyzing each round
    let majorWins = 0;
    const majorRoundIds = [
      ...new Set(majorRounds.map((score) => score.round.id)),
    ];

    for (const roundId of majorRoundIds) {
      const roundScores = allScores.filter(
        (score) => score.round.id === roundId
      );
      if (roundScores.length > 0) {
        const winningScore = roundScores.reduce(
          (best, current) => (current.score < best.score ? current : best),
          roundScores[0]
        );

        if (winningScore.player?.player_id === player.player_id) {
          majorWins++;
        }
      }
    }

    return {
      player,
      avgGross,
      avgNet,
      grossWins: player.gross_wins || 0,
      netWins: player.net_wins || 0,
      majorWins,
      bestRound,
      bestMajorRound,
    };
  });

  // Find best average and most wins
  const bestAveragePlayer = playerStats.reduce(
    (best, current) => (current.avgGross < best.avgGross ? current : best),
    playerStats[0]
  );

  const mostWinsPlayer = playerStats.reduce(
    (most, current) => (current.grossWins > most.grossWins ? current : most),
    playerStats[0]
  );

  const mostMajorWinsPlayer = playerStats.reduce(
    (most, current) => (current.majorWins > most.majorWins ? current : most),
    playerStats[0]
  );

  return {
    best_score: {
      player: {
        name: bestScorePlayer?.name,
        avatar_url: bestScorePlayer?.avatar_url,
        color: bestScorePlayer?.player_color,
      },
      score: bestScore === Infinity ? 0 : bestScore,
      course: {
        course_name: bestScoreCourse?.course_name,
        club_name: bestScoreCourse?.club_name,
        location: bestScoreCourse?.location,
        tees: bestScoreCourse?.tees,
      },
      date: bestScoreRound?.date,
    },
    worst_score: {
      player: {
        name: worstScorePlayer?.name,
        avatar_url: worstScorePlayer?.avatar_url,
        color: worstScorePlayer?.player_color,
      },
      score: worstScore === 0 ? 0 : worstScore,
      course: {
        course_name: worstScoreCourse?.course_name,
        club_name: worstScoreCourse?.club_name,
        location: worstScoreCourse?.location,
        tees: worstScoreCourse?.tees,
      },
      date: worstScoreRound?.date,
    },
    best_net_score: {
      player: {
        name: bestNetScorePlayer?.name,
        avatar_url: bestNetScorePlayer?.avatar_url,
        color: bestNetScorePlayer?.player_color,
      },
      score: bestNetScore === Infinity ? 0 : bestNetScore,
      course: {
        course_name: bestNetScoreCourse?.course_name,
        club_name: bestNetScoreCourse?.club_name,
        location: bestNetScoreCourse?.location,
        tees: bestNetScoreCourse?.tees,
      },
      date: bestNetScoreRound?.date,
    },
    worst_net_score: {
      player: {
        name: worstNetScorePlayer?.name,
        avatar_url: worstNetScorePlayer?.avatar_url,
        color: worstNetScorePlayer?.player_color,
      },
      score: worstNetScore === 0 ? 0 : worstNetScore,
      course: {
        course_name: worstNetScoreCourse?.course_name,
        club_name: worstNetScoreCourse?.club_name,
        location: worstNetScoreCourse?.location,
        tees: worstNetScoreCourse?.tees,
      },
      date: worstNetScoreRound?.date,
    },
    most_wins: {
      player: {
        name: mostWinsPlayer?.player?.name,
        avatar_url: mostWinsPlayer?.player?.avatar_url,
        color: mostWinsPlayer?.player?.player_color,
      },
      score: mostWinsPlayer?.grossWins || 0,

      course: {
        course_name: mostWinsPlayer?.bestRound?.course?.course_name,
        club_name: mostWinsPlayer?.bestRound?.course?.club_name,
        location: mostWinsPlayer?.bestRound?.course?.location,
        tees: mostWinsPlayer?.bestRound?.course?.tees,
      },
      date: mostWinsPlayer?.bestRound?.round?.date,
    },
    most_major_wins: {
      player: {
        name: mostMajorWinsPlayer?.player?.name,
        avatar_url: mostMajorWinsPlayer?.player?.avatar_url,
        color: mostMajorWinsPlayer?.player?.player_color,
      },
      score: mostMajorWinsPlayer?.majorWins || 0,
      course: {
        course_name: mostMajorWinsPlayer?.bestMajorRound?.course?.course_name,
        club_name: mostMajorWinsPlayer?.bestMajorRound?.course?.club_name,
        location: mostMajorWinsPlayer?.bestMajorRound?.course?.location,
        tees: mostMajorWinsPlayer?.bestMajorRound?.course?.tees,
      },
      date: mostMajorWinsPlayer?.bestMajorRound?.round?.date,
    },
    best_average: {
      player: {
        name: bestAveragePlayer?.player?.name,
        avatar_url: bestAveragePlayer?.player?.avatar_url,
        color: bestAveragePlayer?.player?.player_color,
      },
      score: bestAveragePlayer?.avgGross || 0,
    },
  };
};
