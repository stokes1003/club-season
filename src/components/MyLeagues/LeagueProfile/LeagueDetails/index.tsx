import { YStack, Text } from "tamagui";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { League } from "src/components/MyLeagues";
import { Alert, Pressable } from "react-native";
import { useState } from "react";
import { useUploadImage } from "src/hooks/useUploadImage";
import { supabase } from "src/lib/supabase";

export function LeagueDetails({
  selectedLeague,
  setSelectedLeague,
}: {
  selectedLeague: League;
  setSelectedLeague: (league: League | null) => void;
}) {
  const [leagueAvatar, setLeagueAvatar] = useState(selectedLeague.image_url);

  const { pickImage } = useUploadImage();

  const handleImageUpload = async () => {
    const uploadedUrl = await pickImage("league_leagues", selectedLeague.id);
    if (uploadedUrl) {
      const { error } = await supabase
        .from("leagues")
        .update({ image_url: uploadedUrl })
        .eq("id", selectedLeague.id);

      if (error) {
        console.error("Database update error:", error);
        Alert.alert("Error", "Failed to save to database");
      } else {
        setLeagueAvatar(uploadedUrl);
        setSelectedLeague({
          ...selectedLeague,
          image_url: uploadedUrl,
        });
      }
    }
  };

  return (
    <YStack gap="$4" style={{ alignItems: "center" }}>
      <Pressable onPress={handleImageUpload}>
        <PlayerAvatar
          name={selectedLeague.name}
          avatarUrl={leagueAvatar}
          size="$10"
          color={selectedLeague.avatar_color || undefined}
        />
      </Pressable>

      <YStack gap="$1" style={{ alignItems: "center" }}>
        <Text fontSize="$8" fontWeight="bold">
          {selectedLeague.name}
        </Text>
        <Text fontSize="$4" fontWeight="400" color="$black11">
          Est. {new Date(selectedLeague.created_at).toLocaleDateString()}
        </Text>
      </YStack>
    </YStack>
  );
}
