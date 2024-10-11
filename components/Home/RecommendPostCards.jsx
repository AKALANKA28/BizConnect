import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

export default function RecommendPostCards({ business }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/businessdetails/" + business?.id)}
      style={styles.card}
    >
      <Image source={{ uri: business?.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{business?.name}</Text>
        <View style={styles.addressContainer}>
          {/* Add the location icon before the address */}
          <Ionicons
            name="location-outline"
            size={16}
            color="#6D4C41"
            style={styles.locationIcon}
          />
          <Text style={styles.address}>{business?.address}</Text>
        </View>
        <Text style={styles.category}>{business?.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#EFEFF0",
    borderWidth: 1,
    width: "49.6%", // Use 48% width for two columns
    marginBottom: 15,
  },
  image: {
    width: "100%", // Full width of the card
    height: 190,
    borderRadius: 12,
    marginBottom: 10,
  },
  infoContainer: {
    paddingHorizontal: 10, // Add some padding inside card
  },
  name: {
    fontFamily: "lato-bold",
    textTransform: "capitalize",
    fontSize: RFValue(14),
  },
  addressContainer: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center icon with text
    marginTop: 5,
  },
  address: {
    fontFamily: "lato",
    fontSize: RFValue(11),
    textTransform: "capitalize",
    color: "#6D4C41",
    marginLeft: 0, // Add some space between icon and text
  },
  category: {
    fontFamily: "roboto-medium",
    backgroundColor: Colors.primaryColor,
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 10,
    textTransform: "capitalize",
  },
});
