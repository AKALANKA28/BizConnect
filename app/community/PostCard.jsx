import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";
import { useRouter,useSearchParams } from 'expo-router';

export default function PostCard({ post }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push({
      pathname: '/community/CollabSpace',
      params: { postId: post.id }, // Pass only the post ID
    });
  };


  return (
    <View style={styles.cardContainer}>
      {/* Publisher Info */}
      <View style={styles.publisherInfo}>
        <Image source={{ uri: post.profileImage }} style={styles.profileImage} />
        <View style={styles.publisherDetails}>
          <Text style={styles.publisherName}>{post.userName}</Text>
          <Text style={styles.publisherCity}>{post.location}</Text>
          <Text style={styles.publisherCity}>{post.createdAt}</Text>
        </View>
      </View>

      {/* Post Info */}
      <Image
        source={{ uri: post.featuredImage}}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{post.title}</Text>
        <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  publisherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 40, // Adjusted for a smaller profile image
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  publisherDetails: {
    justifyContent: "center",
  },
  publisherName: {
    fontSize: 16,
    fontFamily: "roboto-bold",
    color: Colors.text,
  },
  publisherCity: {
    fontSize: 14,
    fontFamily: "roboto",
    color: Colors.secondaryColor,
  },
  cardImage: {
    width: "100%",
    height: 200, // Increased to match the design
    borderRadius: 10, // Add border-radius for rounded corners
  },
  cardContent: {
    paddingTop: 10, // Adjusted to add space above the text
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: "#f4a261", // Adjusted to the color matching the UI
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start", // Align button to the left
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 16, // Increased font size for better readability
    fontWeight: "bold", // Bold text as per UI
  },
});
