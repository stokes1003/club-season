import { Alert } from "react-native";
import { supabase } from "src/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "src/api/uploadImage";
import { useSelectedLeague } from "src/context/SelectedLeagueContext";

interface Player {
  name: string;
  image: string;
  email: string;
  color: string;
}

export const useCreateLeague = () => {
  const { triggerRefresh } = useSelectedLeague();
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

      // Process players
      for (const player of updatedPlayers) {
        const normalizedEmail = player.email.trim().toLowerCase();
        let playerId: string | null = null;

        // 1. Check if player already exists
        const { data: existing, error: fetchError } = await supabase
          .from("players")
          .select("id, user_id")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (fetchError) {
          console.error(
            `Error checking existing player ${player.name}:`,
            fetchError
          );
          continue;
        }

        if (existing) {
          playerId = existing.id;

          // 2. Update user_id if this is the current user's email and it's missing
          // AND update avatar_url if a new image is provided
          const updates: any = {};

          if (
            normalizedEmail === user.user.email?.toLowerCase() &&
            !existing.user_id
          ) {
            updates.user_id = user.user.id;
          }

          // Update avatar_url if player has a new image
          if (player.image && player.image.trim() !== "") {
            updates.avatar_url = player.image;
          }

          // Always update player_color for existing players
          updates.player_color = player.color || "#6B7280";

          if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
              .from("players")
              .update(updates)
              .eq("id", existing.id);

            if (updateError) {
              console.error(
                `Failed to update player ${player.name}:`,
                updateError
              );
            }
          }
        } else {
          // 3. Insert new player
          const { data: newPlayer, error: insertError } = await supabase
            .from("players")
            .insert({
              name: player.name,
              email: normalizedEmail,
              avatar_url: player.image || null,
              player_color: player.color || "#6B7280",
              user_id:
                normalizedEmail === user.user.email?.toLowerCase()
                  ? user.user.id
                  : null,
            })
            .select()
            .single();

          if (insertError || !newPlayer) {
            console.error(
              `Failed to insert player ${player.name}:`,
              insertError
            );
            continue;
          }

          playerId = newPlayer.id;
        }

        // 4. Link player to league
        const { error: lpError } = await supabase
          .from("league_players")
          .insert({
            league_id: league.id,
            player_id: playerId,
          });

        if (lpError) {
          console.error(
            `Failed to link player ${player.email} to league:`,
            lpError
          );
        }
      }

      setPlayers([]);
      setLeagueAvatar("");
      setLeagueName("");
      setNumberOfPlayers("");
      triggerRefresh();

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
