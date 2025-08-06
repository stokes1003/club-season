export type LeagueStatsPlayer = {
  name: string;
  avatar_url: string;
  color: string;
};

export type LeagueStatsCourse = {
  course_name: string;
  club_name: string;
  location: string | null;
  tees: string | null;
};

export type LeagueStatsScore = {
  player: LeagueStatsPlayer;
  score: number;
  course: LeagueStatsCourse;
  date: string;
};

export type LeagueStatsAverage = {
  player: LeagueStatsPlayer;
  score: number;
};

export type PlayerStat = {
  avgGross: number;
  avgNet: number;
  bestMajorRound: any;
  bestRound: any;
  grossWins: number;
  majorWins: number;
  netWins: number;
  player: any;
};

export type TopPlayers = {
  bestAverage: PlayerStat;
  mostMajorWins: PlayerStat;
  mostWins: PlayerStat;
};

export type LeagueStatsWins = {
  player: LeagueStatsPlayer;
  wins: number;
};

export type LeagueStats = {
  best_score: LeagueStatsScore;
  worst_score: LeagueStatsScore;
  best_net_score: LeagueStatsScore;
  worst_net_score: LeagueStatsScore;
  most_wins: LeagueStatsWins;
  most_major_wins: LeagueStatsWins;
  best_average: LeagueStatsAverage;
};
