// EntrepreneurProfile.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { db } from "../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import ProfileHeader from "./EntrepreneurProfile/ProfileHeader";
import ProfileInfo from "../../components/Profile/EntrepreneurProfile/ProfileInfo";
import ContactDetails from "../../components/Profile/EntrepreneurProfile/ContactDetails";
import PreviousWorks from "../../components/Profile/EntrepreneurProfile/PreviousWorks";
import { StatusBar } from "expo-status-bar";
import AcceptBidButton from "../../components/Profile/EntrepreneurProfile/AcceptBidButton"; // Import the new component
import LoadingScreen from "../../components/LoadingScreen";
import Header from "../../components/Header";

export default function EntrepreneurProfile() {
  const { entrepeneurid } = useLocalSearchParams(); // Get the entrepreneur ID
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntrepreneurProfile = async () => {
      try {
        const docRef = doc(db, "entrepreneurs", entrepeneurid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEntrepreneur(docSnap.data());
        } else {
          console.log("No entrepreneur found!");
        }
      } catch (error) {
        console.error("Error fetching entrepreneur data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (entrepeneurid) {
      fetchEntrepreneurProfile();
    }
  }, [entrepeneurid]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header title={`${entrepreneur?.username}'s Profile`} showNotification={true} />
      <View style={styles.container}>
        {entrepreneur ? (
          <>
            <ScrollView style={styles.container}>
              <View style={styles.content}>
                <ProfileHeader entrepreneurId={entrepeneurid} />
                <ProfileInfo entrepreneurId={entrepeneurid} />
                <ContactDetails entrepreneurId={entrepeneurid} />
              </View>
              <View>
                {entrepeneurid ? (
                  <PreviousWorks entrepreneurId={entrepeneurid} />
                ) : (
                  <Text>No Entrepreneur ID available</Text>
                )}
              </View>
            </ScrollView>
            <AcceptBidButton entrepeneurid={entrepeneurid} />
          </>
        ) : (
          <Text>No entrepreneur found.</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    // paddingHorizontal: 19,
    marginTop: -20,
  },
  coverImage: {
    borderRadius: 20,
    width: "100%",
    aspectRatio: 8.62,
  },
  content: {
    padding: 16,
  },
});
