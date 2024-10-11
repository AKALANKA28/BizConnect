import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "react-native-vector-icons"; // Use FontAwesome5 for icons
import { useAuth } from "../../../context/authContext"; // Import useAuth hook
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig"; // Firestore instance
import ProfileStats from "../../../components/Profile/EntrepreneurProfile/ProfileStats";
import { router } from "expo-router";
import { Colors } from "../../../constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";

const { width: screenWidth } = Dimensions.get("window"); // Get screen width for responsive layout

const ProfileHeader = ({ entrepreneurId }) => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [profileData, setProfileData] = useState({
    firstName: "Loading...",
    lastName: "Loading...",
    title: "Loading...",
    profileImage: "https://via.placeholder.com/150", // Default placeholder image
  });

  const fetchProfileData = async () => {
    try {
      // Use the provided entrepreneurId or the current user's ID
      const idToFetch = entrepreneurId || user?.uid;

      if (idToFetch) {
        const userDocRef = doc(db, "entrepreneurs", idToFetch);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setProfileData({
            firstName: userData.firstName || userData.username || "Guest User", // Use username if firstName is not available
            lastName: userData.lastName || "", // Leave last name blank if not provided
            title: userData.title || "No title available", // Use bio as title if it's the description
            profileImage:
              userData.profileImage || "https://via.placeholder.com/150", // Fallback to placeholder
          });
        } else {
          console.log("No such user document!");
        }
      }
    } catch (error) {
      console.error("Error fetching profile data: ", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [entrepreneurId, user]);

  const renderButton = () => {
    // If the logged-in user is the owner of the profile and they are an entrepreneur, show the "Edit" button
    if (user?.role === "entrepreneur" && user.uid === user?.uid) {
      return (
        <TouchableOpacity
          onPress={() => router.push("/profile/BuyerProfile/EditProfileScreen")}
        >
          <FontAwesome5 name="edit" size={18} color="#6D4C41" />
        </TouchableOpacity>
      );
    }

    // If the user is viewing someone else's profile or if they are a buyer, show the "Message" button
    return (
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => {
          // Navigate to a messaging screen or handle message action here
          router.push(`/messages/${entrepreneurId}`);
        }}
      >
        <Text style={styles.messageButtonText}>Message</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          resizeMode="contain"
          source={{ uri: profileData.profileImage }}
          style={styles.profileImage}
        />
        <View style={styles.statsContainer}>
          <ProfileStats />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {profileData.firstName}{profileData.lastName}
          </Text>
          <Text style={styles.profession}>{profileData.title}</Text>
        </View>
        {renderButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start", // Corrected the alignment
    marginBottom: 20,
    marginTop: 20,
    width: "100%", // Ensure full width
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    gap: 20,
    marginBottom: 20,
    marginVertical: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    aspectRatio: 1,
    marginTop: 15,
    borderRadius: 55, // Make the image circular
    resizeMode: "cover",
  },
  statsContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "flex-start", // Align to the left
    flexDirection: "row", // Place stats in a row
    flexWrap: "wrap", // Wrap stats if they exceed screen width
    maxWidth: screenWidth - 100, // Ensure stats don't overflow based on screen size
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontSize: RFValue(22),
    fontFamily: "lato-bold",
    color: "rgba(0, 0, 0, 1)",
  },
  profession: {
    fontSize: RFValue(11),
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "poppins-semibold",
  },
  messageButton: {
    backgroundColor: Colors.secondaryColor, // Brown color for the button
    paddingVertical: 8,
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  messageButtonText: {
    color: "#FFF",
    fontSize: RFValue(12),
    fontFamily: "lato-bold",
  },
});

export default ProfileHeader;
