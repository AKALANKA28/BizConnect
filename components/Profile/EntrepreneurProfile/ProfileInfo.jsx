import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig"; // Firestore instance
import { useAuth } from "../../../context/authContext"; // Importing useAuth for current user
import { Colors } from "../../../constants/Colors"; // Import Colors for consistency

const ProfileInfo = ({ entrepreneurId }) => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [bio, setBio] = useState(""); // State to hold the bio
  const [loading, setLoading] = useState(true); // Loading state
  const [expanded, setExpanded] = useState(false); // State to toggle read more/less

  // Function to fetch the entrepreneur's profile info from Firestore
  const fetchUserProfile = async () => {
    try {
      const idToFetch = entrepreneurId || user?.uid; // Use provided entrepreneurId or current user's ID
      const userDocRef = doc(db, "entrepreneurs", idToFetch); // Reference to entrepreneur's document
      const userDocSnap = await getDoc(userDocRef); // Fetch document snapshot

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log(userData);
        
        setBio(userData.bio || "No bio available"); // Set bio or default if not available
      } else {
        console.log("No document found for this UID:", idToFetch); // Log if no document is found
        setBio("No bio available"); // Default message if no document exists
      }
    } catch (error) {
      console.error("Error fetching user profile from Firestore:", error); // Log errors
      setBio("Failed to fetch bio."); // Error message if fetching fails
    } finally {
      setLoading(false); // Set loading to false after data fetch
    }
  };

  // Fetch profile info when the component mounts or entrepreneurId changes
  useEffect(() => {
    if (entrepreneurId || user) {
      fetchUserProfile(); // Fetch profile if UID is provided or user is logged in
    }
  }, [entrepreneurId, user]);

  return (
    <View style={styles.container}>
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About Me</Text>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.secondaryColor} />
        ) : (
          <Text style={styles.aboutText}>
            {expanded ? bio : bio.length > 100 ? `${bio.substring(0, 100)}...` : bio}
          </Text>
        )}
        {bio.length > 100 && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMore}>
              {expanded ? "read less" : "read more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10, // Vertical margin for spacing
  },
  aboutSection: {
    flex: 1,
  },
  aboutTitle: {
    color: "rgba(141, 110, 99, 1)", // Brownish title color
    fontFamily: "poppins-semibold", // Using poppins-semibold font
    marginBottom: 8,
    fontSize: 17,
  },
  aboutText: {
    fontFamily: "poppins", // Using regular poppins font
    fontSize: 14,
    lineHeight: 22, // Line height for better readability
    color: "#333", // Dark text color
  },
  readMore: {
    color: Colors.secondaryColor, // Use secondary color from constants
    textDecorationLine: "underline", // Underline the read more/read less text
    marginTop: 5, // Spacing between bio and read-more text
    fontSize: 14,
    fontFamily: "poppins-semibold", // Consistent font for read more
  },
});

export default ProfileInfo;
