// EntrepreneurProfile.js
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ProfileHeader from "../../components/Profile/EntrepreneurProfile/ProfileHeader";
import ProfileInfo from "../../components/Profile/EntrepreneurProfile/ProfileInfo";
import ContactDetails from "../../components/Profile/EntrepreneurProfile/ContactDetails";
import PreviousWorks from "../../components/Profile/EntrepreneurProfile/PreviousWorks";
import { StatusBar } from "expo-status-bar";

export default function profile() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <ProfileHeader />
          <ProfileInfo />
          <ContactDetails />
        </View>
        <PreviousWorks />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    // paddingHorizontal: 16,
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
