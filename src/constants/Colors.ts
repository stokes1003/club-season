export const avatarColors = {
  darkBlue10: "#1E3A8A",
  red10: "#FF3B30",
  yellow10: "#FFCC00",
  green10: "#4CD964",
  purple10: "#9B36B7",
  orange10: "#FF9500",
  pink10: "#EC4899",
  teal10: "#5AC8FA",
  darkGreen10: "#15803D",
} as const;

export type LeagueAvatarColor = keyof typeof avatarColors;
