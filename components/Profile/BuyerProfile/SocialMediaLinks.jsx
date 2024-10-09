import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Fontisto from '@expo/vector-icons/Fontisto';
import { useAuth } from "../../../context/authContext"; // Import useAuth hook
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig"; // Firestore instance

const SocialMediaItem = ({ icon, label, value }) => (
  <View style={styles.socialItem}>
    <Fontisto
      name={icon}
      size={18}
      color="#262626"
      style={styles.icon}
    />
    <View style={styles.socialDetails}>
      <Text style={styles.socialLabel}>{label}:</Text>
      <Text style={styles.socialValue}>{value}</Text>
    </View>
  </View>
);

const SocialMediaLinks = () => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [socialLinks, setSocialLinks] = useState({
    website: "",
    instagram: "",
    facebook: "",
  }); // State to hold social media links

  // Function to fetch social media links from Firestore
  const fetchSocialLinks = async () => {
    if (user) {
      try {
        // Reference to the user's document in Firestore
        const userDocRef = doc(db, "buyers", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setSocialLinks({
            website: userData.website || "No website available",
            instagram: userData.instagram || "No Instagram link available",
            facebook: userData.facebook || "No Facebook link available",
          });
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching social media links: ", error);
      }
    }
  };

  // Fetch social media links when component mounts
  useEffect(() => {
    fetchSocialLinks();
  }, [user]);

  const socialData = [
    {
      icon: "world-o",
      label: "Website",
      value: socialLinks.website,
    },
    {
      icon: "instagram",
      label: "Instagram",
      value: socialLinks.instagram,
    },
    {
      icon: "facebook",
      label: "Facebook",
      value: socialLinks.facebook,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Website and Social Media Links:</Text>
      {socialData.map((item, index) => (
        <SocialMediaItem
          key={index}
          icon={item.icon}
          label={item.label}
          value={item.value}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  title: {
    color: "rgba(141, 110, 99, 1)",
    fontSize: 15,
    fontFamily: "poppins-semibold",
    marginBottom: 8,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignContent: "center",
  },
  icon: {
    width: 20,
    aspectRatio: 1,
    marginRight: 10,
  },
  socialDetails: {
    flexDirection: "row",
    flex: 1,
  },
  socialLabel: {
    width: 80,
    fontFamily: "poppins-semibold",
    fontSize: 15,
    color: "#262626",
  },
  socialValue: {
    flex: 1,
    fontFamily: "poppins",
    fontSize: 16,
    color: "#262626",
  },
});

export default SocialMediaLinks;
