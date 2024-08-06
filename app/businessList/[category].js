import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import BusinessListCard from "../../components/BusinessList/BusinessListCard";
import { keyboardProps } from "react-native-web/dist/cjs/modules/forwardedProps";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "../../constants/Colors";

// This function is used to display a list of businesses based on a category
export default function BusinessListByCategory() {
  // Use the useNavigation hook to get the navigation object
  const navigation = useNavigation();
  // Use the useLocalSearchParams hook to get the category parameter from the URL
  const { category } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  // Initialize the businessList state variable
  const [businessList, setBusinessList] = useState([]);

  // Use the useEffect hook to set the header title and get the business list when the component mounts
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: category,
    });
    getBusinessList();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // This function is used to get the business list from the database
  const getBusinessList = async () => {
    setBusinessList([]);
    setLoading(true);
    // Create a query to get the businesses with the specified category
    const q = query(
      collection(db, "BusinessList"),
      where("category", "==", category)
    );
    // Get the query snapshot
    const querySnapshot = await getDocs(q);
    // Loop through the query snapshot and add each business to the businessList state variable
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setBusinessList((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };
  return (
    <View>
      {/* Render the business list using a FlatList */}
      {businessList?.length > 0 && loading == false ? (
        <FlatList
          data={businessList}
          onRefresh={getBusinessList}
          refreshing={loading}
          renderItem={({ item, index }) => (
            <BusinessListCard business={item} key={index} />
          )}
        />
      ) : loading? <ActivityIndicator style={{marginTop: "60%"}} size={'large'} color={Colors.primaryColor} />:
      (
        <Text
          style={{
            fontSize: 20,
            fontFamily: "roboto-bold",
            textAlign: "center",
            marginTop: "50%",
            color: Colors.GRAY,
          }}
        >
          No Businesses Found
        </Text>
      )}
    </View>
  );
}
