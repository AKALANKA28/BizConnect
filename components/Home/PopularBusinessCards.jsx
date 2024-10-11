import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for location icon

export default function PopularBusinessCards({ business }) {
  const router = useRouter();

  return ( 
    <TouchableOpacity
      onPress={() => router.push("/businessdetails/" + business?.id)}
      style={styles.card}
    >
      <Image
        source={{ uri: business?.imageUrl }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{business?.name}</Text>
        <View style={styles.addressContainer}>
          {/* Add the location icon before the address */}
          <Ionicons name="location-outline" size={16} color="#6D4C41" style={styles.locationIcon} />
          <Text style={styles.address}>{business?.address}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.rating}>
            {/* <Image
              source={require("../../assets/images/star.png")}
              style={{ width: 15, height: 15 }}
            />
            <Text style={styles.ratingText}>4.5</Text> */}
          </View>
          <Text style={styles.category}>{business?.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 8,
    paddingBottom: 12,
    marginLeft: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#EFEFF0",
    borderWidth: 0.5,
    elevation: 0.4,
    width: 256,
    height: 222,
    alignItems: "center", // Center image
  },
  image: {
    width: 255,
    height: 152,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: "flex-start", // Align text to the left
    width: "100%", // Ensure it uses full width
  },
  name: {
    fontFamily: "lato-bold",
    textTransform: "capitalize",
    fontSize: RFValue(15),
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
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    width: "100%",
  },
  rating: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ratingText: {
    color: Colors.text,
    fontFamily: "roboto-bold",
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
  locationIcon: {
    marginRight: 5, // Space between icon and address text
  },
});
