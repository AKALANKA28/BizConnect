import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/authContext"; // Assuming AuthContext is in this path
import { Colors } from "../../constants/Colors";
import avatarPlaceholder from "../../assets/images/avatar.png"; // Default avatar
import { router } from "expo-router";
import { NotificationContext } from "../../context/notificationContext"; // Import the context
import AntDesign from "@expo/vector-icons/AntDesign";
import { RFValue } from "react-native-responsive-fontsize";
import { StatusBar } from "expo-status-bar";
import { LanguageSwitcher } from "../LanguageSwitcher";

export default function Header({ notificationCount }) {
  const { user } = useAuth(); // Access the authenticated user from context
  const { unreadCount } = useContext(NotificationContext); // Access the notification count
  const handleImagePress = () => {
    // Navigate to the user's profile using the userId
    router.push(`/profile?userId=${user.uid}`); // Use the user's ID as a query parameter
  };

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

  const handleSearchPress = () => {
    router.push("/productSearchScreen"); // Navigate to ProductSearchScreen
  };

  return (
    <View style={styles.headerContainer}>
      <StatusBar style="dark" translucent backgroundColor="white" />

      <View style={styles.userInfoContainer}>
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={
              user?.profileImage
                ? { uri: user.profileImage }
                : avatarPlaceholder
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        {/* <LanguageSwitcher /> */}
        <TouchableOpacity onPress={handleSearchPress} style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6D4C41" />
          <TextInput
            placeholder="Search.."
            style={styles.searchInput}
            editable={false}
          />
        </TouchableOpacity>
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
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 52,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY,
  },
  userInfoContainer: {
    flexDirection: "row", // Ensure items are in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Space items evenly
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 99,
  },
  searchBar: {
    flex: 1, // Let the search bar take up available space
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFF0",
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  searchInput: {
    flex: 1, // Ensure the input takes up available space
    fontSize: RFValue(13),
    color: "#BCBCBC",
  },
  notificationIconWrapper: {
    position: "relative", // Ensure proper alignment with the row
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10, // Add space from the search bar
  },

  notificationBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: RFValue(12),
    fontWeight: "bold",
  },
});
