import { Link, Tabs } from "expo-router";
import { Avatar, useTheme, YStack, Text, XStack, View } from "tamagui";
import {
  ChevronDown,
  House,
  LandPlot,
  Plus,
  Settings,
  User,
  ChevronUp,
} from "@tamagui/lucide-icons";
import { useUser } from "../../src/context/UserContext";
import { useState } from "react";
import { useSelectedLeague } from "../../src/context/SelectedLeagueContext";

export type League = {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
  image_url: string;
};

export default function TabLayout() {
  const theme = useTheme();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLeague, setSelectedLeague } = useSelectedLeague();

  const handleSelectLeague = (league: League | null) => {
    setSelectedLeague(league as League);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <YStack
          position="absolute"
          width="100%"
          gap="$2"
          borderWidth={1}
          borderColor="$black11"
          p="$2"
          style={{
            zIndex: 9999,
            top: 100,
            left: "20%",
            transform: [{ translateX: -80 }],
            backgroundColor: theme?.background?.val || "$background",
          }}
        >
          <View onPress={() => handleSelectLeague(null)}>
            <Text
              fontSize="$5"
              fontWeight="400"
              style={{ textAlign: "center" }}
            >
              All Leagues
            </Text>
          </View>

          {user?.leagues?.map((league) => (
            <View key={league.id} onPress={() => handleSelectLeague(league)}>
              <Text
                fontSize="$5"
                fontWeight="400"
                style={{ textAlign: "center" }}
              >
                {league.name}
              </Text>
            </View>
          ))}
        </YStack>
      )}
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
          headerTitle: () => (
            <YStack style={{ alignItems: "center" }}>
              <XStack
                gap="$2"
                style={{ alignItems: "center" }}
                onPress={() => setIsOpen(!isOpen)}
              >
                <Text fontSize="$6" style={{ textAlign: "center" }}>
                  {selectedLeague?.name || "All Leagues"}
                </Text>
                {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </XStack>
            </YStack>
          ),
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
    </>
  );
}
