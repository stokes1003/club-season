import { Alert } from "react-native";
import { supabase } from "src/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "src/api/uploadImage";

interface Player {
  name: string;
  image: string;
  email: string;
  color: string;
}

export const useCreateLeague = () => {
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
            const path = `players/${player.name}.jpg`;
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

      // Process players - insert directly into league_players table
      for (const player of updatedPlayers) {
        const normalizedEmail = player.email.trim().toLowerCase();

        // Check if this email is already associated with a user_id in league_players
        let userIdToUse: string | null = null;

        if (normalizedEmail === user.user.email?.toLowerCase()) {
          // If it's the current user's email, use their user_id
          userIdToUse = user.user.id;
        } else {
          // Check if this email exists in any league_players record with a user_id
          const { data: existingPlayer, error: fetchError } = await supabase
            .from("league_players")
            .select("user_id")
            .eq("invite_email", normalizedEmail)
            .not("user_id", "is", null)
            .maybeSingle();

          if (fetchError) {
            console.error(
              `Error checking existing player for email ${normalizedEmail}:`,
              fetchError
            );
          } else if (existingPlayer?.user_id) {
            userIdToUse = existingPlayer.user_id;
          }
          // If not found, user_id will remain null - they can link their account later
        }

        // Insert player directly into league_players table
        const { error: insertError } = await supabase
          .from("league_players")
          .insert({
            league_id: league.id,
            display_name: player.name,
            avatar_url: player.image || null,
            player_color: player.color || "#6B7280",
            user_id: userIdToUse,
            invite_email: normalizedEmail,
          });

        if (insertError) {
          console.error(
            `Failed to insert player ${player.name} into league:`,
            insertError
          );
        }
      }

      setPlayers([]);
      setLeagueAvatar("");
      setLeagueName("");
      setNumberOfPlayers("");

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
