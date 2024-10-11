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
  const segments = useSegments();
  const router = useRouter();
  const [hasOnboarded, setHasOnboarded] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboarded = await AsyncStorage.getItem("hasOnboarded");
        setHasOnboarded(onboarded === "true");
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
      } finally {
        setIsLoading(false); // Set loading to false once the check is done
      }
    };

    if (typeof isAuthenticated !== "undefined") {
      checkOnboardingStatus(); 
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading || isAuthenticated === undefined || hasOnboarded === null) return; // Wait for loading and checks

    // Navigation logic based on authentication and onboarding status
    if (isAuthenticated && !hasOnboarded) {
      router.replace("/Index"); // Redirect to onboarding
    } 
    else if (isAuthenticated) {
      router.replace("/Index"); // Redirect to home
    } else {
      router.replace("/Index"); // Redirect to login
    }
  }, [isAuthenticated, hasOnboarded, isLoading]);

  // Prevent rendering the stack until loading is complete
  if (isLoading) return <LoadingScreen />; 

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header globally
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
