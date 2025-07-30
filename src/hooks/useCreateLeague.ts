import { Alert } from "react-native";
import { supabase } from "src/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "src/api/uploadImage";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";
import { useLeaderboard } from "src/context/LeaderboardContext";
import { useOfficalRounds } from "src/context/OfficalRoundsContext";
import { sendEmail } from "src/api/sendEmail";

interface Player {
  name: string;
  image: string;
  email: string;
  color: string;
}

export const useCreateLeague = () => {
  const { triggerRefresh: triggerSelectedLeagueRefresh } = useSelectedLeague();
  const { triggerRefresh: triggerLeaderboardRefresh } = useLeaderboard();
  const { triggerRefresh: triggerRoundsRefresh } = useOfficalRounds();
  const createLeague = async ({
    leagueName,
    leagueAvatar,
    players,
    handleHome,
    setPlayers,
    setLeagueAvatar,
    setLeagueName,
    setNumberOfPlayers,
    setIsSubmitting,
    leagueAvatarColor,
  }: {
    leagueName: string;
    leagueAvatar: string;
    players: Player[];
    handleHome: () => void;
    setPlayers: (players: Player[]) => void;
    setLeagueAvatar: (avatar: string) => void;
    setLeagueName: (name: string) => void;
    setNumberOfPlayers: (number: string) => void;
    setIsSubmitting: (submitting: boolean) => void;
    leagueAvatarColor: string;
  }) => {
    try {
      setIsSubmitting(true);

      // Check if user is authenticated
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        Alert.alert("Error", "You must be logged in to create a league");
        setIsSubmitting(false);
        return;
      }

      // Upload league avatar (only if provided)
      let uploadedLeagueAvatar: string | null = null;
      if (leagueAvatar && leagueAvatar.trim() !== "") {
        const uploadLeagueAvatar = async (): Promise<string | null> => {
          const path = `leagues/${uuidv4()}.jpg`;
          return await uploadImage(leagueAvatar, path);
        };

        uploadedLeagueAvatar = await uploadLeagueAvatar();
        if (!uploadedLeagueAvatar) {
          Alert.alert("Error", "Failed to upload league avatar");
          setIsSubmitting(false);
          return;
        }
      }

      // Upload player avatars and get updated players
      const uploadPlayersAvatars = async () => {
        const updatedPlayers = [...players];

        for (let i = 0; i < updatedPlayers.length; i++) {
          const player = updatedPlayers[i];

          // Only upload if player has an image
          if (player.image && player.image.trim() !== "") {
            const path = `players/${uuidv4()}.jpg`;
            const uploadedUrl = await uploadImage(player.image, path);
            if (uploadedUrl) {
              updatedPlayers[i] = { ...player, image: uploadedUrl };
            } else {
              Alert.alert(
                "Error",
                `Failed to upload avatar for ${player.name}`
              );
              setIsSubmitting(false);
              return null;
            }
          } else {
            // Set a default avatar URL or keep empty string
            updatedPlayers[i] = { ...player, image: "" };
          }
        }

        return updatedPlayers;
      };

      const updatedPlayers = await uploadPlayersAvatars();
      if (!updatedPlayers) {
        return; // Error already handled above
      }

      // Create league
      const { data: league, error: leagueError } = await supabase
        .from("leagues")
        .insert({
          name: leagueName,
          created_by: user.user.id,
          image_url: uploadedLeagueAvatar,
          avatar_color: leagueAvatarColor,
        })
        .select()
        .single();

      if (leagueError || !league) {
        console.error("Failed to create league:", leagueError);
        Alert.alert("Error", "Failed to create league");
        setIsSubmitting(false);
        return;
      }

      // Process players - now directly inserting into league_players
      for (const player of updatedPlayers) {
        const normalizedEmail = player.email.trim().toLowerCase();

        // Check if player already exists in this league
        const { data: existingLeaguePlayer, error: fetchError } = await supabase
          .from("league_players")
          .select("id, user_id")
          .eq("league_id", league.id)
          .eq("invite_email", normalizedEmail)
          .maybeSingle();

        if (fetchError) {
          console.error(
            `Error checking existing league player ${player.name}:`,
            fetchError
          );
          continue;
        }

        if (existingLeaguePlayer) {
          // Update existing league player
          const updates: any = {};

          // Update user_id if this is the current user's email and it's missing
          if (
            normalizedEmail === user.user.email?.toLowerCase() &&
            !existingLeaguePlayer.user_id
          ) {
            updates.user_id = user.user.id;
          }

          // Update avatar_url if player has a new image
          if (player.image && player.image.trim() !== "") {
            updates.avatar_url = player.image;
          }

          // Update display_name and player_color
          updates.display_name = player.name;
          updates.player_color = player.color || "#6B7280";

          const { error: updateError } = await supabase
            .from("league_players")
            .update(updates)
            .eq("id", existingLeaguePlayer.id);

          if (updateError) {
            console.error(
              `Failed to update league player ${player.name}:`,
              updateError
            );
          }
        } else {
          // Check if this email is associated with any existing user account
          let userIdToLink: string | null = null;

          if (normalizedEmail === user.user.email?.toLowerCase()) {
            // Current user
            userIdToLink = user.user.id;
          } else {
            // Check if this email exists in any league_players with a user_id
            const { data: existingUserPlayer, error: userCheckError } =
              await supabase
                .from("league_players")
                .select("user_id")
                .eq("invite_email", normalizedEmail)
                .not("user_id", "is", null)
                .maybeSingle();

            if (!userCheckError && existingUserPlayer?.user_id) {
              userIdToLink = existingUserPlayer.user_id;
            }
          }

          // Insert new league player
          const { data: newLeaguePlayer, error: insertError } = await supabase
            .from("league_players")
            .insert({
              league_id: league.id,
              display_name: player.name,
              invite_email: normalizedEmail,
              avatar_url: player.image || null,
              player_color: player.color || "#6B7280",
              user_id: userIdToLink,
            })
            .select()
            .single();

          if (insertError || !newLeaguePlayer) {
            console.error(
              `Failed to insert league player ${player.name}:`,
              insertError
            );
            continue;
          }
        }
      }
      // Send welcome emails to players
      const emailPromises = players
        .filter((player) => player.email)
        .map(async (player) => {
          try {
            await sendEmail({
              to: player.email,
              subject: `You've been added to ${leagueName}`,
              html: `
              <p>You've been added to ${leagueName} by ${user.user.email}.</p>
              <p>You can view the league and manage your settings by downloading the Club Season app in the app store.</p>
              `,
            });
          } catch (error) {
            console.error(`Failed to send email to ${player.email}:`, error);
            // Don't fail the entire operation if email fails
          }
        });

      // Wait for all emails to be sent (but don't fail if some fail)
      await Promise.allSettled(emailPromises);

      setPlayers([]);
      setLeagueAvatar("");
      setLeagueName("");
      setNumberOfPlayers("");

      // Trigger all necessary refreshes
      triggerSelectedLeagueRefresh();
      triggerLeaderboardRefresh();
      triggerRoundsRefresh();

      Alert.alert("Success", "League created successfully");
      handleHome();
    } catch (error) {
      console.error("Error creating league:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createLeague };
};
