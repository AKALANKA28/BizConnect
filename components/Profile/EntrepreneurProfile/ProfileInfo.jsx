import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useAuth } from "../../../context/authContext"; // Import useAuth hook
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig"; // Firestore instance
import { Colors } from "../../../constants/Colors";

const ProfileInfo = () => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [bio, setBio] = useState(""); // State to hold bio

  // Function to fetch the bio and other profile info from Firestore
  const fetchUserProfile = async () => {
    if (user) {
      try {
        // Reference to the user's document in Firestore
        const userDocRef = doc(db, "entrepreneurs", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setBio(userData.bio || "No bio available"); // Set bio or a fallback message
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
  };

  // Fetch profile info when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About Me</Text>
        <Text style={styles.aboutText}>
          {bio.length > 100 ? `${bio.substring(0, 100)}... ` : bio}{" "}
          {bio.length > 100 && <Text style={styles.readMore}>read more</Text>}
        </Text>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  aboutSection: {
    flex: 1,
  },
  aboutTitle: {
    color: "rgba(141, 110, 99, 1)",
    fontFamily: "poppins-semibold",
    marginBottom: 8,
    fontSize: 17,
  },
  aboutText: {
    fontFamily: "poppins",
    fontSize: 14,
    lineHeight: 22,
  },
  readMore: {
    color: Colors.secondaryColor,
    textDecorationLine: "underline",
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});

export default ProfileInfo;
