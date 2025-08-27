export type Score = {
  player: string;
  player_img: string;
  player_color: string;
  gross: number;
  hcp: number;
  net: number;
};
export type Round = {
  _id: string;
  course: string;
  course_img: string;
  date: string;
  isMajor?: boolean;
  majorName?: string;
  scores: Score[];
  league_id: string;
  league_img: string;
};
