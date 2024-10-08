import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function BusinessListCard({ business }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => router.push(`/businessdetails/` + business.id)}
    >
      <Image
        source={{ uri: business?.imageUrl }}
        style={styles.businessImage}
      />
      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{business.name}</Text>
        <Text style={styles.businessAddress}>{business.address}</Text>

        <View style={styles.ratingContainer}>
          <Image
            source={require("../../assets/images/star.png")}
            style={styles.starIcon}
          />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Stylesheet for the BusinessListCard component
const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Adds shadow for Android
  },
  businessImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  businessInfo: {
    flex: 1,
    gap: 5,
    justifyContent: "center",
  },
  businessName: {
    fontFamily: "roboto-bold",
    fontSize: 20,
    textTransform: "capitalize",
    color: Colors.text, // Replace with your app's text color
  },
  businessAddress: {
    fontFamily: "roboto",
    fontSize: 15,
    color: "#555", // Softer color for the address text
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  starIcon: {
    width: 15,
    height: 15,
  },
  ratingText: {
    color: "#000",
    fontFamily: "roboto-bold",
    fontSize: 14,
  },
});
