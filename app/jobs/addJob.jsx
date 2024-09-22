import { View, Text, TouchableOpacity, TextInput, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import RNPickerSelect from "react-native-picker-select";
import { db } from "../../config/FirebaseConfig";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

export default function addJob() {
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState([]);

  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [categories, setCategories] = useState();
// const[loading, setLoading] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Post",
      headerShown: true,
    });
    GetCategoryList();
  }, []);

  const GetCategoryList = async () => {
    setCategoryList([]);
    const q = query(collection(db, "Category"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log( doc.data());
      setCategoryList((prev) => [
        ...prev,
        {
          label: doc.data().name,
          value: doc.data().name,
        },
      ]);
    });
  };

  const onAddPost = async () => {
    // setLoading(true);
    if (name && address && description && categories) {
      await addDoc(collection(db, "jobs"), {
        name,
        address,
        description,
        categories,
      });
      // setLoading(false);
      ToastAndroid.show("Post Added Successfully", ToastAndroid.BOTTOM);
      navigation.push("(tabs)");
    }
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: Colors.primaryColor,
        height: "100%",
      }}
    >
      <Text style={{ fontFamily: "roboto-bold", fontSize: 25 }}>
        Add New Business Post
      </Text>
      <Text style={{ fontFamily: "roboto", color: "#gray" }}>
        Fill all details in order to add new business
      </Text>

      <View>
        <TextInput
          placeholder="Title"
          onChangeText={(value) => setName(value)}
          style={{
            padding: 15,
            paddingStart: 25,
            marginTop: 30,
            borderRadius: 30,
            backgroundColor: Colors.GRAY,
            fontFamily: "roboto",
          }}
        ></TextInput>
        <TextInput
          placeholder="Address"
          onChangeText={(value) => setAddress(value)}
          style={{
            padding: 15,
            paddingStart: 25,
            marginTop: 20,
            borderRadius: 30,
            backgroundColor: Colors.GRAY,
            fontFamily: "roboto",
          }}
        ></TextInput>
        <View
          style={{
            padding: 5,
            marginTop: 20,
            borderRadius: 30,
            backgroundColor: Colors.GRAY,
            fontFamily: "roboto",
          }}
        >
          <RNPickerSelect
            onValueChange={(value) => setCategories(value)}
            items={categoryList}
          />
        </View>
        <TextInput
          multiline
          numberOfLines={5}
          placeholder="Description"
          onChangeText={(value) => setDescription(value)}
          style={{
            padding: 15,
            paddingStart: 25,
            marginTop: 20,
            borderRadius: 30,
            backgroundColor: Colors.GRAY,
            fontFamily: "roboto",
            height: 100,
          }}
        ></TextInput>
      </View>
      <TouchableOpacity onPress={onAddPost}
        style={{
          padding: 20,
          backgroundColor: Colors.secondaryColor,
          borderRadius: 30,
          marginTop: 20,
          alignItems: "center",
          shadowColor: "#000", // Shadow color
          shadowOffset: {
            width: 1,
            height: 3,
          },
          shadowOpacity: 0.75,
          shadowRadius: 3.84,
          elevation: 5, // Elevation for Android
        }}

        // disabled={loading}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontFamily: "roboto-bold",
          }}
        >
          Post
        </Text>
      </TouchableOpacity>
    </View>
  );
}
