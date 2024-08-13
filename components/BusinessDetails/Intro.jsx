import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
export default function Intro({ business }) {
  const router = useRouter();
  return (
    <View>
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          padding: 20,
          top: 17,
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: business.imageUrl }}
        style={{ width: "100%", height: 350 }}
      />

      <View
        style={{
          padding: 20,
          marginTop: -20,
          backgroundColor: "#fff",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,

        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontFamily: "roboto-bold",
            textTransform: "capitalize",
          }}
        >
          {business.name}
        </Text>
        <Text style={{ fontSize: 18, fontFamily: "roboto" }}>
          {business.address}
        </Text>
      </View>

      {/* Display other business data here */}
    </View>
  );
}
