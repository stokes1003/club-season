import { YStack, Text } from "tamagui";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { League } from "src/components/MyLeagues";
import { Alert, Pressable } from "react-native";
import { useUploadImage } from "src/hooks/useUploadImage";
import { supabase } from "src/lib/supabase";
import { useState } from "react";

export function LeagueDetails({
  selectedLeague,
  setSelectedLeague,
}: {
  selectedLeague: League;
  setSelectedLeague: (league: League | null) => void;
}) {
  const { pickImage } = useUploadImage();
  const [leagueImage, setLeagueImage] = useState(selectedLeague.image_url);

  const handleImageUpload = async () => {
    const uploadedUrl = await pickImage("league_leagues", selectedLeague.id);
    if (uploadedUrl) {
      console.log("Before update:", selectedLeague.image_url); // Debug
      setLeagueImage(uploadedUrl);

      const { error } = await supabase
        .from("leagues")
        .update({ image_url: uploadedUrl })
        .eq("id", selectedLeague.id);

      if (error) {
        console.error("Database update error:", error);
        Alert.alert("Error", "Failed to save to database");
        setLeagueImage(selectedLeague.image_url);
      } else {
        console.log("Updating state with:", uploadedUrl); // Debug
        setSelectedLeague({
          ...selectedLeague,
          image_url: uploadedUrl,
        });
        console.log("State update called"); // Debug
      }
    }
  };

  return (
    <YStack gap="$4" style={{ alignItems: "center" }}>
      {console.log("Rendering PlayerAvatar with URL:", leagueImage)}
      <Pressable onPress={handleImageUpload}>
        <PlayerAvatar
          key={leagueImage}
          name={selectedLeague.name}
          avatarUrl={leagueImage}
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
