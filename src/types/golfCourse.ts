export type Hole = {
  par: number;
  yardage: number;
  handicap: number;
};

export type Tee = {
  tee_name: string;
  course_rating: number;
  slope_rating: number;
  bogey_rating: number;
  total_yards: number;
  total_meters: number;
  number_of_holes: number;
  par_total: number;
  front_course_rating: number;
  front_slope_rating: number;
  front_bogey_rating: number;
  back_course_rating: number;
  back_slope_rating: number;
  back_bogey_rating: number;
  holes: Hole[];
};

export type Tees = {
  female: Tee[];
  male: Tee[];
};

export type Location = {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type GolfCourse = {
  id: number;
  club_name: string;
  course_name: string;
  location: Location;
  tees: Tees;
  photo_url: string;
};
