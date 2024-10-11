import {
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../context/authContext"; // Import useAuth to access user data
import { useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation
import { useRouter } from "expo-router";

export default function Slider() {
  const { user } = useAuth(); // Get the current user and their role
  const navigation = useNavigation(); // Initialize navigation
  const [sliderList, setSliderList] = useState([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  // Correctly require your local images and their corresponding screen links
  const assetImages = {
    entrepreneurSlider: [
      {
        image: require("../../assets/images/sliders/slider1.jpg"),
        screenLink: "/fund/fundExplain", 
      },
      {
        image: require("../../assets/images/sliders/slider2.jpg"),
        screenLink: "/(tabsEntrepeneur)/community",
      },
    ],
  };

  useEffect(() => {
    if (user?.role === "entrepreneur") {
      // Load sliders from assets if the user is an entrepreneur
      setSliderList(assetImages.entrepreneurSlider);
    } else {
      // Fetch sliders from Firestore for non-entrepreneurs
      GetSliderList();
    }
  }, [user]); // Add user to dependencies to update when it changes

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderList.length > 0) {
        scrollToNextItem();
      }
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [sliderList, currentIndex]);

  const GetSliderList = async () => {
    setSliderList([]); // Reset the slider list
    const q = query(collection(db, "sliders"));
    const querySnapshot = await getDocs(q);
    const sliderItems = [];

    querySnapshot.forEach((doc) => {
      sliderItems.push(doc.data());
    });

    setSliderList(sliderItems); // Update the state with Firestore data
  };

  const scrollToNextItem = () => {
    if (flatListRef.current) {
      const nextIndex = (currentIndex + 1) % sliderList.length; // Looping logic
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  // Function to handle image press
  const handleImagePress = (screenLink) => {
    if (user?.role === "entrepreneur") {
      router.push(screenLink); // Navigate to the corresponding screen
    } else {
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
        Special For You
      </Text>
      <FlatList
        ref={flatListRef}
        data={sliderList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImagePress(item.screenLink)}>
            <Image
              source={
                user?.role === "entrepreneur"
                  ? item.image
                  : { uri: item.imageUrl }
              } // Local asset for entrepreneurs, Firestore for others
              style={{
                width: 366,
                height: 186,
                borderRadius: 15,
                marginRight: 30,
              }}
            />
          </TouchableOpacity>
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
