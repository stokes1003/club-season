import { YStack, Text, Button, Input, ScrollView } from "tamagui";
import { Alert } from "react-native";
import { useUser } from "../../../context/UserContext";
import { useMemo, useState } from "react";

export function SelectLeague({
  setLeagueId,
  setCurrentStep,
  leagueId,
}: {
  setLeagueId: (id: string) => void;
  setCurrentStep: (step: string) => void;
  leagueId: string;
}) {
  const { user } = useUser();
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const filteredLeagues = useMemo(
    () =>
      user?.leagues?.filter((league) =>
        league.name.toLowerCase().includes(search.toLowerCase())
      ),
    [user?.leagues, search]
  );

  const leagueCommissioner = user?.leagues?.find(
    (league) => league.id === leagueId
  )?.created_by;

  console.log(leagueCommissioner);
  console.log(user?.id);

  const handleSubmitLeague = () => {
    if (leagueCommissioner !== user?.id) {
      Alert.alert("You are not the commissioner of this league");
      return;
    }
    if (leagueId) {
      setCurrentStep("select-golf-course");
    } else {
      Alert.alert("Please select a league");
    }
  };

  return (
    <YStack gap="$8" style={{ alignItems: "center" }}>
      <YStack style={{ alignItems: "center" }}>
        <Text fontWeight="bold" fontSize="$8">
          Select League
        </Text>
      </YStack>
      <YStack gap="$2">
        <Input
          placeholder="Search for a league"
          width="$20"
          value={search}
          onChangeText={setSearch}
          onFocus={() => setIsSearching(true)}
          onBlur={() => setIsSearching(false)}
        />
        {isSearching && (
          <ScrollView width="$20">
            <YStack
              gap="$4"
              width="$20"
              borderWidth={1}
              borderColor="$black11"
              p="$3"
              style={{ borderRadius: 8 }}
            >
              {filteredLeagues?.map((league) => (
                <Text
                  key={league.id}
                  fontSize="$5"
                  onPress={() => {
                    setLeagueId(league.id);
                    setSearch(league.name);
                    setIsSearching(false);
                  }}
                >
                  {league.name}
                </Text>
              ))}
            </YStack>
          </ScrollView>
        )}
      </YStack>
      <Button
        bg="$blue10"
        color="$white1"
        fontSize="$5"
        fontWeight="bold"
        width="$20"
        onPress={handleSubmitLeague}
      >
        Submit League
      </Button>
    </YStack>
  );
}
