import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { FontAwesome5 } from "react-native-vector-icons";
import { useAuth } from "../../../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";
import { router } from "expo-router";
import { Colors } from "../../../constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";

const { width: screenWidth } = Dimensions.get("window");

const ProfileHeader = ({ entrepreneurId }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: "Loading...",
    lastName: "Loading...",
    title: "Loading...",
    profileImage: "https://via.placeholder.com/150",
    coverImage: "https://via.placeholder.com/800x200", // Default cover image
  });

  const fetchProfileData = async () => {
    try {
      const idToFetch = entrepreneurId || user?.uid;

      if (idToFetch) {
        const userDocRef = doc(db, "entrepreneurs", idToFetch);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setProfileData({
            firstName: userData.firstName || userData.username || "Guest User",
            lastName: userData.lastName || "",
            title: userData.title || "No title available",
            profileImage:
              userData.profileImage || "https://via.placeholder.com/150",
            coverImage:
              userData.coverImage || "https://via.placeholder.com/800x200", // Add cover image from userData
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
    if (user?.role === "entrepreneur" && user.uid === user?.uid) {
      return (
        <TouchableOpacity onPress={() => router.push("./EditProfileScreen")}>
          <FontAwesome5 name="edit" size={16} color="#6D4C41" />
        </TouchableOpacity>
      );
    }

    // return (
    //   <TouchableOpacity
    //     style={styles.messageButton}
    //     onPress={() => {
    //       router.push(`/messages/${entrepreneurId}`);
    //     }}
    //   >
    //     <Text style={styles.messageButtonText}>Call</Text>
    //   </TouchableOpacity>
    // );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: profileData.coverImage }}
        style={styles.coverImage}
      >
        <View style={styles.coverOverlay} />
      </ImageBackground>

      <View style={styles.profileContentContainer}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileData.profileImage }}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {profileData.firstName}
                {profileData.lastName}
              </Text>
              <Text style={styles.profession}>{profileData.title}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
  coverImage: {
    width: "100%",
    height: 160,
    marginBottom: -45,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  profileContentContainer: {
    paddingHorizontal: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImageContainer: {
    marginBottom: 0,
  },
  profileImage: {
    width: 105,
    height: 105,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: "white",

  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22, // Adjust this to align with profile image

  },
  nameContainer: {
    flex: 1,
    marginTop: 20, // Adjust this to align with profile image


  },
  name: {
    fontSize: RFValue(21),
    fontFamily: "lato-bold",
    color: "rgba(0, 0, 0, 1)",
  },
  profession: {
    fontSize: RFValue(11),
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "poppins-semibold",
  },
  messageButton: {
    backgroundColor: Colors.secondaryColor,
    paddingVertical: 8,
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
