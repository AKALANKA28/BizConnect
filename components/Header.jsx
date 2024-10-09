import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
export default function Header({ title, onDeletePress, showDelete }) {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <StatusBar style="dark" translucent backgroundColor="white" />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} />

      {showDelete && (
        <TouchableOpacity onPress={onDeletePress} style={styles.deleteButton}>
          <MaterialIcons name="delete-outline" size={24} color="#6D4C41" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    marginBottom: 0,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 30,
    fontSize: 20,
    fontFamily: "poppins-semibold", // Font family for consistency
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    color: "red", // Change color as needed
    fontSize: 16,
  },
});
