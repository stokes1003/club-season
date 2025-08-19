import { YStack, Text, Tabs, View, Input } from "tamagui";

export function MajorTournamentSelector({
  isMajor,
  setIsMajor,
  majorName,
  setMajorName,
}: {
  isMajor: string;
  setIsMajor: (isMajor: string) => void;
  majorName: string;
  setMajorName: (majorName: string) => void;
}) {
  return (
    <>
      <YStack gap="$4" style={{ alignItems: "center" }}>
        <Text fontSize="$7" fontWeight="bold">
          Is this round a Major?
        </Text>
        <YStack>
          <Tabs value={isMajor} onValueChange={setIsMajor}>
            <Tabs.List>
              <Tabs.Tab value="yes">
                <View
                  width="$4"
                  borderBottomWidth={4}
                  borderColor={isMajor === "yes" ? "$green10" : "$borderColor"}
                  style={{ alignItems: "center" }}
                >
                  <Text fontSize="$7">Yes</Text>
                </View>
              </Tabs.Tab>
              <Tabs.Tab value="no">
                <View
                  width="$4"
                  borderBottomWidth={4}
                  borderColor={isMajor === "no" ? "$blue10" : "$borderColor"}
                  style={{ alignItems: "center" }}
                >
                  <Text fontSize="$7">No</Text>
                </View>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </YStack>
      </YStack>
      {isMajor === "yes" && (
        <YStack>
          <Input
            width="$20"
            borderWidth={2}
            placeholder="Enter Major Name"
            value={majorName}
            onChangeText={setMajorName}
            fontSize="$5"
          />
        </YStack>
      )}
    </>
  );
}
