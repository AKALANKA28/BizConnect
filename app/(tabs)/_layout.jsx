import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts } from "expo-font";
export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    'roboto': require('../../assets/fonts/Roboto-Regular.ttf'),
    'roboto-medium': require('../../assets/fonts/Roboto-Medium.ttf'),
    'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf')
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // hide the header
        tabBarActiveTintColor: Colors.secondaryColor,
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24}  color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addDetails"
        options={{
          title: "addDetails",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24}  color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="feed"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color }) => (
<MaterialCommunityIcons name="clipboard-text" size={25}color={color} />          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={24}  color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
