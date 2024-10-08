import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Importing Ionicons

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
  const contactInfo = [
    {
      iconName: "call-outline", // Phone icon from Ionicons
      label: "Phone",
      value: "+94 77 123 4567",
    },
    {
      iconName: "location-outline", // Location icon from Ionicons
      label: "Address",
      value: "718/5, Keremulla Road, Panagoda, Homamagama, Western, Colombo",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Contact Details:</Text>
      {contactInfo.map((item, index) => (
        <ContactItem
          key={index}
          iconName={item.iconName}
          label={item.label}
          value={item.value}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   // marginBottom: 20,
  // },
  title: {
    color: "rgba(141, 110, 99, 1)",
    fontFamily: "poppins-semibold",
    fontSize: 14,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center", 
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
