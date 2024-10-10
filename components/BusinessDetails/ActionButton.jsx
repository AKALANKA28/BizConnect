import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Ensure you import Ionicons from Expo
import { RFValue } from "react-native-responsive-fontsize";

export default function ActionButton({ business }) {
  const actionButtonMenu = [
    {
      id: 1,
      name: "Call",
      icon: <Ionicons name="call-outline" size={27} color="white" />, // Ionicons for Call
      url: "tel:" + business?.contact,
    },
    {
      id: 2,
      name: "Location",
      icon: <Ionicons name="location-outline" size={27} color="white" />, // Ionicons for Location
      url:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(business?.address),
    },
    {
      id: 3,
      name: "Profile",
      icon: <Ionicons name="person-outline" size={27} color="white" />, // Ionicons for Share
      url: "tel:" + business?.contact, // Example for sharing the contact
    },
    {
      id: 4,
      name: "Share",
      icon: <Ionicons name="share-social-outline" size={27} color="white" />, // Ionicons for Share
      url: "tel:" + business?.contact, // Example for sharing the contact
    },
  ];

  const onPressHandler = (item) => {
    if (item.name === "Share") {
      // Implement share functionality if needed
      return;
    }
    Linking.openURL(item?.url);
  };
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {actionButtonMenu.map((item) => (
          <View key={item.id} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onPressHandler(item)}
            >
              {item.icon}
            </TouchableOpacity>
            <Text style={styles.buttonText}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    alignItems: "left",
     height: "100%"
  },
  scrollContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    alignItems: "center", // Center content in buttonContainer
    marginHorizontal: 17, // Space between buttons
  },
  button: {
    backgroundColor: "#AA6A1C", // Light gray background
    borderRadius: 60, // Rounded button
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    width: 70,
    height: 70, // Fixed width for uniformity
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontFamily: "lato-bold",
    textAlign: "center",
    fontSize: RFValue(12),
    marginTop: 5,
  },
});
