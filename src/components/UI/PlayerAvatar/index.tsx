import { Avatar, Text, XStack } from "tamagui";

interface PlayerAvatarProps {
  name?: string;
  avatarUrl?: string;
  size?:
    | "$2"
    | "$3"
    | "$4"
    | "$5"
    | "$6"
    | "$7"
    | "$8"
    | "$9"
    | "$10"
    | "$11"
    | "$12";
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
  const safeName = name || "";
  let nameToDisplay = safeName;
  const nameParts = safeName.split(" ").filter((part) => part.length > 0);
  if (nameParts.length > 1) {
    nameToDisplay = nameParts[0][0] + nameParts[1][0];
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
