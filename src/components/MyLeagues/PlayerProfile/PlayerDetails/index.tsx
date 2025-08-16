import { Alert, Pressable } from "react-native";
import { PlayerAvatar } from "src/components/UI/PlayerAvatar";
import { Player } from "src/types/player";
import { League } from "src/components/MyLeagues";
import {
  YStack,
  Text,
  Label,
  XStack,
  Separator,
  Button,
  Spinner,
} from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { sendEmail } from "src/api/sendEmail";
import { useState } from "react";
import { useUser } from "src/context/UserContext";
import { useGetPlayerRole } from "src/hooks/useGetPlayerRole";
import { useUploadImage } from "src/hooks/useUploadImage";
import { supabase } from "src/lib/supabase";

export function PlayerDetails({
  setMode,
  selectedPlayer,
  setSelectedPlayer,
  selectedLeague,
}: {
  setMode: (
    mode: "change-name" | "change-email" | "change-role" | "profile"
  ) => void;
  selectedPlayer: Player;
  setSelectedPlayer: (player: Player | null) => void;
  selectedLeague: League;
}) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [playerAvatar, setPlayerAvatar] = useState(selectedPlayer.avatar_url);

  const playerRole = useGetPlayerRole(user?.id || "", selectedLeague.id);

  const handleResendInvite = async () => {
    setLoading(true);
    try {
      await sendEmail({
        to: selectedPlayer.invite_email,
        subject: `You've been added to ${selectedLeague.name}`,
        html: `
        <p>You've been added to ${selectedLeague.name} by ${user?.name}.</p>
        <p>You can view the league and manage your settings by downloading the Club Season app in the app store.</p>
        `,
      });
      Alert.alert("Success", "Invite has been resent to the player");
    } catch (error) {
      console.error("Failed to send email:", error);

      let errorMessage = "Failed to send invite email. Please try again later.";

      if (error.message?.includes("invalid")) {
        errorMessage =
          "Invalid email address. Please check the email and try again.";
      } else if (error.message?.includes("rate limit")) {
        errorMessage =
          "Too many emails sent. Please wait a few minutes and try again.";
      } else if (error.message?.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = () => {
    if (playerRole?.toLowerCase() === "commissioner") {
      setMode("change-role");
    } else {
      Alert.alert(
        "Error",
        "Only the commissioner can change the role of a player."
      );
    }
  };
  const { pickImage } = useUploadImage();
  const handleImageUpload = async () => {
    const uploadedUrl = await pickImage(
      "league_players",
      selectedPlayer.player_id
    );

    if (uploadedUrl) {
      const { error } = await supabase
        .from("league_players")
        .update({ avatar_url: uploadedUrl })
        .eq("id", selectedPlayer.player_id);

      if (error) {
        console.error("Database update error:", error);
        Alert.alert("Error", "Failed to save to database");
      } else {
        console.log("Database updated successfully");
        setPlayerAvatar(uploadedUrl);
        setSelectedPlayer({
          ...selectedPlayer,
          avatar_url: uploadedUrl,
        });
      }
    }
  };

  return (
    <YStack gap="$8" style={{ width: "100%" }}>
      <YStack style={{ alignItems: "center" }} gap="$6">
        <Pressable onPress={handleImageUpload}>
          <YStack gap="$2">
            <PlayerAvatar
              name={selectedPlayer.name}
              avatarUrl={playerAvatar}
              size="$10"
              color={selectedPlayer.player_color || undefined}
            />
          </YStack>
        </Pressable>

        <Text fontSize="$5" fontWeight="400">
          Customize player details for {selectedLeague.name}. These details will
          only affect {selectedLeague.name}.
        </Text>
      </YStack>

      <YStack gap="$4">
        <Pressable onPress={() => setMode("change-name")}>
          <XStack
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <YStack gap="$1">
              <Label fontSize="$6" fontWeight="600">
                Display Name
              </Label>
              <Text fontSize="$5">{selectedPlayer.name}</Text>
            </YStack>
            <ChevronRight />
          </XStack>
        </Pressable>

        <Separator width={320} borderColor="$black10" />
        <Pressable onPress={() => setMode("change-email")}>
          <XStack
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <YStack gap="$1">
              <Label fontSize="$6" fontWeight="600">
                Invitation Email
              </Label>
              <Text fontSize="$5" fontWeight="400">
                {selectedPlayer.invite_email}
              </Text>
            </YStack>
            <ChevronRight />
          </XStack>
        </Pressable>
        <Separator width={320} borderColor="$black10" />
        <Pressable onPress={handleChangeRole}>
          <XStack
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <YStack gap="$1">
              <Label fontSize="$6" fontWeight="600">
                Role
              </Label>
              <Text fontSize="$5" fontWeight="400">
                {selectedPlayer.player_role}
              </Text>
            </YStack>
            {playerRole?.toLowerCase() === "commissioner" && <ChevronRight />}
          </XStack>
        </Pressable>
      </YStack>
      <YStack gap="$4">
        <Button
          bg="$blue10"
          color="$white1"
          fontSize="$5"
          fontWeight="bold"
          style={{ width: "100%" }}
          onPress={handleResendInvite}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Resend Invite"}
        </Button>
      </YStack>
    </YStack>
  );
}
