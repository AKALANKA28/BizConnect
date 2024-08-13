import { View, Text, FlatList, Image } from "react-native";
import React from "react";

export default function MenuList() {
  const menuList = [
    {
      id: 1,
      name: "My Profile",
      //   icon: require("./call-icon.png"),
      //   url: "tel:" + business?.contact,
      path: ''
    },
    {
      id: 2,
      name: "Jobs Details",
      //   icon: require("./location-icon.png"),
      //   url:"https://www.google.com/maps/search/?api=1&query=" + business?.address,

      path: ''

    },
    {
      id: 3,
      name: "Notifications",
      //   icon: require("./web-icon.png"),
      //   url: business?.web,

      path: ''

    },
    {
      id: 4,
      name: "Logout",
      //   icon: require("./share-icon.png"),
      //   url: "tel:" + business?.contact,
      path: ''

    },
  ];
  return (
    <View>
      <FlatList
        data={menuList}
        renderItem={({ item, index }) => (
          <View key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              padding: 10,
            }}
          >
            <Image source={item.icon} style={{ width: 40, height: 40 }} />
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
