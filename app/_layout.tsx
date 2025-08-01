import "react-native-get-random-values";
import "../tamagui-web.css";

import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Provider } from "../src/Provider";
import { useTheme } from "tamagui";
import { UserProvider, useUser } from "../src/context/UserContext";
import Auth from "../src/components/Auth";
import { LeaderboardProvider } from "../src/context/LeaderboardContext";
import { OfficalRoundsProvider } from "../src/context/OfficalRoundsContext";
import { SelectedLeagueProvider } from "../src/context/SelectedLeagueContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <UserProvider>
        <LeaderboardProvider>
          <OfficalRoundsProvider>
            <SelectedLeagueProvider>{children}</SelectedLeagueProvider>
          </OfficalRoundsProvider>
        </LeaderboardProvider>
      </UserProvider>
    </Provider>
  );
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const { user, session, loading } = useUser();

  if (loading) {
    return null; // Or a loading screen
  }

  if (!session || !user) {
    return <Auth />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            title: "Tamagui + Expo",
            presentation: "modal",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme?.background?.val || "#ffffff",
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
