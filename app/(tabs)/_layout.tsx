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
  ArrowLeft,
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
              <View p="$2" style={{ backgroundColor: "#e5e5e5" }}>
                <Text fontSize="$6" style={{ textAlign: "center" }}>
                  {currentRoute === "/Stats" ? "My Stats" : "My Career"}
                </Text>
              </View>
            </Pressable>

            {user?.leagues?.map((league, index) => (
              <Pressable
                key={league.id}
                onPress={() => handleSelectLeague(league)}
              >
                <View
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e5e5e5",
                  }}
                  p="$2"
                >
                  <Text fontSize="$6" style={{ textAlign: "center" }}>
                    {league.name}
                  </Text>
                </View>
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
                      <ChevronUp size={22} />
                    ) : (
                      <ChevronDown size={22} />
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
                      <ChevronUp size={22} />
                    ) : (
                      <ChevronDown size={22} />
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
                        onPress={() => {
                          navigateBack();
                        }}
                      >
                        <ArrowLeft size={22} />
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
            tabBarLabel: "",
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
