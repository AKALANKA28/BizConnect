import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "../context/authContext";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated == "undefined") return;
    const inApp = segments[0] === "(tabs)";
    if (isAuthenticated && !inApp) {
      // Redirect to home
      router.replace("/OnBoarding");  // Replace this with the actual route to home
    } else if (isAuthenticated === false) {
      // Redirect to login
      router.replace("/userSelect");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  console.log('Root layout is loading');

  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
