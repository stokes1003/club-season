import { View, ScrollView } from "tamagui";
import { useState } from "react";
import { EnterLeagueName } from "./EnterLeagueName";
import { AddPlayers } from "./AddPlayers";
import { useRouter } from "expo-router";
import { ConfirmCreateLeague } from "./ConfirmCreateLeague";
import { useCreateLeague } from "src/hooks/useCreateLeague";
import { useNavigation } from "src/context/NavigationContext";

export function CreateLeague() {
  const { setCreateLeagueState, createLeagueState } = useNavigation();
  const router = useRouter();
  const [leagueName, setLeagueName] = useState("");
  const [players, setPlayers] = useState([
    {
      name: "",
      image: "",
      email: "",
      color: "#6B7280",
      role: "player",
    },
  ]);
  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [leagueAvatar, setLeagueAvatar] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leagueAvatarColor, setLeagueAvatarColor] = useState<string>("#6B7280");
  const { createLeague } = useCreateLeague();

  const handleHome = () => {
    router.push("/(tabs)/My Leagues");
    setCreateLeagueState({
      step: "league-name",
      playerIndex: createLeagueState.playerIndex,
    });
  };

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View mt="$8" gap="$8" width="100%">
        {createLeagueState.step === "league-name" && (
          <EnterLeagueName
            leagueName={leagueName}
            setLeagueName={setLeagueName}
            numberOfPlayers={numberOfPlayers}
            setNumberOfPlayers={setNumberOfPlayers}
            setLeagueAvatar={setLeagueAvatar}
            leagueAvatar={leagueAvatar}
            leagueAvatarColor={leagueAvatarColor}
            setLeagueAvatarColor={setLeagueAvatarColor}
            setPlayers={setPlayers}
          />
        )}
        {createLeagueState.step === "add-players" && (
          <AddPlayers
            players={players}
            setPlayers={setPlayers}
            numberOfPlayers={numberOfPlayers}
          />
        )}
        {createLeagueState.step === "confirm-create-league" && (
          <ConfirmCreateLeague
            leagueName={leagueName}
            players={players}
            leagueAvatar={leagueAvatar}
            leagueAvatarColor={leagueAvatarColor}
            handleHome={handleHome}
            isSubmitting={isSubmitting}
            handleCreateLeague={() => {
              createLeague({
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
              });
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}
