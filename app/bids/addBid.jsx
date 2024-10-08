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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { getAuth } from "firebase/auth";

export default function AddBid() {
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [image, setImage] = useState(null);
  const [bidClosingTime, setBidClosingTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const auth = getAuth();
  const user = auth.currentUser;
  const [title, setTitle] = useState();

  useEffect(() => {
    setTitle("Add Details"); // Update title dynamically as required
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

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "set") {
      setSelectedDate(selectedDate || selectedDate);
      setBidClosingTime(
        new Date(
          selectedDate.setHours(
            selectedTime.getHours(),
            selectedTime.getMinutes()
          )
        )
      );
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === "set") {
      setSelectedTime(selectedTime || selectedTime);
      setBidClosingTime(
        new Date(
          selectedDate.setHours(
            selectedTime.getHours(),
            selectedTime.getMinutes()
          )
        )
      );
    }
  };

  const onAddPost = async () => {
    try {
      if (name && address && description && categories && bidClosingTime) {
        // Include the user data (uid and email) when adding the post
        await addDoc(collection(db, "Bids"), {
          name,
          address,
          description,
          categories,
          image: image || null,
          bidClosingTime,
          userId: user ? user.uid : null, // Add userId
          userEmail: user ? user.email : null, // Add userEmail
        });
        ToastAndroid.show("Post Added Successfully", ToastAndroid.BOTTOM);
        router.push("bids");
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
        <Text
          style={{
            color: "#000",
            fontSize: 14,
            marginTop: -15,
            letterSpacing: 0.4,
            fontFamily: "poppins-semibold",
          }}
        >
          Image
        </Text>
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

        <Text style={styles.label}>Bid Label</Text>
        <TextInput
          placeholder="Title"
          onChangeText={setName}
          style={styles.input}
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          placeholder="Address"
          onChangeText={setAddress}
          style={styles.input}
        />
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect onValueChange={setCategories} items={categoryList} />
        </View>

        <Text style={styles.label}>Bid Closing Time</Text>
        <View style={styles.datePickerContainer}>
          {/* Date Picker Button */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {selectedDate.toLocaleDateString()}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Time Picker Button */}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {selectedTime.toLocaleTimeString()}
            </Text>
            <Ionicons
              name="time-outline"
              size={16}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          multiline
          numberOfLines={5}
          placeholder="Description"
          onChangeText={setDescription}
          style={[styles.input, styles.textarea]}
        />

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
    padding: 15,
    paddingStart: 25,
    borderRadius: 30,
    backgroundColor: Colors.GRAY,
    fontFamily: "roboto",
  },
  textarea: {
    height: 100,
  },
  pickerContainer: {
    padding: 5,
    borderRadius: 30,
    backgroundColor: Colors.GRAY,
  },

  button: {
    padding: 20,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 30,
    marginTop: 20,
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
  },
  label: {
    color: "#000",
    fontSize: 14,
    marginTop: 20,
    letterSpacing: 0.4,
    fontFamily: "poppins-semibold",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    justifyContent: "space-between",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    backgroundColor: Colors.GRAY,
    justifyContent: "space-between",
  },
  datePickerText: {
    fontFamily: "roboto",
    color: "#000",
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
