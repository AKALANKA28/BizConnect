import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/authContext"; // Assuming AuthContext is in this path
import { Colors } from "../../constants/Colors";
import avatarPlaceholder from "../../assets/images/avatar.png"; // Default avatar

export default function Header() {
  const { user } = useAuth(); // Access the authenticated user from context

  // console.log(user);
  
  return (
    <View
      style={{
        padding: 20,
        paddingTop: 40,
        height: 200,
        marginBottom: 9,
        backgroundColor: "#fff",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={user?.photoURL ? { uri: user.photoURL } : avatarPlaceholder} // Show user's photo if available, otherwise default avatar
            style={{
              width: 45,
              height: 45,
              borderRadius: 99,
            }}
          />
          <View>
            <Text style={{ color: "#000" }}>Good Day,</Text>
            <Text
              style={{
                fontSize: 19,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              {user?.username || "Guest"} {/* Display user's name if available */}
            </Text>
          </View>
        </View>

        {/* Notifications */}
        <TouchableOpacity activeOpacity={0.5}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.secondaryColor}
            style={{
              margin: 5,
            }}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#EFEFEF",
          padding: 10,
          borderRadius: 99,
          marginVertical: 10,
          marginTop: 15,
        }}
      >
        {/* Search Bar */}
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          placeholder="Search..."
          style={{
            fontSize: 16,
            color: "#BCBCBC",
          }}
        />
      </View>
    </View>
  );
}
