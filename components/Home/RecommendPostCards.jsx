import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function RecommendPostCards({ business }) {
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
        <Text style={styles.address}>{business?.address}</Text>

        {/* <View style={styles.ratingContainer}>
          <View style={styles.rating}> */}
            {/* <Image
              source={require("../../assets/images/star.png")}
              style={{ width: 15, height: 15 }}
            />
            <Text style={styles.ratingText}>4.5</Text> */}
          </View>
          <Text style={styles.category}>{business?.category}</Text>
        {/* </View>
      </View> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#F8F9FA",
    borderWidth: 1,
    width: 340,
    height: 230,
    alignItems: "center", // Center image
  },
  image: {
    width: 300,
    height: 152,
    borderRadius: 15,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: "flex-start", // Align text to the left
    width: "100%", // Ensure it uses full width
  },
  name: {
    fontFamily: "roboto-bold",
    textTransform: "capitalize",
    fontSize: 17,
  },
  address: {
    fontFamily: "roboto-bold",
    fontSize: 13,
    textTransform: "capitalize",
    color: Colors.text,
  },
//   ratingContainer: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 5,
//     width: "100%",
//   },
//   rating: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//   },
//   ratingText: {
//     color: Colors.text,
//     fontFamily: "roboto-bold",
//   },
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
