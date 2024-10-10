import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useAuth } from "../../../context/authContext"; // Importing useAuth hook
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig"; // Firestore instance

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const ProfileStats = () => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [postCount, setPostCount] = useState(0); // State to hold post count

  // Function to fetch the image URL count from Firestore
  const fetchImageUrlCount = async () => {
    if (user) {
      try {
        // Reference to the user's document in the "BusinessList" collection
        const userDocRef = doc(db, "BusinessList", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const imageUrls = userData.imageUrls || []; // Assuming imageUrls is an array of URLs
          setPostCount(imageUrls.length); // Set the post count based on the number of image URLs
        } else {
          // console.log("No such user document in BusinessList!");
        }
      } catch (error) {
        console.error("Error fetching image URL count: ", error);
      }
    }
  };

  // Fetch image URL count when component mounts
  useEffect(() => {
    fetchImageUrlCount();
  }, [user]);

  const stats = [
    { label: "On Going Orders", value: "5" },
    { label: "Connectors", value: "10" },
    { label: "Post Count", value: postCount.toString() }, // Dynamic post count (image URL count)
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <StatItem key={index} label={stat.label} value={stat.value} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 7,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "#A8A8A8",
    fontSize: 12,
    fontFamily: "poppins",
  },
  statValue: {
    color: "#262626",
    fontSize: 22,
    fontFamily: "poppins-bold",
    marginTop: 4,
  },
});

export default ProfileStats;
