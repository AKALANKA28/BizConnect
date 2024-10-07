import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

const ContactItem = ({ icon, label, value }) => (
  <View style={styles.contactItem}>
    <Ionicons name={icon} size={20} color="rgba(141, 110, 99, 1)" style={styles.icon} />
    <View style={styles.contactDetails}>
      <Text style={styles.contactLabel}>{label}:</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
  </View>
);

const ContactInformation = () => {
  const contactData = [
    {
      label: "Email",
      value: "info@pererahandlooms.com",
      icon: "mail-outline", 
    },
    {
      label: "Phone",
      value: "+94 77 123 4567",
      icon: "call-outline", 
    },
    {
      label: "Address",
      value: "No.56/2, Kurunduwatta, Colombo 07, Colombo",
      icon: "location-outline", 
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CONTACT INFORMATION</Text>
      <Text style={styles.subtitle}>Business Contact Details:</Text>
      {contactData.map((item, index) => (
        <ContactItem
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
    marginTop: 26,
  },
  title: {
    color: "rgba(141, 110, 99, 1)",
    fontFamily: "poppins-semibold",
    fontSize: 19,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "poppins-semibold",
    marginTop: 8,
    color: "rgba(141, 110, 99, 1)",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  contactDetails: {
    flexDirection: "row",
    flex: 1,
  },
  contactLabel: {
    width: 64,
    fontFamily: "poppins-semibold",
    fontSize: 15,
    color: "#262626",
  },
  contactValue: {
    flex: 1,
    fontFamily: "poppins",
    fontSize: 16,
    color: "#262626",
  },
});

export default ContactInformation;
