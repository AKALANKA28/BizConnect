import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { db } from "../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";

export default function EntrepreneurProfile() {
  const { entrepeneurid } = useLocalSearchParams(); // Get uid from router.params
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);

    // Check if uid is undefined
    // if (!entrepeneurid) {
    //   console.error("UID is undefined");
    //   return <Text>Error: No UID provided</Text>; // Handle error case
    // }
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

    fetchEntrepreneurProfile();
  }, [entrepeneurid]); // Make sure to include uid in the dependency array

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading entrepreneur profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entrepreneur ? (
        <>
          <Text style={styles.name}>{entrepreneur.username}</Text>
          {/* Add more entrepreneur details here */}
        </>
      ) : (
        <Text>No entrepreneur found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
