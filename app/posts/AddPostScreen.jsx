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

export default function AddBid() {
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(null); 
  const auth = getAuth();
  const user = auth.currentUser;
  const [title, setTitle] = useState();

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

        setSuccessMessage("Post Added Successfully");

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
        {successMessage && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>{successMessage}</Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setSuccessMessage(null)} 
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        )}

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
  successMessageContainer: {
    backgroundColor: Colors.primaryColor,
    padding: 60,
    borderRadius: 10,
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  successMessage: {
    color: Colors.WHITE,
    fontSize: 18,
  },
  okButton: {
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    marginTop: 20,
    padding: 10,
  },
  okButtonText: {
    color: Colors.BLACK,
  },
});
