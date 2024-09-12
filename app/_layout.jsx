import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { useFonts } from "expo-font";

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
  // console.log('Root layout is loading');

  const [fontsLoaded] = useFonts({
    'roboto': require('../assets/fonts/Roboto-Regular.ttf'),
    'roboto-medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'poppins': require('../assets/fonts/Poppins-Regular.ttf'),
    'poppins-semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'roboto-black': require('../assets/fonts/Roboto-Black.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <AuthContextProvider>
  
      <MainLayout />
    </AuthContextProvider>
  );
}
