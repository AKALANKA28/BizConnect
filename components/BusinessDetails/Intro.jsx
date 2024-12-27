import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";

export default function Intro({ business }) {
  const router = useRouter();

  return (
    <View style={{ backgroundColor: Colors.primaryColor, }}>
      {/* Back Button */}
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          padding: 20,
          top: 32,
          left: 10,
          right: 10, // Ensure the full width is used
          flexDirection: "row", // Arrange items horizontally
          justifyContent: "space-between", // Push icons to the left and right
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        {/* Left Arrow Icon */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
            padding: 8, // Padding around the icon
            borderRadius: 20, // Makes it circular
          }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Right Heart Icon */}
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
            padding: 8, // Padding around the icon
            borderRadius: 20, // Makes it circular
          }}
        >
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Image Container with Margin */}
      <View
        style={{
          marginHorizontal: 20, // Add margin on both sides
          marginTop: 40, // Add margin on top
          marginBottom: 40, // Add margin on bottom
        }}
      >
        <Image
          source={{ uri: business.imageUrl }}
          style={{
            width: "100%",
            height: 600,
            borderRadius: 26, // Optional: Add rounded corners to the image
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 20,
            elevation: 7,
          }}
          resizeMode="cover"
        />

        
      </View>

      {/* Business Details Section */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 10,

          marginTop: -20,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(22),
            fontFamily: "lato-bold",
            textTransform: "capitalize",
          }}
        >
          {business.name}
        </Text>
        {/* Uncomment this to display the address */}
        {/* <Text style={{ fontSize: 18, fontFamily: "roboto" }}>
          {business.address}
        </Text> */}
      </View>

      {/* Display other business data here */}
    </View>
  );
}
