import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { NotificationProvider } from "../context/notificationContext"; 
import LoadingScreen from "../components/LoadingScreen";
import { Stack } from "expo-router";
import MainLayout from "./MainLayout";


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