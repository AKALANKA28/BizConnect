import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, Dimensions, ScrollView } from "react-native";
import { db } from "../../../config/FirebaseConfig"; // Import your Firebase config
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const screenWidth = Dimensions.get("window").width;

const WorkImage = ({ source, style }) => (
  <Image
    resizeMode="cover"
    source={{ uri: source }}
    style={[styles.workImage, style]} // Apply both default and dynamic styles
  />
);

const PreviousWorks = () => {
  const [workImages, setWorkImages] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUserImages();
    }
  }, [user]);

  const fetchUserImages = async () => {
    try {
      const q = query(
        collection(db, "BusinessList"),
        where("userId", "==", user.uid) // Filter based on uid
      );
      const querySnapshot = await getDocs(q);
      const images = querySnapshot.docs.map((doc) => ({
        source: doc.data().imageUrl,
        height: 250, // You can dynamically set height if needed
      }));
      setWorkImages(images);
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  // Split images into two columns
  const column1Images = workImages.filter((_, index) => index % 2 === 0); // Even index images
  const column2Images = workImages.filter((_, index) => index % 2 !== 0); // Odd index images

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previous Works</Text>

      <ScrollView>
        <View style={styles.imageGrid}>
          <View style={styles.imageColumn}>
            {column1Images.map((item, index) => (
              <WorkImage
                key={index}
                source={item.source}
                style={{ height: item.height, width: "100%" }} // Set dynamic height, full width
              />
            ))}
          </View>

          <View style={styles.imageColumn}>
            {column2Images.map((item, index) => (
              <WorkImage
                key={index}
                source={item.source}
                style={{ height: item.height, width: "100%" }} // Set dynamic height, full width
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
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
});

export default PreviousWorks;
