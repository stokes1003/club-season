import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission denied");
        Alert.alert(
          "Location Permission",
          "This app needs location access to find nearby golf courses.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settings",
              onPress: () => {},
            },
          ]
        );
        return false;
      }

      return true;
    } catch (err) {
      setError("Failed to request location permission");
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || undefined,
        timestamp: currentLocation.timestamp,
      });
    } catch (err) {
      setError("Failed to get location");
      console.error("Location error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLocationOnce = async () => {
    if (!location) {
      await getCurrentLocation();
    }
    return location;
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    getLocationOnce,
    requestLocationPermission,
  };
}
