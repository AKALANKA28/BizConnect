import {FlatList, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {Colors} from "../../constants/Colors";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import CategoryItem from "./CategoryItem";
export default function Category() {


const [categories, setCategories] = useState([]);
useEffect(() => {
    GetCategoryList();
}, [])

const GetCategoryList = async () => {
    setCategories([])

    const q = query(collection(db, 'Category'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log( doc.data());
        setCategories(prev =>[...prev, doc.data()]);

    })
}
  return (
    <View>
      <View
        style={{
          padding : 20,
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

          }}
        >
          Category
        </Text>
        <Text styel={{color: Colors.primaryColor, fontFamily: "roboto-regular"}}>View All</Text>
      </View>
      <FlatList
        data={categories}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({item, index}) => (
            <CategoryItem 
            category={item} 
            key={index}
            onCategoryPress={(category) => console.log(category)}
            />
        )}


        style={{
           marginLeft: 20,
        }}

      
      />
    </View>
  );
}
