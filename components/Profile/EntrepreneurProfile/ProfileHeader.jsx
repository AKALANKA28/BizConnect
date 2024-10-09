import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import ProfileStats from "./ProfileStats";
import { router } from "expo-router";



const ProfileHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          resizeMode="contain"
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/004a84e3197ae439e287919f5ca0674c5ee825fd53991dd8eaeb87c05fb09d06?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
          }}
          style={styles.profileImage}
        />
        <ProfileStats />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>Saman Karunarathna</Text>
          <Text style={styles.profession}>Potter</Text>
        </View>
        <TouchableOpacity
          style={styles.addNewButton}
          onPress={() => router.push("/posts/AddPostScreen")}
        >
          <Text style={styles.addNewText}>Add New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "left",
    marginBottom: 20,
    marginTop: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    gap: 20,
    marginBottom: 20,
    marginVertical: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: "poppins-semibold",
    color: "rgba(0, 0, 0, 1)",
  },
  profession: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "poppins",
  },
  addNewButton: {
    backgroundColor: "rgba(170, 106, 28, 1)",
    borderRadius: 50,
    padding: 7,
  },
  addNewText: {
    color: "#FFF",
    fontSize: 12,
  },
});

export default ProfileHeader;
