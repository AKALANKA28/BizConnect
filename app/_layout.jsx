import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { useFonts } from "expo-font";
import { NotificationProvider } from '../context/notificationContext'; // Import the NotificationProvider

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasOnboarded, setHasOnboarded] = useState(null); // Local state to track onboarding status

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboarded = await AsyncStorage.getItem("hasOnboarded");
        setHasOnboarded(onboarded === "true");
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
      }
    };

    if (typeof isAuthenticated !== "undefined") {
      checkOnboardingStatus(); // Check if user has completed onboarding
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof isAuthenticated === "undefined" || hasOnboarded === null) return; // Wait for both isAuthenticated and hasOnboarded to load

    const inApp = segments[0] === "(tabsBuyer)";

    // Handle navigation logic
    if (isAuthenticated && !hasOnboarded) {
      // Redirect to onboarding if user hasn't completed it
      router.replace("/Index");
    } else if (isAuthenticated && !inApp) {
      // Redirect to home if the user is authenticated and has completed onboarding
      router.replace("/home"); // Adjust to your home route
    } else if (isAuthenticated === false) {
      // Redirect to login
      router.replace("/Index");
    }
  }, [isAuthenticated, hasOnboarded]);
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated.");
      console.log("User details:", user);
    } else {
      console.log("User is not authenticated.");
    }
  }, [isAuthenticated, user]);
  return <Slot />;
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "roboto": require("../assets/fonts/Roboto-Regular.ttf"),
    "roboto-medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "roboto-bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "roboto-black": require("../assets/fonts/Roboto-Black.ttf"),

    "poppins": require("../assets/fonts/Poppins-Regular.ttf"),
    "poppins-semibold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContextProvider>
      <NotificationProvider>
        <MainLayout />
      </NotificationProvider>
    </AuthContextProvider>
  );
}
