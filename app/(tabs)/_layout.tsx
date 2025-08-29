import { Tabs } from "expo-router";
import { Avatar, useTheme, YStack, Text, XStack, View, Card } from "tamagui";
import {
  ChevronDown,
  House,
  LandPlot,
  Plus,
  User,
  ChevronUp,
  ChartNoAxesCombined,
  ArrowLeft,
  CircleUserRound,
} from "@tamagui/lucide-icons";
import { useUser } from "../../src/context/UserContext";
import { useState } from "react";
import { useSelectedLeague } from "../../src/context/SelectedLeagueContext";
import { usePathname } from "expo-router";
import { Pressable } from "react-native";
import { useNavigation } from "../../src/context/NavigationContext";

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
  const {
    navigateBack,
    setCurrentProfileState,
    currentProfileState,
    currentMyLeaguesState,
  } = useNavigation();

  const handleSelectLeague = (league: League | null) => {
    setSelectedLeague(league as League);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998, // Below the dropdown
          }}
          onPress={() => setIsOpen(false)}
        >
          <YStack
            position="absolute"
            width="100%"
            gap="$2"
            px="$2"
            pb="$4"
            style={{
              zIndex: 9999,
              top: 100,
              left: "19.5%",
              transform: [{ translateX: -80 }],
              backgroundColor: theme?.background?.val || "$background",
            }}
          >
            <Pressable onPress={() => handleSelectLeague(null)}>
              <Card p="$2" backgroundColor="$background">
                <Text fontSize="$6" style={{ textAlign: "center" }}>
                  {currentRoute === "/Stats" ? "My Stats" : "Home"}
                </Text>
              </Card>
            </Pressable>

            {user?.leagues?.map((league, index) => (
              <Pressable
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{ padding: 4 }}
                key={league.id}
                onPress={() => handleSelectLeague(league)}
              >
                <Card
                  p="$2"
                  backgroundColor={
                    index % 2 === 0 ? "$background02" : "$background"
                  }
                >
                  <Text fontSize="$6" style={{ textAlign: "center" }}>
                    {league.name}
                  </Text>
                </Card>
              </Pressable>
            ))}
          </YStack>
        </Pressable>
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
              <Pressable
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{ padding: 4 }}
                onPress={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <YStack style={{ alignItems: "center" }}>
                  <XStack gap="$2" style={{ alignItems: "center" }}>
                    <Text
                      fontSize="$5"
                      fontWeight="bold"
                      style={{ textAlign: "center" }}
                    >
                      {selectedLeague?.name || "Home"}
                    </Text>
                    {isOpen ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </XStack>
                </YStack>
              </Pressable>
            ),
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <House color={color as any} />,
          }}
        />

        <Tabs.Screen
          name="Stats"
          options={{
            headerTitle: () => (
              <Pressable
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{ padding: 4 }}
                onPress={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <YStack style={{ alignItems: "center" }}>
                  <XStack gap="$2" style={{ alignItems: "center" }}>
                    <Text
                      fontWeight="bold"
                      fontSize="$5"
                      style={{ textAlign: "center" }}
                    >
                      {selectedLeague?.name || "My Stats"}
                    </Text>
                    {isOpen ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </XStack>
                </YStack>
              </Pressable>
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

            headerLeft:
              currentMyLeaguesState.type !== "dashboard"
                ? () => (
                    <View pl="$7">
                      <Pressable
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        style={{ padding: 4 }}
                        onPress={() => {
                          navigateBack();
                        }}
                      >
                        <ArrowLeft size={24} />
                      </Pressable>
                    </View>
                  )
                : undefined,
            headerTitle: "My Leagues",

            tabBarIcon: ({ color }) => <LandPlot color={color as any} />,
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            headerTitle: () => (
              <Text fontWeight="bold" fontSize="$5">
                Profile
              </Text>
            ),
            tabBarLabel: "Account",
            headerLeft:
              currentProfileState !== "profile"
                ? () => (
                    <View pl="$2">
                      <Pressable
                        onPress={() => {
                          setCurrentProfileState("profile");
                        }}
                      >
                        <ArrowLeft size={22} />
                      </Pressable>
                    </View>
                  )
                : undefined,

            tabBarIcon: ({ color }) => <CircleUserRound color={color as any} />,
          }}
        />
      </Tabs>
    </>
  );
}
