import { calculatePlayerStats as calculatePlayerStatsFunction } from "./calculatePlayerStats";
import { findTopPlayers as findTopPlayersFunction } from "./findTopPlayers";
import { flattenScores as flattenScoresFunction } from "./flattenScores";

export const calculatePlayerStats = (
  allScores: any,
  players: any,
  allNetScores: any
) => {
  return calculatePlayerStatsFunction(allScores, players, allNetScores);
};

export const findTopPlayers = (playerStats: any) => {
  return findTopPlayersFunction(playerStats);
};

export const flattenScores = (
  roundsWithScores: any,
  players: any,
  courses: any
) => {
  return flattenScoresFunction(roundsWithScores, players, courses);
};
