import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import RNPickerSelect from "react-native-picker-select";
import { db } from "../../config/FirebaseConfig";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/Header";
import { getAuth } from "firebase/auth";

export default function AddBid() {
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [categories, setCategories] = useState("");
  const [image, setImage] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const [title, setTitle] = useState();

  useEffect(() => {
    setTitle("Add New Post"); // Update title dynamically as required
    fetchCategoryList();
    requestCameraPermission();
  }, []);

  const fetchCategoryList = async () => {
    setCategoryList([]);
    try {
      const q = query(collection(db, "Category"));
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map((doc) => ({
        label: doc.data().name,
        value: doc.data().name,
      }));
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onAddPost = async () => {
    try {
      if (name && address && about && contact && categories) {
        await addDoc(collection(db, "BusinessList"), {
          name, // Test name
          address, // Address (e.g., Homagama)
          about, // Description or about (e.g., test2)
          contact, // Contact info (e.g., "number 2")
          categories, // Category (e.g., Wicker)
          imageUrl: image || null, // Image URL from picker or default
          userId: user ? user.uid : null, // Add userId
          userEmail: user ? user.email : null, // Add userEmail
        });
        ToastAndroid.show("Post Added Successfully", ToastAndroid.BOTTOM);
        router.push("posts");
      } else {
        ToastAndroid.show("Please fill all the fields.", ToastAndroid.BOTTOM);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      ToastAndroid.show("Error adding post", ToastAndroid.BOTTOM);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header title={title} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Image</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePreviewContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholderContainer}>
              <Text style={styles.imagePlaceholder}>Tap to Add Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Name"
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Address"
          onChangeText={setAddress}
          style={styles.input}
        />

        <Text style={styles.label}>About</Text>
        <TextInput
          placeholder="About"
          onChangeText={setAbout}
          style={styles.input}
        />

        <Text style={styles.label}>Contact</Text>
        <TextInput
          placeholder="Contact"
          onChangeText={setContact}
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect onValueChange={setCategories} items={categoryList} />
        </View>

        <TouchableOpacity onPress={onAddPost} style={styles.button}>
          <Text style={styles.buttonText}>Post</Text>
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
  imagePreviewContainer: {
    borderRadius: 10,
    backgroundColor: Colors.GRAY,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 2,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  imagePlaceholderContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    color: "#888",
  },
  input: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.GRAY,
    marginVertical: 10,
  },
  pickerContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.GRAY,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
  },
});
