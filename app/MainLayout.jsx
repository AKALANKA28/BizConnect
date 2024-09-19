import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/authContext";

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
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
    if (typeof isAuthenticated === "undefined" || hasOnboarded === null ) return; // Wait for both isAuthenticated and hasOnboarded to load

    const inApp = segments[0] === "(app)";
    
    // Handle navigation logic
    if (isAuthenticated && !hasOnboarded) {
      // Redirect to onboarding if user hasn't completed it
      router.replace("/OnBoarding");
    // } else if (isAuthenticated && !inApp) {
    //   // Redirect to home if the user is authenticated and has completed onboarding
    //   router.replace("/home");  // Adjust to your home route
    } else if (isAuthenticated === false) {
      // Redirect to login
      router.replace("/OnBoarding");
    }
  }, [isAuthenticated, hasOnboarded]);

  return <Slot />;
};