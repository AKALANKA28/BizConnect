import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { db } from "../../config/FirebaseConfig"; // Update with your actual Firebase config path
import {
  addDoc,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { Colors } from "../../constants/Colors";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const PlaceBid = ({ item }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [username, setUsername] = useState(""); // State for storing the username
  const auth = getAuth(); // Get the Auth instance
  const entrepreneurId = auth.currentUser ? auth.currentUser.uid : null; // Get logged-in user ID

  // Fetch username on component mount
  useEffect(() => {
    const fetchUsername = async () => {
      if (entrepreneurId) {
        const userDoc = await getDoc(doc(db, "users", entrepreneurId)); // Adjust "users" to your user collection name
        if (userDoc.exists()) {
          setUsername(userDoc.data().username); // Replace with your actual field name
        }
      }
    };

    fetchUsername();
  }, [entrepreneurId]);

  const handlePlaceBid = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      Alert.alert("Invalid Bid", "Please enter a valid bid amount.");
      return;
    }
  
    try {
      const bidId = item.id; // Bid document ID
      const ownerId = item.userId; // ID of the bid owner
  
      // Create a new document in the PlacedBids collection
      await addDoc(collection(db, "PlacedBids"), {
        bidId, // ID of the original bid
        entrepreneurId, // Use the actual logged entrepreneur's ID here
        amount: bidAmount,
        ownerId, // ID of the bid owner
        timestamp: new Date(),
      });
  
      // Create a notification for the bid owner
      await addDoc(collection(db, "BuyerNotifications"), {
        bidId, // ID of the original bid
        ownerId,
        entrepreneurId, // Store the actual Entrepreneur's ID here
        message: `You have received a new bid of ${bidAmount} from Entrepreneur ${username}.`, // Use the fetched username
        timestamp: new Date(),
      });
  
      console.log("Bid placed:", bidAmount);
      setBidAmount(""); // Reset bid amount after placing the bid
  
      Alert.alert("Success", "Your bid has been placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error);
      Alert.alert("Error", "There was an error placing your bid. Please try again.");
    }
  };

  return (
    <View style={styles.bidInputContainer}>
      <TextInput
        style={styles.bidInput}
        placeholder="Enter your bid amount"
        value={bidAmount}
        onChangeText={setBidAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity
        onPress={handlePlaceBid}
        style={styles.placeBidButton}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Place Bid</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: "poppins",
    fontWeight: "bold",
  },
});

export default PlaceBid;
