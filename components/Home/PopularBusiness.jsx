import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import { limit } from "firebase/firestore";
import PopularBusinessCards from "./PopularBusinessCards";

export default function PopularBusiness() {
  const [businessList, setBusinessList] = useState([]);
  useEffect(() => {
    GetBusinessList();
  }, []);

  const GetBusinessList = async () => {
    setBusinessList([])
    const q = query(collection(db, "BusinessList"), limit(10));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      setBusinessList(prev =>[...prev, {id:doc.id, ...doc.data()}]);
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
          Popular Business
        </Text>
        <Text
          styel={{ color: Colors.primaryColor, fontFamily: "roboto" }}
        >
          View All
        </Text>
      </View>
      <FlatList
        data={businessList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({item, index}) => (
           <PopularBusinessCards 
              business={item}
              key={index}
              />
        )}


        style={{
           marginLeft: 20,
        }}

      
      />
    </View>
  );
}
