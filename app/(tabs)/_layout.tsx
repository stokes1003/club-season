import { Tabs } from "expo-router";
import { Avatar, useTheme, YStack, Text, XStack, View } from "tamagui";
import {
  ChevronDown,
  House,
  LandPlot,
  Plus,
  User,
  ChevronUp,
  ChartNoAxesCombined,
} from "@tamagui/lucide-icons";
import { useUser } from "../../src/context/UserContext";
import { useState } from "react";
import { useSelectedLeague } from "../../src/context/SelectedLeagueContext";
import { usePathname } from "expo-router";

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
  const currentRoute = usePathname();

  const handleSelectLeague = (league: League | null) => {
    setSelectedLeague(league as League);
    setIsOpen(false);
  };
  console.log(currentRoute);

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
          <View
            onPress={() => handleSelectLeague(null)}
            pressStyle={{ background: "$gray5" }}
          >
            <Text fontSize="$6" style={{ textAlign: "center" }}>
              {currentRoute === "/Stats" ? "My Stats" : "My Career"}
            </Text>
          </View>

          {user?.leagues?.map((league) => (
            <View
              key={league.id}
              onPress={() => handleSelectLeague(league)}
              pressStyle={{ background: "$gray5" }}
            >
              <Text fontSize="$6" style={{ textAlign: "center" }}>
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
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: () => (
              <YStack style={{ alignItems: "center" }}>
                <XStack
                  gap="$2"
                  style={{ alignItems: "center" }}
                  onPress={() => setIsOpen(!isOpen)}
                  pressStyle={{ background: "$gray5" }}
                >
                  <Text
                    fontSize="$5"
                    fontWeight="bold"
                    style={{ textAlign: "center" }}
                  >
                    {selectedLeague?.name || "My Career"}
                  </Text>
                  {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </XStack>
              </YStack>
            ),

            tabBarIcon: ({ color }) => <House color={color as any} />,
          }}
        />

        <Tabs.Screen
          name="Stats"
          options={{
            headerTitle: () => (
              <YStack style={{ alignItems: "center" }}>
                <XStack
                  gap="$2"
                  style={{ alignItems: "center" }}
                  onPress={() => setIsOpen(!isOpen)}
                  pressStyle={{ background: "$gray5" }}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="$5"
                    style={{ textAlign: "center" }}
                  >
                    {selectedLeague?.name || "My Stats"}
                  </Text>
                  {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </XStack>
              </YStack>
            ),

            tabBarIcon: ({ color }) => (
              <ChartNoAxesCombined color={color as any} />
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
          name="My Leagues"
          options={{
            title: "My Leagues",

            tabBarIcon: ({ color }) => <LandPlot color={color as any} />,
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",

            tabBarIcon: ({ color }) =>
              user ? (
                <Avatar circular size="$3" mt="$3">
                  <Avatar.Image
                    src={user.avatar_url ?? "https://via.placeholder.com/40"}
                    accessibilityLabel="User avatar"
                  />
                </Avatar>
              ) : (
                <User color={color as any} />
              ),
          }}
        />
      </Tabs>
    </>
  );
}
