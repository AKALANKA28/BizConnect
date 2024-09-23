import { FlatList, Image, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import {Colors} from "../../constants/Colors";

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetSliderList();
  }, []);

  const GetSliderList = async () => {
    setSliderList([]);
    const q = query(collection(db, "sliders"));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      setSliderList((prev) => [...prev, doc.data()]);
    });
  };

  return (
    <View style={{ backgroundColor: Colors.background }}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "roboto-bold",
          paddingLeft: 20,
          paddingTop: 40,
          marginBottom: 5,

          
          color: Colors.text,
        }}
      >
        #Special for you
      </Text>
      <FlatList
        data={sliderList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: 366,
              height: 186,
              borderRadius: 15,
              marginRight: 30,
            }}
          />
        )}
        style={{
          paddingLeft: 20,
          marginTop: 20,
        }}
      />
    </View>
  );
}
