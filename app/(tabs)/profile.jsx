import { View, Text } from "react-native";
import React from "react";
import UserIntro from "../../components/Profile/UserIntro";
import MenuList from "../../components/Profile/MenuList";

export default function profile() {
  return (
    <View styel={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 35,
          fontFamily: "roboto-bold",
          textTransform: "capitalize",
        }}
      >
        profile
      </Text>

      {/* User Info */}
      <UserIntro/>
  
      {/* Menu Item */}
      <MenuList/>
    </View>
  );
}
