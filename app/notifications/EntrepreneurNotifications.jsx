import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import { db } from "../../config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import NotificationItem from "../../components/Notifications/NotificationItem";
import Header from "../../components/Header";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router"; // Import useRouter hook

export default function EntrepreneurNotifications() {
  const [notifications, setNotifications] = useState([]); // State for entrepreneur notifications
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State for loading status

  const router = useRouter(); // Get router object

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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
          setIsLoading(false); // Stop loading if no user
          return;
        }

        const notificationsCollection = collection(db, "EntrepreneurNotifications");
        const q = query(notificationsCollection, where("entrepreneurId", "==", userId));
        const notificationsSnapshot = await getDocs(q);
        const notificationsList = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (notificationsList.length === 0) {
          console.log("No notifications found for this user.");
        }

        setNotifications(notificationsList);
        setNotificationCount(notificationsList.length); // Update count based on the fetched notifications
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      } finally {
        setIsLoading(false); // Stop loading once data is fetched
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleNotificationPress = (bidId) => {
    router.push(`/bid/${bidId}`); // Change this based on how you handle notifications
  };

  const renderNotificationItem = ({ item }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item.bidId)} // Ensure this ID is correct
    />
  );

  return (
    <>
      <Header title="Notifications" />
      <View style={styles.screen}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
        ) : notifications.length === 0 ? (
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
