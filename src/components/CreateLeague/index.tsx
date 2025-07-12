import { View, ScrollView } from "tamagui";
import { useState } from "react";
import { EnterLeagueName } from "./EnterLeagueName";
import { AddPlayers } from "./AddPlayers";
import { useRouter } from "expo-router";
import { CreateLeagueHeader } from "./CreateLeagueHeader";
import { ConfirmCreateLeague } from "./ConfirmCreateLeague";
import { useCreateLeague } from "app/hooks/useCreateLeague";

export function CreateLeague() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("league-name");
  const [leagueName, setLeagueName] = useState("");
  const [players, setPlayers] = useState([
    {
      name: "",
      image: "",
      email: "",
    },
  ]);
  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [leagueAvatar, setLeagueAvatar] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createLeague } = useCreateLeague();

  const handleHome = () => {
    router.push("/");
    setCurrentStep("select-league");
  };

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View mt="$8" gap="$8">
        <CreateLeagueHeader
          currentStep={currentStep}
          handleHome={handleHome}
          setCurrentStep={setCurrentStep}
          currentPlayerIndex={currentPlayerIndex}
          setCurrentPlayerIndex={setCurrentPlayerIndex}
        />
        {currentStep === "league-name" && (
          <EnterLeagueName
            leagueName={leagueName}
            setLeagueName={setLeagueName}
            numberOfPlayers={numberOfPlayers}
            setNumberOfPlayers={setNumberOfPlayers}
            setLeagueAvatar={setLeagueAvatar}
            leagueAvatar={leagueAvatar}
            onNextStep={() => {
              const numPlayers = Number(numberOfPlayers);
              const newPlayers = Array.from({ length: numPlayers }, () => ({
                name: "",
                image: "",
                email: "",
              }));
              setPlayers(newPlayers);
              setCurrentStep("add-players");
            }}
          />
        )}
        {currentStep === "add-players" && (
          <AddPlayers
            players={players}
            setPlayers={setPlayers}
            setCurrentStep={setCurrentStep}
            numberOfPlayers={numberOfPlayers}
            currentPlayerIndex={currentPlayerIndex}
            setCurrentPlayerIndex={setCurrentPlayerIndex}
          />
        )}
        {currentStep === "confirm-create-league" && (
          <ConfirmCreateLeague
            leagueName={leagueName}
            players={players}
            leagueAvatar={leagueAvatar}
            handleHome={handleHome}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
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
              });
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}
