import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useAuth } from "../../../context/authContext"; // Import useAuth hook
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig"; // Firestore instance

const AboutMe = () => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [bio, setBio] = useState(""); // State to hold bio

  // Function to fetch the bio from Firestore
  const fetchUserBio = async () => {
    if (user) {
      try {
        // Reference to the user's document in Firestore
        const userDocRef = doc(db, "buyers", user.uid);
        const userDocSnap = await getDoc(userDocRef);
 
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setBio(userData.bio || "No bio available"); // Set bio or a fallback message
          console.log( userData);

        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user bio: ", error);
      }
    }
  };

  
  // Fetch bio when component mounts
  useEffect(() => {
    fetchUserBio();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ABOUT ME</Text>
      <Text style={styles.description}>{bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  title: {
    color: "rgba(141, 110, 99, 1)",
    fontFamily: "poppins-semibold",
    fontSize: 19,
  },
  description: {
    color: "#262626",
    fontFamily: "poppins",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
});

export default AboutMe;
