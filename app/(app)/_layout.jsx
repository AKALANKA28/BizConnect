import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      {/* Define other screens within the stack
    <Stack.Screen 
      name="welcome" 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="auth/signIn" 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="auth/signUp" 
      options={{ headerShown: false }} 
    /> */}

      {/* Reference the existing tab layout */}
      <Stack.Screen
        name="(tabsBuyer)"
        options={{ headerShown: false }} // Optionally hide the header
      />
      <Stack.Screen
        name="(tabsEntrepeneur)"
        options={{ headerShown: false }} // Optionally hide the header
      />
      {/* Add any other stack screens if needed */}
    </Stack>
  );
}
