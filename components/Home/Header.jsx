import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
// import { useUser } from "@clerk/clerk-expo";
import { Colors } from "../../constants/Colors";
import avatar from "../../assets/images/avatar.png";

import Ionicons from "@expo/vector-icons/Ionicons";
export default function Header() {  return (
    <View
      style={{
        padding: 20,
        paddingTop: 40,
        height: 200,
        marginBottom: 9,
        backgroundColor: "#fff",
        // background: Image.resolveAssetSource(
        //   require("../../assets/images/dddepth-345.jpg")
        // ),

        backgroundSize: "cover",
        backgroundPosition: "center",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 3,
        // },
        // shadowOpacity: 0.29,
        // shadowRadius: 4.65,
        // elevation: 7,
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
            // source={{ uri: user?.imageUrl }}
            source={avatar}
            style={{
              width: 45,
              height: 45,
              borderRadius: 99,
            }}
          />
          <View>
            <Text style={{ color: "#000" }}>Gd Day,</Text>
            <Text
              style={{
                fontSize: 19,
                // fontFamily: "roboto-medium",
                fontWeight:"bold",
                color: "#000",
              }}
            >
              Akalanka Dias
            </Text>

            {/* <Text>{user?.fullName}</Text> */}
          </View>
        </View>
        {/* Notifications */}
        <TouchableOpacity activeOpacity={0.5}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color= {Colors.secondaryColor}

            style={{
              // padding: 2,
              // borderWidth: 0.5,
              // borderColor: "#fff",
              // backgroundColor: "#fff",
              borderRadius: 99,

              margin: 5,
              // shadowColor: "rgba(149, 157, 165, 0.2)", // Shadow color
              // shadowOffset: {
              //   width: 0,
              //   height: 2,
              // },
              // // shadowOpacity: 0.25,
              // // shadowRadius: 3.84,
              // elevation: 5, // Elevation for Android
            }}
          />
          <View />
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
            fontFamily: "roboto",
            fontSize: 16,
            color: "#BCBCBC",
          }}
        ></TextInput>
      </View>
    </View>
  );
}
