import { View, Text, Image } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

export default function PopularBusinessCards({ business }) {
  return (
    <View
      style={{
        padding: 10,
        marginLeft: 20,
        backgroundColor: "#fff",
        borderRadius: 15,
      }}
    >
      <Image
        source={{ uri: business?.imageUrl }}
        style={{
          width: 200,
          height: 130,
          borderRadius: 15,
        }}
      />
      <View style={{ marginTop: 7 }}>
        <Text
          style={{
            fontFamily: "roboto-bold",
            textTransform: "capitalize",
            fontSize: 17,
          }}
        >
          {business?.name}
        </Text>
        <Text
          style={{
            fontFamily: "roboto-bold",
            fontSize: 13,
            textTransform: "capitalize",
            color: Colors.GRAY,
          }}
        >
          {business?.address}
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
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
          <Text
            style={{
              fontFamily: "roboto-medium",
              backgroundColor: Colors.primaryColor,
              color: "#fff",
              paddingTop: 4,
              paddingBottom: 5,
              paddingLeft: 8,
              paddingRight: 8,
              borderRadius: 10,
              fontSize: 10,
              textTransform: "capitalize",
            }}
          >
            {business?.category}
          </Text>
        </View>
      </View>
    </View>
  );
}
