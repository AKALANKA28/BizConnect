import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationItem({ notification }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{notification.message}</Text>
      <Text style={styles.timestamp}>
        {new Date(notification.timestamp.seconds * 1000).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});
