import { useMemo } from "react";

const colors = {
  blue10: "#007AFF",
  red10: "#FF3B30",
  yellow10: "#FFCC00",
  green10: "#4CD964",
  purple10: "#9B36B7",
  orange10: "#FF9500",
  pink10: "#FF2D55",
  teal10: "#5AC8FA",
  gray10: "#8E8E93",
};

export function useRandomColor() {
  return useMemo(() => {
    const colorKeys = Object.keys(colors);
    const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    return colors[randomKey as keyof typeof colors];
  }, []);
}
