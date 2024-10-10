import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "../../../context/authContext"; // Hook for authentication context
import { Colors } from "../../../constants/Colors"; // Color constants
import Header from "../../../components/Header"; // Header component
import { useRouter } from "expo-router"; // Navigation hook
import * as ImagePicker from "expo-image-picker"; // Image picker module
import { storage } from "../../../config/FirebaseConfig"; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import functions for uploading and getting download URL

const EditProfileScreen = () => {
  const { user, updateProfile } = useAuth(); // Access user data and update function
  const router = useRouter();
  const [title] = useState("Edit Profile"); // Title of the screen
  const [profileImage, setProfileImage] = useState(user?.profileImage); // Initial profile image state

  // Alert if user data is not found
  useEffect(() => {
    if (!user) {
      Alert.alert("User not found", "Please log in again.");
    }
  }, [user]);

  // Prevent rendering until user is available
  if (!user) {
    return null; // You can consider adding a loading spinner here instead
  }

  // Function to handle image picking
  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user canceled the image picking, return
    if (pickerResult.canceled) {
      return;
    }

    // Update the profile image state
    const imageUri = pickerResult.assets[0]?.uri; // Extract URI
    setProfileImage(imageUri); // Update state

    // Upload image and get the URL
    try {
      const imageUrl = await uploadImage(imageUri); // Upload image to Firebase
      await updateProfile({ profileImage: imageUrl }); // Update profile with new image URL
      Alert.alert("Profile image updated successfully!");
    } catch (error) {
      Alert.alert("Error updating profile image.");
      console.error("Error uploading image:", error);
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `profile-images/${user.uid}-${Date.now()}.jpg`; // Create a unique file name
    const storageRef = ref(storage, fileName); // Create a reference to the storage location

    await uploadBytes(storageRef, blob); // Upload the blob to Firebase Storage
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL for the uploaded image
    return downloadURL; // Return the URL
  };

  // Function to navigate to edit field screen
  const navigateToEditField = (field, initialValue) => {
    router.push({
      pathname: "/profile/EntrepreneurProfile/EditFieldScreen",
      params: { field, initialValue },
    });
  };

  return (
    <View style={styles.container}>
      <Header title={title} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Image Section styled like editable fields */}
        <TouchableOpacity style={styles.editRow} onPress={pickImage}>
          <Text style={styles.label}>Edit Profile Picture</Text>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Add Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Editable Fields */}
        {[
          {
            label: "Name",
            value: `${user.firstName} `,
            field: "firstName",
          },
          { label: "Title", value: user.title, field: "title" },
          { label: "Username", value: user.username, field: "username" },
          { label: "Email", value: user.email, field: "email" },
          { label: "Address", value: user.address, field: "address" },
          {
            label: "Bio",
            value: user.bio || "Tell us about yourself",
            field: "bio",
          },
        ].map(({ label, value, field }) => (
          <TouchableOpacity
            key={field}
            style={styles.editRow}
            onPress={() => navigateToEditField(field, value)}
          >
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
  },
  scrollContainer: {
    padding: 16,
    marginTop: -20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
  },
  editRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center", // Align items vertically centered
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: "#000",
    fontFamily: "poppins-semibold",
    flex: 1, // Allow the label to take available space
  },
  value: {
    color: "#888",
    fontSize: 16,
    flexShrink: 1, // Prevent value text from overflowing
    textAlign: "right", // Align value to the right
    flex: 4, // Allow the value to take available space
    },
});

export default EditProfileScreen;
