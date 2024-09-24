import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { db } from "../config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import NotificationItem from "../components/Notifications/NotificationItem";
import Header from "../components/Header";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router"; // Import useRouter hook

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter(); // Get router object

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log("User ID: ", user.uid);
        setUserId(user.uid);
      } else {
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userId) {
          console.log("No userId provided");
          return;
        }

        const notificationsCollection = collection(db, "BuyerNotifications");
        const q = query(notificationsCollection, where("ownerId", "==", userId));
        const notificationsSnapshot = await getDocs(q);
        const notificationsList = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (notificationsList.length === 0) {
          console.log("No notifications found for this user.");
        }

        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleNotificationPress = (entrepreneurId) => {
    router.push(`/profile/${entrepreneurId}`);
  };
  

  const renderNotificationItem = ({ item }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item.entrepreneurId)} // Ensure this ID is correct
      />
  );

  return (
    <>
      <Header title="Notifications" />
      <View style={styles.screen}>
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications available for bids.</Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  list: {
    paddingVertical: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
