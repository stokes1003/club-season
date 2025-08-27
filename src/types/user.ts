export type League = {
  id: string;
  name: string;
  isCreator: boolean;
  image_url: string;
  created_at: string;
  created_by: string;
  avatar_color: string;
};

export type User = {
  id: string;
  email: string | null;
  player_id?: string;
  name: string | null;
  avatar_url: string | null;
  leagues?: League[];
  player_color: string;
  created_at: string;
};
