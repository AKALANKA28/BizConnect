import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Importing Ionicons
import { useAuth } from "../../../context/authContext"; // Importing useAuth hook
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig"; // Firestore instance

const ContactItem = ({ label, value, iconName }) => (
  <View style={styles.contactItem}>
    <Ionicons name={iconName} size={17} color="#000" style={styles.contactIcon} />
    <View style={styles.contactInfo}>
      <Text style={styles.contactLabel}>{label}:</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
  </View>
);

const ContactDetails = () => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [contactInfo, setContactInfo] = useState([]); // State to hold contact details

  // Function to fetch contact details from Firestore
  const fetchContactDetails = async () => {
    if (user) {
      try {
        // Reference to the user's document in Firestore
        const userDocRef = doc(db, "entrepreneurs", user.uid); // Adjust "buyers" to your collection
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const contactData = [
            {
              iconName: "call-outline", // Phone icon
              label: "Phone",
              value: userData.phoneNumber || "Not provided",
            },
            {
              iconName: "location-outline", // Location icon
              label: "Address",
              value: userData.address || "Not provided",
            },
          ];
          setContactInfo(contactData); // Update state with fetched contact details
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching contact details: ", error);
      }
    }
  };

  // Fetch contact details when component mounts
  useEffect(() => {
    fetchContactDetails();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Contact Details:</Text>
      {contactInfo.length > 0 ? (
        contactInfo.map((item, index) => (
          <ContactItem
            key={index}
            iconName={item.iconName}
            label={item.label}
            value={item.value}
          />
        ))
      ) : (
        <Text>Loading contact details...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "rgba(141, 110, 99, 1)",
    fontFamily: "poppins-semibold",
    fontSize: 14,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  contactInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center", // Centers text within the row
  },
  contactLabel: {
    width: 64,
    color: "#262626",
    fontFamily: "poppins",
    fontWeight: "400",
    fontSize: 14,
  },
  contactValue: {
    flex: 1,
    color: "#262626",
    fontFamily: "poppins",
    fontWeight: "400",
    fontSize: 14,
    textAlignVertical: "center", // Ensures the value text is vertically aligned
  },
});

export default ContactDetails;
