import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

export default function CategoryItem({ category, onCategoryPress }) {
  return (
    <TouchableOpacity onPress={() => onCategoryPress(category)}>
      <View style={styles.categoryContainer}>
        <View style={styles.iconContainer}>
          <Image source={{ uri: category.icon }} style={styles.iconImage} />
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "column",
    alignItems: "center",
    // marginBottom: 15,
  },
  iconContainer: {
    padding: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 99,
    borderColor: "#000000", // Corrected to use a hex value for black
    borderWidth: 0.5,
    marginRight: 15,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  categoryName: {
    fontSize: 13,
    fontFamily: "roboto-bold",
    textTransform: "capitalize",
    textAlign: "center",
    marginTop: 5,
  },
});
