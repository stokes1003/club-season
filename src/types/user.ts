export type League = {
  id: string;
  name: string;
  isCreator: boolean;
};

export type User = {
  id: string;
  email: string | null;
  player_id?: string;
  name: string | null;
  avatar_url: string | null;
  leagues?: League[];
};
