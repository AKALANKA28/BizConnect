import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
// import { useUser } from '@clerk/clerk-expo'
// import { collection, query, where } from "firebase/firestore";
// import { db } from "../../config/FirebaseConfig";

export default function Feed() {
  // // const {user} = useUser();
  // const GetUserBusiness = () => {
  //   const q = query(collection(db, "jobs"), where('userEmail', '==', user?.email));
  // }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>My Jo</Text>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          /* Handle button press */
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontFamily: "roboto-bold",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007bff", // Change to your desired color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
