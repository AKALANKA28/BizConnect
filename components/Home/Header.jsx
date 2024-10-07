import React, { useContext } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/authContext"; // Assuming AuthContext is in this path
import { Colors } from "../../constants/Colors";
import avatarPlaceholder from "../../assets/images/avatar.png"; // Default avatar
import { router } from "expo-router";
import { NotificationContext } from '../../context/notificationContext'; // Import the context

export default function Header({ notificationCount }) {
  const { user } = useAuth(); // Access the authenticated user from context
  const { unreadCount } = useContext(NotificationContext); // Access the notification count

  
  const handleNotificationPress = () => {
    // Check user role and navigate to the corresponding notifications screen
    if (user?.role === "entrepreneur") {
      router.push("notifications/EntrepreneurNotifications"); // Navigate to EntrepreneurNotifications
    } else if (user?.role === "buyer") {
      router.push("notifications/BuyerNotifications"); // Navigate to BuyerNotifications
    } else {
      console.warn("No notifications available for this role.");
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userProfile}>
          <Image
            source={user?.photoURL ? { uri: user.photoURL } : avatarPlaceholder}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greetingText}>Good Day,</Text>
            <Text style={styles.usernameText}>{user?.username || "Guest"}</Text>
          </View>
        </View>

        {/* Notifications */}
        <TouchableOpacity activeOpacity={0.5} onPress={handleNotificationPress} style={styles.notificationIconWrapper}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.secondaryColor}
            style={styles.notificationIcon}
          />
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}


export const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    paddingTop: 50,
    height: 200,
    marginBottom: 9,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  userInfoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  userProfile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  greetingText: {
    color: "#000",
  },
  usernameText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#000",
  },
  notificationIconWrapper: {
    position: "relative",
  },
  notificationIcon: {
    margin: 5,
  },
  notificationBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 12,
  },
  searchBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFEFEF",
    padding: 10,
    borderRadius: 99,
    marginVertical: 10,
    marginTop: 15,
  },
  searchInput: {
    fontSize: 16,
    color: "#BCBCBC",
  },
});