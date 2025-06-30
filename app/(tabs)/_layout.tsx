import { Link, Tabs } from "expo-router";
import { Button, useTheme } from "tamagui";
import { Atom, AudioWaveform } from "@tamagui/lucide-icons";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme?.red10?.val || "#ff0000",
        tabBarStyle: {
          backgroundColor: theme?.background?.val || "#ffffff",
          borderTopColor: theme?.borderColor?.val || "#e0e0e0",
        },
        headerStyle: {
          backgroundColor: theme?.background?.val || "#ffffff",
          borderBottomColor: theme?.borderColor?.val || "#e0e0e0",
        },
        headerTintColor: theme?.color?.val || "#000000",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Atom color={color as any} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Button mr="$4" bg="$green8" color="$green12">
                Home
              </Button>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="AddScores"
        options={{
          title: "Add A Score",
          tabBarIcon: ({ color }) => <AudioWaveform color={color as any} />,
        }}
      />
    </Tabs>
  );
}
