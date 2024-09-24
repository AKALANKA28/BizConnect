import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { db } from "../../config/FirebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";

export default function EntrepreneurProfile() {
  const { entrepeneurid, bidId } = useLocalSearchParams(); // Assuming you pass both `entrepeneurid` and `bidId`
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntrepreneurProfile = async () => {
      try {
        const docRef = doc(db, "entrepreneurs", entrepeneurid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEntrepreneur(docSnap.data());
        } else {
          console.log("No entrepreneur found!");
        }
      } catch (error) {
        console.error("Error fetching entrepreneur data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (entrepeneurid) {
      fetchEntrepreneurProfile();
    }
  }, [entrepeneurid]);

  // Function to handle accepting the bid
  const acceptBid = async () => {
    try {
      console.log("Entrepreneur ID: ", entrepeneurid);
  
      // if (!entrepeneurid) {
      //   // console.error("Entrepreneur ID is undefined");
      //   Alert.alert("Error", "Entrepreneur ID is missing.");
      //   return;
      // }
  
      // Query to get the bidId from PlacedBids collection where entrepreneurId matches
      const q = query(
        collection(db, "PlacedBids"),
        where("entrepreneurId", "==", entrepeneurid)
      );
  
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        // console.error("No bids found for this entrepreneur.");
        Alert.alert("Error", "No bids found for this entrepreneur.");
        return;
      }
  
      // Assuming you want the first bid found
      const bidDoc = querySnapshot.docs[0];
      const bidData = bidDoc.data(); // Get the bid data
      const bidId = bidData.bidId; // Get the bidId from the bid data
  
      console.log("Fetched Bid ID: ", bidId);
      console.log("Bid Data: ", bidData);
  
      // Update the bid status in `PlacedBids` collection
      const bidRef = doc(db, "PlacedBids", bidDoc.id);
      await updateDoc(bidRef, {
        status: "accepted",
        timestamp: new Date(),
      });
  
      // console.log("Checking for notifications with Bid ID: ", bidId, " and Owner ID: ", bidData.ownerId);
  
      // Find and delete the corresponding notification from `BuyerNotifications`
      const buyerNotificationQuery = query(
        collection(db, "BuyerNotifications"),
        where("bidId", "==", bidId), // Use the actual bidId from bidData
        where("ownerId", "==", bidData.ownerId) // Owner ID should match buyer's ID
      );
  
      const buyerNotificationSnapshot = await getDocs(buyerNotificationQuery);
  
      if (!buyerNotificationSnapshot.empty) {
        const notificationDoc = buyerNotificationSnapshot.docs[0];
        const notificationId = notificationDoc.id; // Get the notification ID
  
        // Delete the notification
        await deleteDoc(doc(db, "BuyerNotifications", notificationId));
        console.log("Notification deleted for Buyer: ", notificationId);
      } else {
        console.log("No matching notification found in BuyerNotifications.");
      }
  
      // Notify the entrepreneur
      Alert.alert("Bid Accepted", "The bid has been successfully accepted!");
  
    } catch (error) {
      console.error("Error accepting the bid: ", error);
    }
  };
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading entrepreneur profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entrepreneur ? (
        <>
          <Text style={styles.name}>{entrepreneur.username}</Text>
          {/* Add more entrepreneur details here */}

          {/* Accept Bid button, visible only to buyers */}
          <Button title="Accept Bid" onPress={acceptBid} />
        </>
      ) : (
        <Text>No entrepreneur found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
