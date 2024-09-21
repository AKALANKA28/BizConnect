import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { db } from '../config/FirebaseConfig'; // Update with your actual Firebase config path
import { collection, getDocs } from 'firebase/firestore';
import NotificationItem from '../components/Notifications/NotificationItem';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsCollection = collection(db, 'notifications');
        const notificationsSnapshot = await getDocs(notificationsCollection);
        const notificationsList = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsList);
      } catch (error) {
        console.error('Error fetching notifications: ', error);
      }
    };

    fetchNotifications();
  }, []);

  const renderNotificationItem = ({ item }) => <NotificationItem notification={item} />;

  return (
    <View style={styles.screen}>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications available.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingVertical: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
