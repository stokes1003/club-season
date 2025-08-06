export interface LeagueStatsPlayer {
  name: string;
  avatar_url: string;
  color: string;
}

export interface LeagueStatsCourse {
  course_name: string;
  club_name: string;
  location: string | null;
  tees: string | null;
}

export interface LeagueStatsScore {
  player: LeagueStatsPlayer;
  score: number;
  course: LeagueStatsCourse;
  date: string;
}

export interface LeagueStatsAverage {
  player: LeagueStatsPlayer;
  score: number;
}

export interface LeagueStats {
  best_score: LeagueStatsScore;
  worst_score: LeagueStatsScore;
  best_net_score: LeagueStatsScore;
  worst_net_score: LeagueStatsScore;
  most_wins: LeagueStatsScore;
  most_major_wins: LeagueStatsScore;
  best_average: LeagueStatsAverage;
}
