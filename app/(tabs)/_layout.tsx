import { Link, Tabs } from "expo-router";
import { Avatar, useTheme } from "tamagui";
import { House, LandPlot, Plus, Settings, User } from "@tamagui/lucide-icons";
import { useUser } from "../../src/context/UserContext";

export default function TabLayout() {
  const theme = useTheme();
  const { user } = useUser();

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

        // ✅ Avatar in top-right corner on all screens
        headerRight: () =>
          user ? (
            <Link href="/Profile" asChild>
              <Avatar circular size="$3" mr="$4" mb="$2">
                <Avatar.Image
                  src={user.avatar_url ?? "https://via.placeholder.com/40"}
                  accessibilityLabel="User avatar"
                />
              </Avatar>
            </Link>
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="My Leagues"
        options={{
          title: "My Leagues",
          tabBarIcon: ({ color }) => <LandPlot color={color as any} />,
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
