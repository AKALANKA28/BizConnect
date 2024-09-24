import React from "react";
import { Button, Alert } from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function AcceptBidButton({ entrepeneurid }) {
  const acceptBid = async () => {
    try {
      console.log("Entrepreneur ID: ", entrepeneurid);

      if (!entrepeneurid) {
        console.error("Entrepreneur ID is undefined");
        Alert.alert("Error", "Entrepreneur ID is missing.");
        return;
      }

      // Query to get the bidId from PlacedBids collection where entrepreneurId matches
      const q = query(
        collection(db, "PlacedBids"),
        where("entrepreneurId", "==", entrepeneurid)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("No bids found for this entrepreneur.");
        Alert.alert("Error", "No bids found for this entrepreneur.");
        return;
      }

      // Assuming you want the first bid found
      const bidDoc = querySnapshot.docs[0];
      const bidData = bidDoc.data();
      const bidId = bidData.bidId;

      console.log("Fetched Bid ID: ", bidId);

      // Update the bid status in `PlacedBids` collection
      const bidRef = doc(db, "PlacedBids", bidDoc.id);
      await updateDoc(bidRef, {
        status: "accepted",
        timestamp: new Date(),
      });

      console.log(
        "Checking for notifications with Bid ID: ",
        bidId,
        " and Owner ID: ",
        bidData.ownerId
      );

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

  return <Button title="Accept Bid" onPress={acceptBid} />;
}
