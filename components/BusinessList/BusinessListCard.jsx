import { View, Text, Image } from "react-native";
import React from "react";
import {Colors} from "../../constants/Colors";

export default function BusinessListCard({ business }) {
  return (
    <View
      style={{
        padding: 10,
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 15,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Image
        source={{ uri: business?.imageUrl }}
        style={{ width: 120, height: 120, borderRadius: 15 }}
      />
      <View style={{flex: 1, gap: 5}}>
        <Text style={{ fontFamily: "roboto-bold", fontSize:20, textTransform: "capitalize" }}>{business.name}</Text>
        <Text style={{ fontFamily: "roboto",  color: Colors.GRAY, fontSize:15 }}>{business.address}</Text>

        <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 5,
            }}
          >
            <Image
              source={require("../../assets/images/star.png")}
              style={{
                width: 15,
                height: 15,
              }}
            />
            {/* <Text>{business?.rating}</Text> */}
            <Text style={{ color: Colors.GRAY, fontFamily: "roboto-bold" }}>
              4.5
            </Text>
          </View>
      </View>

    </View>
  );
}
