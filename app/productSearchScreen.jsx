// app/ProductSearchScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for back button icon
import { useRouter } from "expo-router"; // Import useRouter for navigation

const ProductSearchScreen = () => {
  const router = useRouter(); // Access the router for navigation

  const handleBackPress = () => {
    router.back(); // Go back to the previous screen
  };

  const handleSearchPress = () => {
    // Handle the search action here
    console.log("Searching for products..."); // Replace with your search logic
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Search Bar */}
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6D4C41" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            {/* <Ionicons name="search" size={20} color="#6D4C41" /> */}

            <TextInput
              placeholder="Search"
              style={styles.searchInput}
            />
            {/* Search Button
            // <TouchableOpacity
              onPress={handleSearchPress}
              style={styles.searchButton}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>

      {/* FlatList for product listings */}
      <FlatList
        data={[]} // Add your product data here
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 33,
    backgroundColor: "#fff",

  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Space between the header and the product list
    marginTop: 20,
  },
  backButton: {
    marginRight: 10, // Space between the back button and the search bar
  },
  searchContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFF0",
    borderRadius: 90,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  searchInput: {
    fontSize: RFValue(13),
    color: "#BCBCBC",
    flex: 1, // Ensure the input takes up the remaining space in the search bar
    marginRight: 10, // Space between input and button
  },
  searchButton: {
    backgroundColor: "#6D4C41", // Button color for the search button
    borderRadius: 90, // Match the button shape with the search bar
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: "center", // Center icon in the button
    alignItems: "center", // Center icon in the button
  },
  productItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ProductSearchScreen;
