import { Tabs, Text, View } from "tamagui";

export function NetGrossTabs({
  isNet,
  setIsNet,
}: {
  isNet: boolean;
  setIsNet: (isNet: boolean) => void;
}) {
  return (
    <View>
      <Tabs
        value={isNet ? "net" : "gross"}
        onValueChange={(value) => setIsNet(value === "net")}
      >
        <Tabs.List>
          <Tabs.Tab value="net">
            <View
              width="$6"
              height="$3"
              borderBottomWidth={4}
              borderColor={isNet ? "$blue10" : "$borderColor"}
              style={{ alignItems: "center" }}
            >
              <Text fontSize="$6">Net</Text>
            </View>
          </Tabs.Tab>

          <Tabs.Tab value="gross">
            <View
              width="$6"
              height="$3"
              borderBottomWidth={4}
              borderColor={!isNet ? "$blue10" : "$borderColor"}
              style={{ alignItems: "center" }}
            >
              <Text fontSize="$6">Gross</Text>
            </View>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </View>
  );
}
