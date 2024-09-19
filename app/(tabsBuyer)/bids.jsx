import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { db, auth } from "../../config/FirebaseConfig"; // Update with your actual Firebase config path
import { collection, getDocs, query, where } from "firebase/firestore";
import { Colors } from "../../constants/Colors";

export default function Bids() {
  const [bids, setBids] = useState([]);
  const router = useRouter();
  const userId = auth.currentUser?.uid; // Get the current user ID

  useEffect(() => {
    const fetchBids = async () => {
      if (!userId) {
        console.error("No user is currently logged in.");
        return;
      }

      try {
        const bidsCollection = collection(db, "Bids");
        const q = query(bidsCollection, where("userId", "==", userId));
        const bidsSnapshot = await getDocs(q);
        const bidsList = bidsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBids(bidsList);
      } catch (error) {
        console.error("Error fetching bids: ", error);
      }
    };

    fetchBids();
  }, [userId]);

  const renderBidItem = ({ item }) => (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardAddress}>{item.address}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardClosingTime}>
          Closing Time:{" "}
          {new Date(item.bidClosingTime?.seconds * 1000).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Bids List */}
      <FlatList
        data={bids}
        renderItem={renderBidItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/bids/addBid")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontFamily: "roboto-bold",
    marginBottom: 20, // Added margin for spacing
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: Colors.secondaryColor,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  list: {
    marginBottom: 80, // Adjusted to account for FAB size
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardAddress: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  cardClosingTime: {
    fontSize: 12,
    color: "#777",
  },
});
