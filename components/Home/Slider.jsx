import { FlatList, Image, Text, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // State for the current index

  useEffect(() => {
    GetSliderList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderList.length > 0) {
        scrollToNextItem();
      }
    }, 5000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [sliderList, currentIndex]); // Add currentIndex as a dependency

  const GetSliderList = async () => {
    setSliderList([]);
    const q = query(collection(db, "sliders"));

    const querySnapshot = await getDocs(q);
    const sliderItems = [];

    querySnapshot.forEach((doc) => {
      sliderItems.push(doc.data());
    });

    setSliderList(sliderItems);
  };

  const scrollToNextItem = () => {
    if (flatListRef.current) {
      const nextIndex = (currentIndex + 1) % sliderList.length; // Looping logic
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <View style={{ backgroundColor: Colors.background }}>
      <Text
        style={{
          fontSize: RFValue(17),
          fontFamily: "roboto-bold",
          paddingLeft: 20,
          paddingTop: 40,
          color: Colors.text,
        }}
      >
        #SpecialForYou
      </Text>
      <FlatList
        ref={flatListRef}
        data={sliderList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item }) => (
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
        keyExtractor={(item, index) => index.toString()}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
}
