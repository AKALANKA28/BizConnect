import React from "react";
import { View, StyleSheet, Image, Text, ScrollView } from "react-native";
import ProfileHeader from "./ProfileHeader";
import AboutMe from "./AboutMe";
import ContactInformation from "./ContactInformation";
import SocialMediaLinks from "./SocialMediaLinks";

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Image
        resizeMode="contain"
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/ceca02619567f4433572c99f98b28a2e02efa9e01e8e30d180cb249e5bac9c93?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
        }}
        style={styles.headerImage}
      />
      <View style={styles.content}>
        <ProfileHeader />
        <View style={styles.divider} />
        <AboutMe />
        <ContactInformation />
        <View style={styles.divider} />
        <SocialMediaLinks />
        <Image
          resizeMode="contain"
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/89205c781cd9b19db45a8ef491d91611cbcce908f41ee9314c6f9ce5c91da78a?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
          }}
          style={styles.footerImage}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 40,
    maxWidth: 480,
    width: "100%",
  },
  headerImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    aspectRatio: 8.62,
  },
  content: {
    marginTop: 25,
    paddingHorizontal: 16,
  },
  divider: {
    borderColor: "rgba(224, 224, 224, 1)",
    borderWidth: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 19,
    height: 3,
  },
  footerImage: {
    marginTop: 79,
    width: "100%",
    aspectRatio: 5.18,
  },
});

export default ProfileScreen;
