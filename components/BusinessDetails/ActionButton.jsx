import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Ensure you import Ionicons from Expo
import { RFValue } from "react-native-responsive-fontsize";

export default function ActionButton({ business }) {
  const actionButton = {
    id: 1,
    name: "View Profile",
    icon: <Ionicons name="person-outline" size={20} color="white" />, // Ionicons for Call
    url: "tel:" + business?.contact,
  };

  const onPressHandler = () => {
    Linking.openURL(actionButton.url);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPressHandler}>
        <View style={styles.buttonContent}>
          {actionButton.icon}
          <Text style={styles.buttonText}>{actionButton.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 23,
    height: "100%",
    width: "100%", // Ensure container takes up full width
  },
  button: {
    backgroundColor: "#AA6A1C", // Light gray background
    borderRadius: 60, // Rounded button
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    width: "100%", // Full width button
    height: 60, // Fixed height for uniformity
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: "row", // Align text and icon in a row
    justifyContent: "center", // Center both icon and text
    alignItems: "center", // Align items vertically
  },
  buttonText: {
    fontFamily: "lato-bold",
    textAlign: "center",
    fontSize: RFValue(12),
    color: "white",
    marginLeft: 10, // Space between the icon and text
  },
});
