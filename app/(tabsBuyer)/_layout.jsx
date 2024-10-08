import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import AnimatedTabBar from "../../components/AnimatedTabBar";
import Lottie from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BuyerTabLayout() {
  return (
    <>
      <StatusBar style="dark" translucent />
      <Tabs
        screenOptions={{
          headerShown: false, // hide the header
          tabBarStyle: { backgroundColor: "white" },
          tabBarLabelStyle: { display: "none" }, // Hide labels if you want only icons
          tabBarIconStyle: { width: 36, height: 36 }, // Set icon size if needed
        }}
        tabBar={(props) => <AnimatedTabBar {...props} />}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bids"
          options={{
            headerShown: true, // hide the header
            title: "Ongoing Bids",
            tabBarIcon: ({ color }) => (
              <Ionicons name="briefcase-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = {
  lottieIcon: {
    width: 25, // Adjust the size according to your design
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
