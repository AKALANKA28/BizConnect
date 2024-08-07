import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Colors } from "../../constants/Colors";

import Ionicons from "@expo/vector-icons/Ionicons";
export default function Header() {
  const { user } = useUser();
  return (
    <View
      style={{
        padding: 20,
        paddingTop: 40,
        height: 190,
        marginBottom: 9,
        backgroundColor: Colors.secondaryColor,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,

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
          source={{ uri: user?.imageUrl }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 99,
          }}
        />

        <View>
          <Text style={{ color: "#000" }}>Welcome</Text>
          <Text
            style={{
              fontSize: 19,
              fontFamily: "roboto-medium",
              color: "#000",
            }}
          >
            Akalanka Dias
          </Text>

          {/* <Text>{user?.fullName}</Text> */}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: Colors.GRAY,
        
          padding: 10,
          borderRadius: 99,
          marginVertical: 10,
          marginTop: 15,
        }}
      >
        {/* Search Bar */}
        <Ionicons name="search" size={24} color= "black" />
        <TextInput
          placeholder="Search..."
          style={{
            fontFamily: "roboto-regular",
            fontSize: 16,
          }}
        ></TextInput>
      </View>
    </View>
  );
}
