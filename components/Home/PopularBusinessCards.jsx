import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

export default function PopularBusinessCards({ business }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/businessdetails/" + business?.id)}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
      <TouchableOpacity style={styles.heartContainer}>
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: business?.imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <View style={styles.blurContainer} />
          <Text style={styles.name}>{business?.name}</Text>
          <View style={styles.addressContainer}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#fff"
              style={styles.locationIcon}
            />
            <Text style={styles.address}>{business?.address}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              <Image
                source={require("../../assets/images/star.png")}
                style={{ width: 10, height: 10, marginRight: 5 }}
              />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
            <Text style={styles.category}>{business?.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    marginBottom: 13,
    backgroundColor: "#fff",
    borderRadius: 26,
    borderWidth: 0,
    width: 250,
    height: 356,
    overflow: "hidden", // Ensure content stays within the card
    shadowOffset: { width: 0, height: 4 }, // Shadow offset (0 for horizontal, 4 for vertical)
    shadowColor: "#000", // Shadow color
    shadowOpacity: 0.85, // Shadow transparency
    shadowRadius: 14, // How blurry the shadow is
    elevation: 5, // Android-specific shadow property
  },
  imageContainer: {
    position: "relative", // Allows absolute positioning of the infoContainer
    width: "100%",
    height: "100%",
  },
  heartContainer: {
    position: "absolute",
    top: 10, // Distance from the top of the card
    right: 10, // Distance from the right of the card
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    padding: 8, // Padding around the heart icon
    borderRadius: 20, // Makes it circular
    zIndex: 10, // Ensures it appears above the image
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  infoContainer: {
    position: "absolute",
    bottom: 10, // Space between the container and the bottom of the image
    left: 10, // Space on the left
    right: 10, // Space on the right
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Light transparent background for the glass effect
    padding: 10, // Internal padding for the content
    borderRadius: 16, // Rounded corners for the glass effect
    overflow: "hidden", // Ensures blur doesn't exceed rounded corners
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject, // Fills the entire infoContainer
    backgroundColor: "rgba(177, 176, 176, 0.3)", // Light transparent background for the glass effect
    blurRadius: 50, // Creates the blur effect
  },
  name: {
    fontFamily: "lato-bold",
    textTransform: "capitalize",
    fontSize: RFValue(15),
    color: "#fff",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  address: {
    fontFamily: "lato",
    fontSize: RFValue(11),
    textTransform: "capitalize",
    color: "#fff",
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    width: "100%",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#fff",
    fontFamily: "roboto-bold",
  },
  category: {
    fontFamily: "roboto-medium",
    backgroundColor: Colors.primaryColor,
    color: "#000",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 10,
    textTransform: "capitalize",
  },
  locationIcon: {
    marginRight: 5,
  },
});
