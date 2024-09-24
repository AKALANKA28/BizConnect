import React, { useState } from "react";
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

export default function Header({ title }) {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <StatusBar style="dark" translucent />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} />
      {/* Placeholder to balance the back arrow */}
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
  },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
});
