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
  FlatList,
  Alert,
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
import { useRouter } from "expo-router";
import Loading from "../../components/Loading";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AddBid({ onPostAdded }) {
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [title, setTitle] = useState("");
  const router = useRouter();

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload images.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    }
    return true;
  };

  useEffect(() => {
    setTitle("Add New Post");
    fetchCategoryList();
    requestPermissions();
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
      ToastAndroid.show("Error loading categories", ToastAndroid.BOTTOM);
    }
  };

  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages(currentImages => {
          const updatedImages = [...currentImages, ...newImages];
          return updatedImages.slice(0, 5);
        });
      }
    } catch (error) {
      console.error("Error picking images: ", error);
      ToastAndroid.show("Error selecting images", ToastAndroid.BOTTOM);
    }
  };

  const removeImage = (index) => {
    setImages(currentImages => 
      currentImages.filter((_, i) => i !== index)
    );
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageItemContainer}>
      <Image source={{ uri: item }} style={styles.imagePreview} />
      <TouchableOpacity 
        style={styles.removeImageButton}
        onPress={() => removeImage(index)}
      >
        <Ionicons name="close-circle" size={24} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );

  const uploadImages = async (imageUris) => {
    const uploadPromises = imageUris.map(async (uri) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `business-images/${user.uid}-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, blob);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  };

  const validateInputs = () => {
    if (!name.trim()) {
      ToastAndroid.show("Please enter a title", ToastAndroid.BOTTOM);
      return false;
    }
    if (!address.trim()) {
      ToastAndroid.show("Please enter a location", ToastAndroid.BOTTOM);
      return false;
    }
    if (!about.trim()) {
      ToastAndroid.show("Please enter description", ToastAndroid.BOTTOM);
      return false;
    }
    if (!contact.trim()) {
      ToastAndroid.show("Please enter contact information", ToastAndroid.BOTTOM);
      return false;
    }
    if (!category) {
      ToastAndroid.show("Please select a category", ToastAndroid.BOTTOM);
      return false;
    }
    return true;
  };

  const onAddPost = async () => {
    if (!user) {
      ToastAndroid.show("User not authenticated", ToastAndroid.BOTTOM);
      return;
    }

    if (loading) return;
    
    if (!validateInputs()) return;

    setLoading(true);

    try {
      let imageUrls = [];

      if (images.length > 0) {
        imageUrls = await uploadImages(images);
      }

      const postRef = await addDoc(collection(db, "BusinessList"), {
        name: name.trim(),
        address: address.trim(),
        about: about.trim(),
        contact: contact.trim(),
        category,
        images: imageUrls,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
      });

      const entrepreneurRef = doc(db, "entrepreneurs", user.uid);
      const entrepreneurSnap = await getDoc(entrepreneurRef);

      if (entrepreneurSnap.exists()) {
        await updateDoc(entrepreneurRef, {
          posts: arrayUnion({
            postId: postRef.id,
            name: name.trim(),
            about: about.trim(),
            category,
            images: imageUrls,
          }),
        });
      } else {
        await setDoc(entrepreneurRef, {
          posts: [{
            postId: postRef.id,
            name: name.trim(),
            about: about.trim(),
            category,
            images: imageUrls,
          }],
        });
      }

      ToastAndroid.show("Post added successfully!", ToastAndroid.BOTTOM);
      if (onPostAdded) onPostAdded();
      router.push("/(tabsEntrepeneur)/profile");

      // Clear form
      setName("");
      setAddress("");
      setAbout("");
      setContact("");
      setCategory("");
      setImages([]);
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
        <Text style={styles.label}>Images (Max 5)</Text>
        <TouchableOpacity
          onPress={pickImages}
          style={[
            styles.imagePreviewContainer,
            images.length === 0 && styles.emptyImageContainer
          ]}
        >
          {images.length > 0 ? (
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesList}
            />
          ) : (
            <View style={styles.imagePlaceholderContainer}>
              <Text style={styles.imagePlaceholder}>Tap to Add Images</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Name"
          onChangeText={setName}
          value={name}
          style={styles.input}
          maxLength={50}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Address"
          onChangeText={setAddress}
          value={address}
          style={styles.input}
          maxLength={100}
        />

        <Text style={styles.label}>About</Text>
        <TextInput
          placeholder="About"
          onChangeText={setAbout}
          value={about}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        <Text style={styles.label}>Contact</Text>
        <TextInput
          placeholder="Contact"
          onChangeText={setContact}
          value={contact}
          style={styles.input}
          maxLength={50}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={setCategory}
            items={categoryList}
            value={category}
            placeholder={{ label: "Select a category", value: null }}
            style={{
              inputIOS: styles.pickerInput,
              inputAndroid: styles.pickerInput,
            }}
          />
        </View>

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
    paddingBottom: 40,
  },
  imagePreviewContainer: {
    minHeight: 200,
    borderRadius: 10,
    backgroundColor: Colors.GRAY,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: '#ccc',
    overflow: "hidden",
    marginTop: 8,
  },
  emptyImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagesList: {
    padding: 10,
  },
  imageItemContainer: {
    marginRight: 10,
    position: 'relative',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  imagePlaceholderContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    color: "#888",
    fontFamily: "roboto",
  },
  input: {
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    fontFamily: "roboto",
    fontSize: 16,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  pickerInput: {
    fontFamily: "roboto",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: '#000',
  },
  label: {
    color: "#000",
    fontSize: 16,
    marginTop: 20,
    letterSpacing: 0.4,
    fontFamily: "poppins-semibold",
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
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
    letterSpacing: 1,
  },
});