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
import { db } from "../../../config/FirebaseConfig";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { useAuth } from "../../../context/authContext";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // For small icons

const screenWidth = Dimensions.get("window").width;

const WorkImage = ({ source, style, onEdit, onDelete, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.imageWrapper}>
    <Image resizeMode="cover" source={{ uri: source }} style={[styles.workImage, style]} />
    {/* Edit and Delete icons displayed over the image */}
    <View style={styles.overlay}>
      <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
        <MaterialIcons name="edit" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const PreviousWorks = ({ entrepreneurId }) => {
  const { user } = useAuth();
  const [workImages, setWorkImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserImages();
  }, [entrepreneurId]);

  const fetchUserImages = async () => {
    try {
      const entrepreneurDocRef = doc(db, "entrepreneurs", entrepreneurId || user.uid);
      const entrepreneurDocSnap = await getDoc(entrepreneurDocRef);
      if (entrepreneurDocSnap.exists()) {
        const entrepreneurData = entrepreneurDocSnap.data();
        const images = entrepreneurData.posts?.map((post) => ({
          id: post.id, // Use post ID for navigation
          source: post.imageUrl,
          height: 250,
        })) || [];
        setWorkImages(images);
      }
    } catch (error) {
      console.error("Error fetching images: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (postId) => {
    const post = workImages.find((item) => item.id === postId);
    if (post) {
      router.push({
        pathname: "/posts/AddPostScreen",
        params: { postId, source: post.source },
      });
    }
  };

  const handleDelete = async (postId) => {
    try {
      const entrepreneurDocRef = doc(db, "entrepreneurs", entrepreneurId || user.uid);
      const postToDelete = workImages.find((item) => item.id === postId);

      await updateDoc(entrepreneurDocRef, {
        posts: arrayRemove(postToDelete),
      });

      setWorkImages((prevImages) => prevImages.filter((item) => item.id !== postId));
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  const handleNavigateToDetails = (businessId) => {
    router.push(`/businessdetails/${encodeURIComponent(businessId)}`);
  };

  const column1Images = workImages.filter((_, index) => index % 2 === 0);
  const column2Images = workImages.filter((_, index) => index % 2 !== 0);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Previous Works</Text>
        {user?.role === "entrepreneur" && (
          <TouchableOpacity style={styles.addNewButton} onPress={() => router.push("/posts/AddPostScreen")}>
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView>
          <View style={styles.imageGrid}>
            <View style={styles.imageColumn}>
              {column1Images.map((item, index) => (
                <WorkImage
                  key={index}
                  source={item.source}
                  style={{ height: item.height, width: "100%" }}
                  onEdit={() => handleEdit(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onPress={() => handleNavigateToDetails(item.id)}  // Use item.id for navigation
                />
              ))}
            </View>

            <View style={styles.imageColumn}>
              {column2Images.map((item, index) => (
                <WorkImage
                  key={index}
                  source={item.source}
                  style={{ height: item.height, width: "100%" }}
                  onEdit={() => handleEdit(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onPress={() => handleNavigateToDetails(item.id)}  // Use item.id for navigation
                />
              ))}
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageColumn: {
    width: "49%",
  },
  imageWrapper: {
    position: "relative",
  },
  workImage: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  overlay: {
    position: "absolute",
    top: 5,
    right: 5,
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
    marginLeft: 5,
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
});

export default PreviousWorks;
