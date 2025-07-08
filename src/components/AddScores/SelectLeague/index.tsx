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
          width="$18"
          value={search}
          onChangeText={setSearch}
          onFocus={() => setIsSearching(true)}
          onBlur={() => setIsSearching(false)}
        />
        {isSearching && (
          <ScrollView width="$18">
            <YStack
              gap="$4"
              width="$18"
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
        width="$18"
        onPress={() => {
          if (leagueId) {
            setCurrentStep("select-golf-course");
          } else {
            Alert.alert("Please select a league");
          }
        }}
      >
        Submit League
      </Button>
    </YStack>
  );
}
