import { Avatar, Text, XStack } from "tamagui";

interface PlayerAvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: "$2" | "$3" | "$4" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10";
  gap?: "$2" | "$3" | "$4" | "$5";
  color?: string;
}

export function PlayerAvatar({
  name,
  avatarUrl,
  size = "$4",
  gap = "$3",
  color,
}: PlayerAvatarProps) {
  // Handle undefined or null names
  const safeName = name || "Unknown";
  let nameToDisplay = safeName;
  if (safeName.split(" ").length > 1) {
    nameToDisplay = safeName.split(" ")[0][0] + safeName.split(" ")[1][0];
  } else {
    nameToDisplay = safeName.substring(0, 2).toUpperCase();
  }
  return (
    <XStack style={{ alignItems: "center" }} gap={gap}>
      <Avatar circular size={size}>
        <Avatar.Image src={avatarUrl || ""} />
        <Avatar.Fallback
          backgroundColor={color as any}
          style={{
            backgroundColor: color as any,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text fontSize="$6" color="white" fontWeight="bold">
            {nameToDisplay}
          </Text>
        </Avatar.Fallback>
      </Avatar>
    </XStack>
  );
}
