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

export default function Header({ notificationCount }) {
  const { user } = useAuth(); // Access the authenticated user from context
  const { unreadCount } = useContext(NotificationContext); // Access the notification count

  const handleImagePress = () => {
    // Navigate to the user's profile using the userId
    router.push(`/profile?userId=${user.id}`); // Use the user's ID as a query parameter
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

  return (
    <View style={styles.headerContainer}>
            <StatusBar style="dark" translucent backgroundColor="white" />

      <View style={styles.userInfoContainer}>
        <View style={styles.userProfile}>
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
          <View>
            <Text style={styles.greetingText}>Good Day,</Text>
            <Text style={styles.usernameText}>
              {user?.firstName ? user.firstName : user?.username || "Guest"}
            </Text>
          </View>
        </View>

        {/* Notifications */}
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

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6D4C41" />
          <TextInput
            placeholder="What products you need?"
            style={styles.searchInput}
          />
        </View>
        {/* Filter Button with Icon */}
        <TouchableOpacity
          onPress={() => {
            /* Handle filter button click */
          }}
          style={styles.filterButton}
        >
          <AntDesign name="filter" size={20} color="#6D4C41" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    paddingTop: 45,
    height: 200,
    marginBottom: 9,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
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
    fontSize: RFValue(14),
  },
  usernameText: {
    fontSize: RFValue(18),
    fontFamily: "lato-bold",
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
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFEFF0",
    padding: 10,
    borderRadius: 90,
    marginVertical: 10,
    marginTop: 15,
  },
  searchInput: {
    fontSize: RFValue(13),
    color: "#BCBCBC",
  },
  filterButton: {
    backgroundColor: "#EFEFF0", // Blue color for the filter button
    padding: 14,
    borderRadius: 90,
  },
});
