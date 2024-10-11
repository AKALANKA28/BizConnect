import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NotificationContext } from "../context/notificationContext"; // Import the context
import { useAuth } from "../context/authContext"; // Assuming AuthContext is in this path
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../constants/Colors";

export default function Header({
  title,
  onDeletePress,
  showDelete,
  showNotification,
  showBackButton = true, 
}) {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth(); // Access the authenticated user from context
  const { unreadCount } = useContext(NotificationContext); // Access the notification count

  const handleNotificationPress = () => {
    if (user?.role === "entrepreneur") {
      router.push("notifications/EntrepreneurNotifications");
    } else if (user?.role === "buyer") {
      router.push("notifications/BuyerNotifications");
    } else {
      console.warn("No notifications available for this role.");
    }
  };

  return (
    <View style={styles.header}>
      <StatusBar style="dark" translucent backgroundColor="white" />
      {/* Conditionally render the back button */}
      {showBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} />
      {showNotification && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleNotificationPress}
          style={styles.notificationIconWrapper}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={"#6D4C41"}
            style={styles.notificationIcon}
          />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      {showDelete && (
        <TouchableOpacity onPress={onDeletePress} style={styles.deleteButton}>
          <MaterialIcons name="delete-outline" size={24} color="#6D4C41" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    marginBottom: 0,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    zIndex: 100,
  },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 30,
    fontSize: RFValue(14),
    fontFamily: "poppins-semibold",
  },
  deleteButton: {
    padding: 10,
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
});
