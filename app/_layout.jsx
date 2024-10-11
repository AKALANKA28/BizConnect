import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { NotificationProvider } from "../context/notificationContext"; 
import LoadingScreen from "../components/LoadingScreen";
import { Stack } from "expo-router";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [hasOnboarded, setHasOnboarded] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); // Add loading state for initialization

  // Function to check if the user has completed onboarding
  const checkOnboardingStatus = async () => {
    try {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      setHasOnboarded(onboarded === "true");
    } catch (error) {
      console.error("Failed to check onboarding status:", error);
    } finally {
      setIsLoading(false); // Loading is done after checking onboarding status
    }
  };

  // Check onboarding status once authentication status is resolved
  useEffect(() => {
    if (typeof isAuthenticated !== "undefined") {
      checkOnboardingStatus(); 
    }
  }, [isAuthenticated]);

  // Handle navigation based on authentication and onboarding
  useEffect(() => {
    if (isLoading || isAuthenticated === undefined || hasOnboarded === null) {
      return; // Wait until loading is done
    }

    // Navigation logic after loading is complete
    if (isAuthenticated && !hasOnboarded) {
      router.replace("/onboarding"); // Navigate to onboarding screen
    } else if (isAuthenticated) {
      router.replace("/onboarding"); // Navigate to home screen (use appropriate home screen path)
    } else {
      router.replace("/onboarding"); // Navigate to login if not authenticated
    }
  }, [isAuthenticated, hasOnboarded, isLoading]);

  // Prevent rendering until loading is complete
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers globally
      }}
    />
  );
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
    "lato": require("../assets/fonts/Lato-Regular.ttf"),
    "lato-bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  // Wait until fonts are loaded
  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <AuthContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationProvider>
          <MainLayout />
        </NotificationProvider>
      </GestureHandlerRootView>
    </AuthContextProvider>
  );
}
