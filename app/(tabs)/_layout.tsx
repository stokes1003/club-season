import { Link, Tabs } from "expo-router";
import { Button, useTheme } from "tamagui";
import { House, Plus, Settings, User } from "@tamagui/lucide-icons";

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
          tabBarIcon: ({ color }) => <House color={color as any} />,
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
          title: "Add Scores",
          tabBarIcon: ({ color }) => <Plus color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color as any} />,
        }}
      />
    </Tabs>
  );
}
