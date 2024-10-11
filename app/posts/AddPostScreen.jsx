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
import { Colors } from "../../constants/Colors";
import RNPickerSelect from "react-native-picker-select";
import { db, storage } from "../../config/FirebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/Header";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "expo-router"; // Import useRouter
import Loading from "../../components/Loading"; // Import your loading component

export default function AddBid({ onPostAdded }) {
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [title, setTitle] = useState();
  const router = useRouter(); // Initialize router

  useEffect(() => {
    setTitle("Add New Post");
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

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `profile-images/${user.uid}-${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const onAddPost = async () => {
    if (!user) {
      ToastAndroid.show("User not authenticated.", ToastAndroid.BOTTOM);
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (name && address && about && contact && category) {
        let imageUrl = null;

        if (image) {
          imageUrl = await uploadImage(image);
        }

        const postRef = await addDoc(collection(db, "BusinessList"), {
          name,
          address,
          about,
          contact,
          category,
          imageUrl: imageUrl || null,
          userId: user.uid,
          userEmail: user.email,
        });

        const entrepreneurRef = doc(db, "entrepreneurs", user.uid);
        const entrepreneurSnap = await getDoc(entrepreneurRef);

        if (entrepreneurSnap.exists()) {
          const entrepreneurData = entrepreneurSnap.data();
          const existingPosts = entrepreneurData.posts || [];

          const postExists = existingPosts.some(
            (post) => post.postId === postRef.id
          );

          if (!postExists) {
            await updateDoc(entrepreneurRef, {
              posts: arrayUnion({
                postId: postRef.id,
                name,
                about,
                category,
                imageUrl: imageUrl || null,
              }),
            });
          }
        } else {
          await setDoc(entrepreneurRef, {
            posts: [
              {
                postId: postRef.id,
                name,
                about,
                category,
                imageUrl: imageUrl || null,
              },
            ],
          });
        }

        // Show Toast message instead of success message state
        ToastAndroid.show("Post added successfully!", ToastAndroid.BOTTOM);

        // Callback to refresh previous works
        if (onPostAdded) {
          onPostAdded(); // Call the function to refresh previous works
        }

        // Navigate to the user's profile
        router.push("/(tabsEntrepeneur)/profile"); // Adjust the path as necessary

        // Clear form fields
        setName("");
        setAddress("");
        setAbout("");
        setContact("");
        setCategory("");
        setImage(null);
      } else {
        ToastAndroid.show("Please fill all the fields.", ToastAndroid.BOTTOM);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      ToastAndroid.show("Error adding post", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
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
        <TouchableOpacity
          onPress={pickImage}
          style={styles.imagePreviewContainer}
        >
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
          value={name}
          style={styles.input}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Address"
          onChangeText={setAddress}
          value={address}
          style={styles.input}
        />

        <Text style={styles.label}>About</Text>
        <TextInput
          placeholder="About"
          onChangeText={setAbout}
          value={about}
          style={styles.input}
        />

        <Text style={styles.label}>Contact</Text>
        <TextInput
          placeholder="Contact"
          onChangeText={setContact}
          value={contact}
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={setCategory}
            items={categoryList}
            value={category}
          />
        </View>

        {/* Loading or Button */}
        <View style={styles.buttonContainer}>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity onPress={onAddPost} style={styles.button}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          )}
        </View>
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
    marginTop: -20,
  },
  imagePreviewContainer: {
    borderRadius: 10,
    backgroundColor: Colors.GRAY,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    overflow: "hidden", // Ensures padding does not affect image size
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  imagePlaceholderContainer: {
    padding: 20, // Apply padding only when showing the placeholder
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    color: "#888",
    fontFamily: "roboto",
  },
  input: {
    padding: 11,
    paddingStart: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    // backgroundColor: "rgba(211, 113, 69, 0.03)",
    fontFamily: "roboto",
  },
  textarea: {
    height: 100,
  },
  pickerContainer: {
    padding: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    // backgroundColor: "rgba(211, 113, 69, 0.03)",
    fontFamily: "roboto",
  },
  label: {
    color: "#000",
    fontSize: 14,
    marginTop: 20,
    letterSpacing: 0.4,
    fontFamily: "poppins-semibold",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center", // Centering the button or loading spinner

  },
  button: {
    padding: 20,
    width: "100%",
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "roboto-bold",
    textTransform: "uppercase",
    fontSize: 16,
  },
});
