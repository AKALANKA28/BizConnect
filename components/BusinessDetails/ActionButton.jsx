import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";

export default function ActionButton() {
  const actionButtonMenu = [
    {
      id: 1,
      name: "Call",
    //   icon: require("./call-icon.png"), 
    //   url: "tel:" + business?.contact,
    },
    {
      id: 2,
      name: "Location",
    //   icon: require("./location-icon.png"),
    //   url:"https://www.google.com/maps/search/?api=1&query=" + business?.address,
    },
    {
      id: 3,
      name: "Web",
    //   icon: require("./web-icon.png"), 
    //   url: business?.web,
    },
    {
      id: 4,
      name: "Share",
    //   icon: require("./share-icon.png"),
    //   url: "tel:" + business?.contact,
    },
  ];

  const OnPressHandler = (item) => {
    if (item.name === "share") {
      return;
    }
    Linking.openURL(item?.url);
  };

  return (
    <View style={{ backgroundColor: "#fff", padding: "20", alignItems: "center" }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row",  justifyContent: "space-between", gap: 50,  }}
      >
        {actionButtonMenu.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => OnPressHandler(item)}>
            <Image source={item?.icon} style={{ width: 40, height: 40 }} />
            <Text
              style={{
                fontFamily: "roboto-medium",
                textAlign: "center",
                marginTop: 3,
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
