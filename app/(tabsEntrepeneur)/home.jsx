import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import Category from "../../components/Home/Category";
import PopularBusiness from "../../components/Home/PopularBusiness";
import RecommendPost from "../../components/Home/RecommendPost";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/authContext";

export default function Home() {
  const { signout } = useAuth(); // Get signout function from Auth context

  const handleLogout = async () => {
    await signout(); // Call the signout function
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <Header />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Slider */}
        <Slider />
        {/* Category */}
        <Category />
        {/* Popular Business List */}
        <PopularBusiness />
        {/* <PopularBusiness />
        <PopularBusiness /> */}
        <RecommendPost />
        {/* Logout Button */}
        <View>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensures header is above other content
  },
  scrollContent: {
    marginTop: 100,
    paddingTop: 80, // Adjust this based on your header height to prevent overlapping
    paddingBottom: 160,
    backgroundColor: Colors.background,
  },
});
