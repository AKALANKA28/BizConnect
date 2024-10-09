import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';

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
          <Text style={styles.publisherLocation}>{post.location}</Text>
          <Text style={styles.postDate}>{post.createdAt}</Text>
        </View>
      </View>

      {/* Image with Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.featuredImage }}
          style={styles.cardImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.cardTitle}>{post.title}</Text>
          <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 15,
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
    width: 50, // Adjusted to match the image size in the design
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  publisherDetails: {
    justifyContent: "center",
  },
  publisherName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Darker color for the name as per the design
  },
  publisherLocation: {
    fontSize: 14,
    color: "#666", // Subtle color for the location
  },
  postDate: {
    fontSize: 12,
    color: "#888", // Lighter color for the date
  },
  imageContainer: {
    position: "relative",
    borderRadius: 15,
    overflow: "hidden", // Ensure the image and overlay follow rounded corners
  },
  cardImage: {
    width: "100%",
    height: 200, // Matches the height from the design
    borderRadius: 15,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for text visibility
    justifyContent: "flex-end", // Align content at the bottom
    padding: 15, // Padding to match the design
  },
  cardTitle: {
    color: "#fff", // White text for readability on dark overlay
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10, // Spacing between title and button
  },
  detailsButton: {
    backgroundColor: "#e3b04b", // Button color matches the image
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25, // Fully rounded button as per design
    alignSelf: "flex-start", // Align the button to the left as in the design
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
