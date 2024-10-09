import React from "react";
import { View, StyleSheet, Image, Text, ScrollView } from "react-native";
import ProfileHeader from "../profile/BuyerProfile/ProfileHeader";
import AboutMe from "../../components/Profile/BuyerProfile/AboutMe";
import ContactInformation from "../../components/Profile/BuyerProfile/ContactInformation";
import SocialMediaLinks from "../../components/Profile/BuyerProfile/SocialMediaLinks";
import { Colors } from "../../constants/Colors";

export default function profile() {

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <ProfileHeader />
        <View style={styles.divider} />
        <AboutMe />
        <ContactInformation />
        <View style={styles.divider} />
        <SocialMediaLinks />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 480,
    width: "100%",
    backgroundColor: Colors.primaryColor,
  },
  content: {
    marginTop: 25,
    paddingHorizontal: 16,
  },
  divider: {
    // borderColor: "#E0E0E0",
    // borderWidth: 0.5,
    backgroundColor: "#E0E0E0",
    marginVertical: 19,
    height: 1,
  },

});