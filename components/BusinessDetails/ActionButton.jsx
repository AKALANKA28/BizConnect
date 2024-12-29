import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you import Ionicons from Expo
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function ActionButton({ entrepreneurId }) {
  const router = useRouter();

  const onPressHandler = () => {
    console.log("Navigating to entrepreneur profile:", entrepreneurId);
    if (entrepreneurId) {
      router.push(`/profile/${entrepreneurId}`);
    } else {
      console.error("Business owner ID is missing.");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPressHandler}>
      <View style={styles.buttonContent}>
        <Ionicons name="person-outline" size={20} color="white" />
        <Text style={styles.buttonText}>View Profile</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 29,
    left: 18,
    right: 18,
    backgroundColor: Colors.secondaryColor, // Replace with your color
    borderRadius: 28,
    padding: 19,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
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
