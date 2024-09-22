import { FlatList, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import CategoryItem from "./CategoryItem";
import { useRouter } from "expo-router";
export default function Category() {
  // Declare state variable to store categories
  const [categories, setCategories] = useState([]);
  // Use router to navigate to different pages
  const router = useRouter();
  // Use effect to call GetCategoryList function when component mounts
  useEffect(() => {
    GetCategoryList();
  }, []);

  // Function to get category list from firebase
  const GetCategoryList = async () => {
    // Set categories to empty array
    setCategories([]);
    // Query the Category collection in firebase
    const q = query(collection(db, "Category"));
    // Get the documents from the query
    const querySnapshot = await getDocs(q);
    // Loop through the documents and set the categories state
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      setCategories((prev) => [...prev, doc.data()]);
    });
  };
  return (
    <View>
      <View
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "roboto-bold",
            color: Colors.text,
          }}
        >
          Category
        </Text>
        <Text style={{ color: Colors.primaryColor, fontFamily: "roboto" }}>
          View All
        </Text>
      </View>
      <FlatList
        // Set data to categories state
        data={categories}
        // Disable horizontal scroll bar
        showsHorizontalScrollIndicator={false}
        // Set horizontal scroll
        horizontal={true}
        // Render each item in the list
        renderItem={({ item, index }) => (
          <CategoryItem
            // Pass category data to CategoryItem component
            category={item}
            // Set key to index
            key={index}
            // Navigate to businesslist page when category is pressed
            onCategoryPress={(category) =>
              router.push(`/businesslist/${category.name}`)
            }
          />
        )}
        style={{
          marginLeft: 20,
        }}
      />
    </View>
  );
}
