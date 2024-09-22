/**
 * This code was generated by Builder.io.
 */
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const FormInput = ({ label, placeholder, multiline = false }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor="#61646B"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 9,
  },
  label: {
    color: "#000",
    fontSize: 14,
    marginTop: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
    fontFamily: "Lato, sans-serif",
    marginBottom: 8,
  },
  input: {
    borderRadius: 105,
    borderWidth: 1,
    borderColor: "#AFB1B6",
    backgroundColor: "rgba(211, 113, 69, 0.03)",
    minHeight: 40,
    padding: 8,
    fontSize: 12,
    color: "#61646B",
  },
  multilineInput: {
    borderRadius: 17,
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 12,
  },
});

export default FormInput;
