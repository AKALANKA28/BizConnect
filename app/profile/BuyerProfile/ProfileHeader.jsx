import { router } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileHeader = () => {
  const handleEditProfile = () => {
    router.push("/profile/BuyerProfile/EditProfileScreen"); // Navigate to EditProfileScreen
  };

  const handleShareProfile = () => {
    // Add functionality to share the profile
    // You can use Share API from React Native
    // Example: Share.share({ message: "Check out my profile!" });
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7feb1d78bbd74a0e82a54e5a174ea8bd65e5a74faf472397fb3e761e36fab16a?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
        }}
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Arun Perera</Text>
        <Text style={styles.title}>Handloom Product Exporter</Text>

        {/* Action Buttons: Edit Profile and Share Profile */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Icon name="edit" size={17} color="#333" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareProfileButton}
            onPress={handleShareProfile}
          >
            <Icon name="share" size={17} color="#333" />
            <Text style={styles.buttonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    padding: 10,
  },
  profileImage: {
    width: 110,
    aspectRatio: 1,
    marginTop: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: "poppins-semibold",
    color: "rgba(51, 51, 51, 1)",
    fontWeight: "400",
  },
  title: {
    fontSize: 12,
    fontFamily: "poppins-semibold",
    color: "rgba(51, 51, 51, 1)",
    fontWeight: "400",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    paddingVertical: 5,
    paddingHorizontal: 15,
    gap: 5,
    borderRadius: 5,
  },
  shareProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    paddingVertical: 5,
    paddingHorizontal: 15,
    gap: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "poppins",
    color: "#333",
  },
});

export default ProfileHeader;
