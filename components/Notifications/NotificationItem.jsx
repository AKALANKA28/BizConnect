import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function NotificationItem({ notification, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.timestamp}>
          {new Date(notification.timestamp.seconds * 1000).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  item: {
    // Removing extra padding for the item, as it's handled in the container
  },
  message: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500", // Slightly bolder for emphasis
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});
