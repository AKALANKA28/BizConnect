import React, { useState } from "react";
import { TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";
import { Colors } from "../../../constants/Colors"; // Assuming you have a Colors file for your theme
import Loading from "../../Loading";
import { View } from "react-native";

export default function AcceptBidButton({ entrepeneurid }) {
  const [loading, setLoading] = useState(false); // Add loading state

  const acceptBid = async () => {
    try {
      // console.log("Entrepreneur ID: ", entrepeneurid);
      setLoading(true); // Set loading to true when bid is being processed

      if (!entrepeneurid) {
        console.error("Entrepreneur ID is undefined");
        Alert.alert("Error", "Entrepreneur ID is missing.");
        setLoading(false); // Reset loading
        return;
      }

      // Query to get the bidId from PlacedBids collection where entrepreneurId matches
      const q = query(
        collection(db, "PlacedBids"),
        where("entrepreneurId", "==", entrepeneurid)
      );

      const querySnapshot = await getDocs(q);
      // console.log("Query Snapshot: ", querySnapshot.docs); // Log the query result

      if (querySnapshot.empty) {
        console.error("No bids found for this entrepreneur.");
        Alert.alert("Error", "No bids found for this entrepreneur.");
        setLoading(false); // Reset loading
        return;
      }

      // Assuming you want the first bid found
      const bidDoc = querySnapshot.docs[0];
      const bidData = bidDoc.data();
      const bidId = bidData.bidId;

      console.log("Fetched Bid ID: ", bidId);

      // Fetch the owner's name using the ownerId (which is the uid in this case)
      const ownerId = bidData.ownerId; // Owner ID from bid data
      const ownerDocRef = doc(db, "buyers", ownerId); // Assuming the buyers are stored in the 'buyers' collection
      const ownerDocSnap = await getDoc(ownerDocRef);

      let ownerName = "Unknown"; // Default value
      if (ownerDocSnap.exists()) {
        const ownerData = ownerDocSnap.data();
        ownerName = ownerData.username || "Unknown"; // Assuming 'username' field holds the owner's name
      }

      // Update the bid status in `PlacedBids` collection
      const bidRef = doc(db, "PlacedBids", bidDoc.id);
      await updateDoc(bidRef, {
        status: "accepted",
        timestamp: new Date(),
      });

      // console.log(
      //   "Checking for notifications with Bid ID: ",
      //   bidId,
      //   " and Owner ID: ",
      //   bidData.ownerId
      // );

      // Find and delete the corresponding notification from `BuyerNotifications`
      const buyerNotificationQuery = query(
        collection(db, "BuyerNotifications"),
        where("bidId", "==", bidId),
        where("ownerId", "==", bidData.ownerId)
      );

      const buyerNotificationSnapshot = await getDocs(buyerNotificationQuery);

      if (!buyerNotificationSnapshot.empty) {
        const notificationDoc = buyerNotificationSnapshot.docs[0];
        const notificationId = notificationDoc.id;

        // Delete the notification
        await deleteDoc(doc(db, "BuyerNotifications", notificationId));
        // console.log("Notification deleted for Buyer: ", notificationId);
      } else {
        console.log("No matching notification found in BuyerNotifications.");
      }

      // Add a new notification to the `EntrepreneurNotifications` collection
      const entrepreneurNotification = {
        entrepreneurId: entrepeneurid,
        bidId: bidId,
        message: `Your bid has been accepted by ${ownerName}`, // Using the ownerName variable
        timestamp: new Date(),
        status: "unread", // Optionally track the read/unread status
      };

      // console.log("Preparing to add notification: ", entrepreneurNotification); // Log the notification data

      await addDoc(
        collection(db, "EntrepreneurNotifications"),
        entrepreneurNotification
      );
      // console.log("Notification sent to Entrepreneur.");

      // Notify the entrepreneur
      Alert.alert("Bid Accepted", "The bid has been successfully accepted!");
    } catch (error) {
      // console.error("Error in acceptBid: ", error); // Log any error
      Alert.alert("Error", "An error occurred while processing your request.");
    }finally {
      setLoading(false); // Reset loading state after the bid is processed
    }
  };

  return (
    <View>
      {loading ? (
        <View style={styles.loading}>
          <Loading />
        </View>
      ) : (
        <TouchableOpacity style={styles.fab} onPress={acceptBid}>
          <Text style={styles.fabText}>Accept Bid</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    bottom: 16,
    left: 18,
    right: 18,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    zIndex: 1, // Optional: use zIndex if you suspect other elements are overlapping
  },
  fab: {
    position: "absolute",
    bottom: 16,
    left: 18,
    right: 18,
    backgroundColor: Colors.secondaryColor, // Replace with your color
    borderRadius: 28,
    padding: 19,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1, // Optional: use zIndex if you suspect other elements are overlapping
  },
  fabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
