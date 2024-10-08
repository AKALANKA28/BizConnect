import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../../context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors"; // Ensure this path is correct based on your project structure

const EditFieldScreen = () => {
  const { updateProfile } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { field, initialValue } = route.params;

  const [value, setValue] = useState(initialValue);

  const handleSave = async () => {
    try {
      const updatedData = { [field]: value };
      const result = await updateProfile(updatedData);

      if (result.success) {
        Alert.alert("Field updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error updating field. Please try again.");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      Alert.alert("Error updating field. Please try again.");
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.primaryColor}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        {/* Add the label in the header */}
        <Text style={styles.headerTitle}>{`Edit ${field.charAt(0).toUpperCase() + field.slice(1)}`}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="checkmark" size={24} color={Colors.secondaryColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>{`Edit ${field.charAt(0).toUpperCase() + field.slice(1)}`}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          autoFocus={true}
          placeholder={`Enter your ${field}`}
          placeholderTextColor="#888" // Color for placeholder text
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.primaryColor, // Use your primary color here
    marginTop: -18,
  },
  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1, // This allows the title to take up available space
    textAlign: "left", // Centers the header title
    fontFamily: "poppins-semibold", // Font family for consistency
    marginLeft: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "poppins-semibold", // Font family for consistency
  },
  input: {
    padding: 15,
    paddingVertical: 12,
    borderRadius: 18, // Adjust for consistent border radius
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 18,
    color: "#000",
    fontFamily: "roboto", // Font family for consistency
  },
});

export default EditFieldScreen;
