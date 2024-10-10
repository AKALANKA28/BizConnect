import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { db } from "../../../config/FirebaseConfig"; // Import your Firebase config
import { doc, getDoc } from "firebase/firestore"; // Importing the necessary Firestore methods
import { getAuth } from "firebase/auth";
import { router } from "expo-router";
import { useAuth } from "../../../context/authContext"; // Import useAuth hook

const screenWidth = Dimensions.get("window").width;

const WorkImage = ({ source, style }) => (
  <Image
    resizeMode="cover"
    source={{ uri: source }}
    style={[styles.workImage, style]} // Apply both default and dynamic styles
    onError={(e) => console.error("Image loading error: ", e)} // Log image load errors
  />
);

const PreviousWorks = ({ entrepreneurId }) => { // Accept entrepreneurId prop
  const { user } = useAuth(); // Get the currently logged-in user
  const [workImages, setWorkImages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    console.log("Entrepreneur ID:", entrepreneurId); // Debugging line
    fetchUserImages(); // Fetch images when the component mounts or entrepreneurId changes
  }, [entrepreneurId]); // Fetch images when entrepreneurId changes

  const fetchUserImages = async () => {
    try {
      const idToFetch = entrepreneurId || currentUser?.uid; // Use provided entrepreneurId or current user's ID
      const entrepreneurDocRef = doc(db, "entrepreneurs", idToFetch);
      const entrepreneurDocSnap = await getDoc(entrepreneurDocRef);
  
      if (entrepreneurDocSnap.exists()) {
        const entrepreneurData = entrepreneurDocSnap.data();
        console.log("Entrepreneur Data:", entrepreneurData);
        
        const images = entrepreneurData.posts?.map((post) => ({
          source: post.imageUrl, // Ensure this is the correct property
          height: 250,
        })) || [];
        
        setWorkImages(images);
      } else {
        console.log("No entrepreneur found with the provided ID:", idToFetch);
      }
    } catch (error) {
      console.error("Error fetching images: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Split images into two columns
  const column1Images = workImages.filter((_, index) => index % 2 === 0); // Even index images
  const column2Images = workImages.filter((_, index) => index % 2 !== 0); // Odd index images

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Previous Works</Text>
        {user?.role === "entrepreneur" && ( // Show the button only for entrepreneurs
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => router.push("/posts/AddPostScreen")}
          >
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? ( // Show loading spinner while fetching images
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView>
          <View style={styles.imageGrid}>
            <View style={styles.imageColumn}>
              {column1Images.length > 0 ? ( // Check if there are images to display
                column1Images.map((item, index) => (
                  <WorkImage
                    key={index}
                    source={item.source}
                    style={{ height: item.height, width: "100%" }} // Set dynamic height, full width
                  />
                ))
              ) : (
                <Text style={styles.noPostsText}>No posts available</Text> // Show message if no posts
              )}
            </View>

            <View style={styles.imageColumn}>
              {column2Images.length > 0 ? ( // Check if there are images to display
                column2Images.map((item, index) => (
                  <WorkImage
                    key={index}
                    source={item.source}
                    style={{ height: item.height, width: "100%" }} // Set dynamic height, full width
                  />
                ))
              ) : (
                <Text style={styles.noPostsText}>No posts available</Text> // Show message if no posts
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  title: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "poppins-semibold",
    fontSize: 17,
    marginLeft: 16,
    marginBottom: 14,
    textAlign: "left",
  },
  imageGrid: {
    flexDirection: "row", // Keep two columns side by side
    justifyContent: "space-between", // Space between the columns
  },
  imageColumn: {
    width: "49%", // Each column takes up 49% of the width to leave space between columns
  },
  workImage: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  addNewButton: {
    backgroundColor: "rgba(170, 106, 28, 1)",
    borderRadius: 50,
    padding: 7,
  },
  addNewText: {
    color: "#FFF",
    fontSize: 12,
  },
  noPostsText: {
    fontFamily: "poppins",
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});

export default PreviousWorks;
