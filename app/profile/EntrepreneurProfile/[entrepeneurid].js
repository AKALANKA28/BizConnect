import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { db } from "../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth from firebase/auth
import { useLocalSearchParams } from "expo-router";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "../../../components/Profile/EntrepreneurProfile/ProfileInfo";
import ContactDetails from "../../../components/Profile/EntrepreneurProfile/ContactDetails";
import PreviousWorks from "../../../components/Profile/EntrepreneurProfile/PreviousWorks";
import LoadingScreen from "../../../components/LoadingScreen";
import Header from "../../../components/Header";
import AcceptBidButton from "../../../components/Profile/EntrepreneurProfile/AcceptBidButton"; // Import the new component

export default function EntrepreneurProfile() {
  const { entrepeneurid } = useLocalSearchParams(); // Get the entrepreneur ID
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAcceptButton, setShowAcceptButton] = useState(false); // State for button visibility

  const auth = getAuth(); // Get auth instance
  const currentUser = auth.currentUser; // Get the currently logged-in user

  useEffect(() => {
    const fetchEntrepreneurProfile = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "entrepreneurs", entrepeneurid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const entrepreneurData = docSnap.data();
          console.log("Entrepreneur Data:", entrepreneurData); // Debug log to check fetched data
          setEntrepreneur(entrepreneurData);
          setShowAcceptButton(true); // Show the AcceptBidButton after data is fetched
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

  // Debugging: Check if user and entrepreneur data are correct
  console.log("Current User ID:", currentUser?.uid);
  console.log("Entrepreneur Data:", entrepreneur);

  // Check if the logged-in user is the same as the entrepreneur
  const isLoggedInUserEntrepreneur = entrepreneur?.uid.trim() === currentUser?.uid.trim();

  // Debugging: Check the result of the comparison
  console.log("Is logged-in user the entrepreneur?", isLoggedInUserEntrepreneur);

  return (
    <>
      <Header
        title={`${entrepreneur?.username}'s Profile`}
        showNotification={true}
      />
      <View style={styles.container}>
        {entrepreneur ? (
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
        ) : (
          <Text>No entrepreneur found.</Text>
        )}

        {/* Conditionally render the AcceptBidButton */}
        {!isLoggedInUserEntrepreneur && showAcceptButton && (
          <AcceptBidButton entrepeneurid={entrepeneurid} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginTop: -20,
  },
  content: {
    padding: 16,
  },
});
