import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import Intro from "../../components/BusinessDetails/Intro";
import ActionButton from "../../components/BusinessDetails/ActionButton";
import About from "../../components/BusinessDetails/About";

export default function BusinessDetail() {
  const { businessid } = useLocalSearchParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetBusinessDetailsById();
  }, []);

  const GetBusinessDetailsById = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "BusinessList", businessid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBusiness(docSnap.data());
      } else {
        console.log("No such document");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={Colors.primaryColor}
          style={{ marginTop: "70%" }}
        />
      ) : (
        business && (
          <View>
            {/* Intro */}
            <Intro business={business} />
            {/* Action Button */}
            <ActionButton/>
            {/* AboutSection */}
            <About/>
          </View>
        )
      )}
    </ScrollView>
  );
}
