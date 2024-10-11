import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native"; // Import ToastAndroid for toast messages
import { db } from "../../../config/FirebaseConfig";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  getDoc,
} from "firebase/firestore"; // Import necessary Firestore functions
import { getAuth } from "firebase/auth";
import { router } from "expo-router";
import { useAuth } from "../../../context/authContext";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../../../constants/Colors";
import Loading from "../../Loading";
import WorkImage from "./WorkImage";

const PreviousWorks = ({ entrepreneurId }) => {
  const { user } = useAuth();
  const [workImages, setWorkImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchUserImages();
  }, [entrepreneurId]);

  const fetchUserImages = async () => {
    try {
      const idToFetch = entrepreneurId || currentUser?.uid;
      const entrepreneurDocRef = doc(db, "entrepreneurs", idToFetch);
      const entrepreneurDocSnap = await getDoc(entrepreneurDocRef);

      if (entrepreneurDocSnap.exists()) {
        const entrepreneurData = entrepreneurDocSnap.data();
        const images =
          entrepreneurData.posts?.map((post) => ({
            source: post.imageUrl,
            businessId: post.postId,
            height: 150,
          })) || [];
        setWorkImages(images);
      } else {
        console.log("No entrepreneur found with the provided ID:", idToFetch);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    // Check if the user role is not entrepreneur
    if (user?.role !== "entrepreneur") {
      Alert.alert(
        "Permission Denied",
        "You do not have permission to delete this post.",
        [{ text: "OK" }]
      );
      return; // Exit the function if user is not an entrepreneur
    }

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const idToFetch = entrepreneurId || currentUser?.uid;

              // Step 1: Delete the corresponding document in the `BusinessList` collection
              const businesslistRef = collection(db, "BusinessList");
              const postDocRef = doc(businesslistRef, postId); // Use the postId as the document ID
              await deleteDoc(postDocRef); // Delete the matching business post

              // Step 2: Now delete the post from the `entrepreneurs` collection
              const entrepreneurDocRef = doc(db, "entrepreneurs", idToFetch);
              const entrepreneurDocSnap = await getDoc(entrepreneurDocRef);

              if (entrepreneurDocSnap.exists()) {
                const entrepreneurData = entrepreneurDocSnap.data();
                // Filter out the post with the specified postId
                const updatedPosts = entrepreneurData.posts.filter(
                  (post) => post.postId !== postId
                );

                // Update the Firestore document with the new posts array
                await updateDoc(entrepreneurDocRef, { posts: updatedPosts });

                // Update local state to reflect the changes
                setWorkImages(workImages.filter((image) => image.businessId !== postId));

                ToastAndroid.show("Post deleted successfully!", ToastAndroid.SHORT);
              }
            } catch (error) {
              console.error("Error deleting post:", error);
              ToastAndroid.show("Error deleting post.", ToastAndroid.SHORT);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const splitIntoColumns = (columnNumber) =>
    workImages.filter((_, index) => index % 3 === columnNumber);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Previous Works</Text>
        {user?.role === "entrepreneur" && (
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => router.push("/posts/AddPostScreen")}
          >
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <View style={styles.imageGrid}>
            {[0, 1, 2].map((col) => (
              <View style={styles.imageColumn} key={col}>
                {splitIntoColumns(col).length > 0 ? (
                  splitIntoColumns(col).map((item, index) => (
                    <WorkImage
                      key={index}
                      source={item.source}
                      style={{ height: item.height, width: "100%" }}
                      onPress={() =>
                        router.push("/businessdetails/" + item.businessId)
                      }
                      onDelete={() => handleDeletePost(item.businessId)} // Pass handleDeletePost to delete the post
                    />
                  ))
                ) : (
                  <Text style={styles.noPostsText}></Text>
                )}
              </View>
            ))}
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
    fontFamily: "lato-bold",
    fontSize: RFValue(15),
    marginBottom: 14,
  },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  imageColumn: {
    width: "32.8%",
  },
  workImage: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  addNewButton: {
    backgroundColor: Colors.secondaryColor,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  addNewText: {
    color: "#FFF",
    fontSize: RFValue(12),
    fontFamily: "lato-bold",
  },
  noPostsText: {
    fontFamily: "poppins",
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  confirmationMessage: {
    fontFamily: "poppins",
    fontSize: 16,
    color: Colors.successColor, // Change to your desired success color
    textAlign: "center",
    marginVertical: 10,
  },
});

export default PreviousWorks;
