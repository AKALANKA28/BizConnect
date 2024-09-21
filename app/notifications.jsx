import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { db } from "../config/FirebaseConfig"; // Update with your actual Firebase config path
import { collection, getDocs, query, where } from "firebase/firestore";
import NotificationItem from "../components/Notifications/NotificationItem";
import Header from "../components/Header";

export default function NotificationScreen({ userId }) {
  // Pass userId as a prop
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsCollection = collection(db, "notifications");
        const q = query(
          notificationsCollection,
          where("ownerId", "==", userId)
        ); // Filter by user ID
        const notificationsSnapshot = await getDocs(q);
        const notificationsList = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const renderNotificationItem = ({ item }) => (
    <NotificationItem notification={item} />
  );

  return (
    <>
      <Header title="Notifications" />
      <View style={styles.screen}>
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications available.</Text>
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
