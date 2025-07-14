import { Link, Tabs } from "expo-router";
import { Avatar, useTheme, YStack, Text, XStack } from "tamagui";
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

export default function TabLayout() {
  const theme = useTheme();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <YStack
          position="absolute"
          width="$16"
          gap="$2"
          borderWidth={1}
          borderColor="$black11"
          background="$background"
          p="$3"
          style={{
            borderRadius: 8,
            zIndex: 9999,
            top: 100,
            left: "50%",
            transform: [{ translateX: -80 }],
          }}
        >
          {user?.leagues?.map((league) => (
            <Text fontSize="$5" key={league.id}>
              {league.name}
            </Text>
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
                <Text fontSize="$6">All Leagues</Text>
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
