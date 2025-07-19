import { Avatar, Text, XStack } from "tamagui";

interface PlayerAvatarProps {
  name: string;
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
            {name.substring(0, 2).toUpperCase()}
          </Text>
        </Avatar.Fallback>
      </Avatar>
    </XStack>
  );
}
