import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import LoginScreen from "../components/LoginScreen";
import { Text } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'roboto': require('../assets/fonts/Roboto-Regular.ttf'),
    'roboto-medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf')
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {/* <SignedIn> */}
      <Stack screenOptions={{
           headerShown: false,
           }}>
         <Stack.Screen name="(tabs)" />
      </Stack>
      {/* </SignedIn>

      <SignedOut>
        <LoginScreen />
      </SignedOut> */}
     
     
    </ClerkProvider>
   
  );
}
