import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import PlaceBid from "./PlaceBid";
import { RFValue } from "react-native-responsive-fontsize";

const BidItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
 // UseEffect hook to log the image URL only when `item.image` changes
 useEffect(() => {
  console.log("Image URL:", item.image);
}, [item.image]);

  return (
    <TouchableWithoutFeedback onPress={toggleExpand}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.cardImage} />
          )}
          <View style={styles.cardClosingTimeContainer}>
            <Ionicons name="time-outline" size={14} color="white" />
            <Text style={styles.cardClosingTimeText}>
              {new Date(item.bidClosingTime?.seconds * 1000).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          {/* Hide title and address when expanded */}
          {!expanded && (
            <>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.cardAddressContainer}>
                <Ionicons name="location-outline" size={16} color="#6D4C41" />
                <Text style={styles.cardAddress}>{item.address}</Text>
              </View>
            </>
          )}
          {expanded && (
            <>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <View>
                <Text style={styles.cardInputTitle}>
                  Estimate Cost /
                  <Text style={styles.cardInputSubTitle}>per product</Text>
                </Text>
              </View>
              <PlaceBid item={item}/>
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    paddingBottom: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  imageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 186,
    borderRadius: 8,
  },
  cardClosingTimeContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  cardClosingTimeText: {
    color: "white",
    fontSize: RFValue(10.5),
    fontFamily: "poppins",
    marginLeft: 5,
    marginTop: 2,
  },
  cardContent: {
    flexDirection: "column",
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "poppins-semibold",
    marginBottom: 5,
  },
  cardAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cardAddress: {
    fontSize: 14,
    color: "#6D4C41",
    fontFamily: "poppins",
    marginLeft: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
    fontFamily: "poppins",
    lineHeight: 20,
    marginBottom: 5,
  },
  cardInputTitle: {
    fontSize: 14,
    fontFamily: "poppins-semibold",
    color: "#333",
    marginTop: 10,
  },
  cardInputSubTitle: {
    fontSize: 12,
    color: "#555",
  },
  bidInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    gap: 10,
  },
  bidInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 26,
    padding: 10,
    marginTop: 10,
    flex: 3,
  },
  placeBidButton: {
    backgroundColor: Colors.secondaryColor,
    borderRadius: 26,
    padding: 10,
    paddingVertical: 17,
    marginTop: 10,
    alignItems: "center",
    flex: 1,
  },
  placeBidButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BidItem;
