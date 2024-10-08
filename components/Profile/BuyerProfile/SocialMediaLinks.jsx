import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Fontisto from '@expo/vector-icons/Fontisto';
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
  const socialData = [
    {
      icon: "world-o",
      label: "Website",
      value: "info@pererahandlooms.com",
    },
    {
      icon: "instagram",
      label: "Instagram",
    },
    {
      icon: "facebook",
      label: "Facebook",
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
