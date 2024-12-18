import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ToastAndroid, // Import ToastAndroid
  Image,
} from "react-native";
import { useAuth } from "../../../context/authContext"; // Hook for authentication context
import { Colors } from "../../../constants/Colors"; // Color constants
import Header from "../../../components/Header"; // Header component
import { useRouter } from "expo-router"; // Navigation hook
import * as ImagePicker from "expo-image-picker"; // Image picker module
import { storage } from "../../../config/FirebaseConfig"; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import functions for uploading and getting download URL
import { RFValue } from "react-native-responsive-fontsize";

const EditProfileScreen = () => {
  const { user, updateProfile } = useAuth(); // Access user data and update function
  const router = useRouter();
  const [title] = useState("Edit Profile"); // Title of the screen
  const [profileImage, setProfileImage] = useState(user?.profileImage); // Initial profile image state

  // Initial state for social media links
  const [socialLinks, setSocialLinks] = useState({
    website: user?.website || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    twitter: user?.twitter || "",
  });

  // Alert if user data is not found
  useEffect(() => {
    if (!user) {
      ToastAndroid.show("User not found. Please log in again.", ToastAndroid.LONG);
    }
  }, [user]);

  // Prevent rendering until user is available
  if (!user) {
    return null; // You can consider adding a loading spinner here instead
  }

  // Function to handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      ToastAndroid.show("Permission to access camera roll is required!", ToastAndroid.LONG);
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (pickerResult.canceled) {
      return;
    }

    const imageUri = pickerResult.assets[0]?.uri; // Extract URI
    setProfileImage(imageUri); // Update state

    try {
      const imageUrl = await uploadImage(imageUri); // Upload image to Firebase
      await updateProfile({ profileImage: imageUrl }); // Update profile with new image URL
      ToastAndroid.show("Profile image updated successfully!", ToastAndroid.SHORT); // Show toast message
    } catch (error) {
      ToastAndroid.show("Error updating profile image.", ToastAndroid.SHORT); // Show toast message
      console.error("Error uploading image:", error);
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `profile-images/${user.uid}-${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob); // Upload the blob to Firebase Storage
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL for the uploaded image
    return downloadURL; // Return the URL
  };

  // Function to navigate to edit field screen
  const navigateToEditField = (field, initialValue) => {
    router.push({
      pathname: "/profile/BuyerProfile/EditFieldScreen",
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

        {/* Editable Fields with placeholder text for empty fields */}
        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("Profession", user.title || "Add Profession")}
        >
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>
            {user.title || "Add Title"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("firstName", user.firstName)}
        >
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>
            {user.firstName || "Add First Name"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("lastName", user.lastName)}
        >
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>
            {user.lastName || "Add Last Name"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("username", user.username)}
        >
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>
            {user.username || "Add Username"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("email", user.email)}
        >
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>
            {user.email || "Add Email"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("bio", user.bio || "Tell us about yourself")}
        >
          <Text style={styles.label}>Bio</Text>
          <Text style={styles.value}>
            {user.bio || "Add Bio"}
          </Text>
        </TouchableOpacity>

        {/* Social Media Section */}
        <Text style={styles.sectionTitle}>Social Media Links</Text>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("website", socialLinks.website)}
        >
          <Text style={styles.label}>Website</Text>
          <Text style={styles.value}>
            {socialLinks.website || "Add Website"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("instagram", socialLinks.instagram)}
        >
          <Text style={styles.label}>Instagram</Text>
          <Text style={styles.value}>
            {socialLinks.instagram || "Add Instagram"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("facebook", socialLinks.facebook)}
        >
          <Text style={styles.label}>Facebook</Text>
          <Text style={styles.value}>
            {socialLinks.facebook || "Add Facebook"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigateToEditField("twitter", socialLinks.twitter)}
        >
          <Text style={styles.label}>Twitter</Text>
          <Text style={styles.value}>
            {socialLinks.twitter || "Add Twitter"}
          </Text>
        </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: "#000",
    fontFamily: "poppins-semibold",
    flex: 1,
  },
  value: {
    color: "#888",
    fontSize: 16,
    flexShrink: 1,
    textAlign: "left",
    flex: 4,
  },
  sectionTitle: {
    marginTop: 40,
    marginBottom: 5,
    fontSize: 18,
    fontFamily: "lato-bold",
    marginVertical: RFValue(16),
    color: "rgba(141, 110, 99, 1)",
  },
});

export default EditProfileScreen;
