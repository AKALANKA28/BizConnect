import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/FirebaseConfig";
import Header from "./Header";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/authContext";
import { v4 as uuidv4 } from "uuid"; // For generating unique image names
import 'react-native-get-random-values';


export default function CollabSpaceForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [goals, setGoals] = useState([""]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [moreImages, setMoreImages] = useState([]);

  useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need media library permissions to make this work!");
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageName = `collabspace-images/${uuidv4()}.jpg`; // Unique image name
      const storageRef = ref(storage, imageName);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  // Picking the featured image and uploading it
  const pickFeaturedImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const downloadUrl = await uploadImage(result.assets[0].uri);
      if (downloadUrl) setFeaturedImage(downloadUrl);
    }
  };

  // Picking more images and uploading them
  const pickMoreImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const downloadUrl = await uploadImage(result.assets[0].uri);
      if (downloadUrl) setMoreImages([...moreImages, downloadUrl]);
    }
  };

  const addGoalInput = () => {
    setGoals([...goals, ""]);
  };

  const handleGoalChange = (index, value) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const onSubmit = async () => {
    try {
      if (title && description && goals.length && featuredImage) {
        // Save the CollabSpace document
        const collabSpaceDoc = await addDoc(collection(db, "CollabSpaces"), {
          title,
          description,
          location,
          goals,
          featuredImage, // Firebase Storage URL
          moreImages,    // Array of Firebase Storage URLs
          userId: user.uid,
          userEmail: user.email,
          userName: user.username,
          createdAt: new Date().toISOString(),
        });

        // Create a chat room document
        const chatRoomDoc = await addDoc(collection(db, "ChatRooms"), {
          collabSpaceId: collabSpaceDoc.id,
          members: [user.uid],
          createdAt: new Date().toISOString(),
          title: `Chat Room for ${title}`,
        });

        // Update the CollabSpace with the chatRoomId
        const collabSpaceRef = doc(db, "CollabSpaces", collabSpaceDoc.id);
        await updateDoc(collabSpaceRef, {
          chatRoomId: chatRoomDoc.id,
        });

        ToastAndroid.show("CollabSpace Added Successfully", ToastAndroid.BOTTOM);
      } else {
        ToastAndroid.show("Please fill all fields", ToastAndroid.BOTTOM);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      ToastAndroid.show("Error adding CollabSpace", ToastAndroid.BOTTOM);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header title="Create New CollabSpace" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Form Fields */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 100 }]}
          multiline
        />
        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={[styles.input]}
          multiline
        />
        <Text style={styles.label}>Goals</Text>
        {goals.map((goal, index) => (
          <TextInput
            key={index}
            placeholder="Goal"
            value={goal}
            onChangeText={(text) => handleGoalChange(index, text)}
            style={styles.input}
          />
        ))}
        <TouchableOpacity onPress={addGoalInput} style={styles.addButton}>
          <Ionicons name="add-outline" size={20} color={Colors.secondaryColor} />
        </TouchableOpacity>

        <Text style={styles.label}>Featured Image</Text>
        <TouchableOpacity onPress={pickFeaturedImage} style={styles.imagePicker}>
          {featuredImage ? (
            <Image source={{ uri: featuredImage }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePlaceholder}>Choose File</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Add More Images</Text>
        {moreImages.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.imagePreview} />
        ))}
        <TouchableOpacity onPress={pickMoreImages} style={styles.imagePicker}>
          <Text style={styles.imagePlaceholder}>Choose File</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    color: "#000",
    fontSize: 14,
    marginTop: 20,
    fontFamily: "poppins-semibold",
  },
  input: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.GRAY,
    marginTop: 10,
  },
  addButton: {
    marginTop: 10,
    alignItems: "center",
  },
  imagePicker: {
    padding: 15,
    backgroundColor: Colors.GRAY,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: "#888",
  },
  submitButton: {
    padding: 20,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
  },
});
