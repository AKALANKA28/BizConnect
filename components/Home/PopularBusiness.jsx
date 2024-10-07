import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore"; 
import { db } from "../../config/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import PopularBusinessCards from "./PopularBusinessCards";

export default function PopularBusiness() {
  const [businessList, setBusinessList] = useState([]);

  useEffect(() => {
    GetBusinessList();
  }, []);

  const GetBusinessList = async () => {
    setBusinessList([]);
    const q = query(collection(db, "BusinessList"), limit(10));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setBusinessList((prev) => [...prev, { id: doc.id, ...doc.data() }]);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular Business</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>
      <FlatList
        data={businessList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => (
          <PopularBusinessCards business={item} key={index} />
        )}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "roboto-bold",
    color: Colors.text,
  },
  viewAll: {
    color: Colors.secondaryColor,
    fontFamily: "roboto",
  },
  flatList: {
    marginLeft: 0,
  },
});
