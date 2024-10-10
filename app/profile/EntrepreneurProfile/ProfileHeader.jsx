import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "react-native-vector-icons"; // Use FontAwesome5 for icons
import { useAuth } from "../../../context/authContext"; // Import useAuth hook
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig"; // Firestore instance
import ProfileStats from "../../../components/Profile/EntrepreneurProfile/ProfileStats";
import { router } from "expo-router";

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
            firstName: userData.firstName || "No first name provided",
            lastName: userData.lastName || "No last name provided",
            title: userData.title || "No title available",  // Use bio as title if it's the description
            profileImage: userData.profileImage || "https://via.placeholder.com/150",  // Fallback to placeholder
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

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          resizeMode="contain"
          source={{ uri: profileData.profileImage }}
          style={styles.profileImage}
        />
        <ProfileStats />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{profileData.firstName}</Text>
          <Text style={styles.title}>{profileData.title}</Text>
        </View>
        {user?.role === "entrepreneur" && (
          // Only show the edit button if the logged-in user is an entrepreneur
          <TouchableOpacity
            onPress={() => router.push("/profile/EntrepreneurProfile/EditProfileScreen")}
          >
            <FontAwesome5 name="edit" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "left",
    marginBottom: 20,
    marginTop: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
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
    fontSize: 24,
    fontFamily: "poppins-semibold",
    color: "rgba(0, 0, 0, 1)",
  },
  title: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "poppins",
  },
});

export default ProfileHeader;
