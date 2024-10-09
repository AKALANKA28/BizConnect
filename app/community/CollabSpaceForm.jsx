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
import { addDoc, updateDoc,doc, collection } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Header from "./Header";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/authContext";

export default function CollabSpaceForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [goals, setGoals] = useState([""]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [moreImages, setMoreImages] = useState([]);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  const pickFeaturedImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFeaturedImage(result.assets[0].uri);
    }
  };

  const pickMoreImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMoreImages([...moreImages, result.assets[0].uri]);
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

  const today = new Date();
  const createdAt = today.toISOString().split('T')[0]; // YYYY-MM-DD format

  const onSubmit = async () => {
    try {
      if (title && description && goals.length && featuredImage) {
        // Step 1: Save the CollabSpace document
        const collabSpaceDoc = await addDoc(collection(db, "CollabSpaces"), {
          title,
          description,
          location,
          goals,
          featuredImage,
          moreImages,
          userId: user.uid, // Add userId from the logged-in user
          userEmail: user.email, // Add userEmail from the logged-in user
          userName: user.username, // Add userName from the logged-in user
          createdAt: createdAt,
        });
  
        // Step 2: Create a chat room document
        const chatRoomDoc = await addDoc(collection(db, "ChatRooms"), {
          collabSpaceId: collabSpaceDoc.id, // Link to the CollabSpace
          members: [user.uid], // Add the creator as a member
          createdAt: createdAt,
          title: `Chat Room for ${title}`, // Optional title for the chat room
        });
  
        // Step 3: Update the CollabSpace document with the chatRoomId
        const collabSpaceRef = doc(db, "CollabSpaces", collabSpaceDoc.id); // Reference to the CollabSpace document
        await updateDoc(collabSpaceRef, {
          chatRoomId: chatRoomDoc.id, // Save the chat room document ID in the CollabSpace document
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
