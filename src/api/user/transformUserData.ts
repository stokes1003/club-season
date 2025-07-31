export type League = {
  id: string;
  name: string;
  isCreator: boolean;
  image_url: string;
  avatar_color: string;
  created_at: string;
  created_by: string;
};

export type User = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  player_color: string;
  leagues: League[];
};

export function transformUserData(authUser: any, leaguePlayers: any[]): User {
  const leagues = (leaguePlayers || []).map((lp: any) => ({
    id: lp.leagues.id,
    name: lp.leagues.name,
    isCreator: lp.leagues.created_by === authUser.id,
    image_url: lp.leagues.image_url,
    avatar_color: lp.leagues.avatar_color,
    created_at: lp.leagues.created_at,
    created_by: lp.leagues.created_by,
  }));

  const firstLeaguePlayer = leaguePlayers?.[0];

  return {
    id: authUser.id,
    email: authUser.email || null,
    name:
      authUser.user_metadata?.name || firstLeaguePlayer?.display_name || null,
    avatar_url:
      authUser.user_metadata?.avatar_url ||
      firstLeaguePlayer?.avatar_url ||
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    player_color: firstLeaguePlayer?.player_color || "#6B7280",
    leagues,
  };
}
