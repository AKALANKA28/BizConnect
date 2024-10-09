import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const WorkImage = ({ source, style }) => (
  <Image
    resizeMode="cover"
    source={{ uri: source }}
    style={[styles.workImage, style]} // Apply both default and dynamic styles
  />
);

const PreviousWorks = () => {
  const workImages = [
    {
      source: "https://cdn.builder.io/api/v1/image/assets/TEMP/b1ec94242342e4155ff9bcf45318daadc707b9ea8432cd96c1fddff3d1599fa2?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
      height: 180,
    },
    {
      source: "https://cdn.builder.io/api/v1/image/assets/TEMP/3b7d63445b6236a9df3216108f00b160c58fabd93e023a3a7304dbd077a88334?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
      height: 250,
    },
    {
      source: "https://cdn.builder.io/api/v1/image/assets/TEMP/8affc8af83e6e8abc59920127ced4f3df16f2f75fa26d2ed7856823062d4c8a6?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
      height: 250,
    },
    {
      source: "https://cdn.builder.io/api/v1/image/assets/TEMP/0c738946bbec2242f414a378a2ad225469fce4da00aa6288fdf425a85d0e92fc?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
      height: 180,
    },
    {
      source: "https://cdn.builder.io/api/v1/image/assets/TEMP/8affc8af83e6e8abc59920127ced4f3df16f2f75fa26d2ed7856823062d4c8a6?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
      height: 250,
    },
    {
      source: "https://cdn.builder.io/api/v1/image/assets/TEMP/0c738946bbec2242f414a378a2ad225469fce4da00aa6288fdf425a85d0e92fc?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
      height: 180,
    },
  ];

  // Split images into two columns
  const column1Images = workImages.filter((_, index) => index % 2 === 0); // Even index images
  const column2Images = workImages.filter((_, index) => index % 2 !== 0); // Odd index images

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previous Works</Text>

      <View style={styles.imageGrid}>
        <View style={styles.imageColumn}>
          {column1Images.map((item, index) => (
            <WorkImage
              key={index}
              source={item.source}
              style={{ height: item.height, width: "100%" }} // Set dynamic height, full width
            />
          ))}
        </View>

        <View style={styles.imageColumn}>
          {column2Images.map((item, index) => (
            <WorkImage
              key={index}
              source={item.source}
              style={{ height: item.height, width: "100%" }} // Set dynamic height, full width
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  title: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "poppins-semibold",
    fontSize: 17,
    marginLeft: 16,
    marginBottom: 14,
    textAlign: "left",

  },
  imageGrid: {
    flexDirection: "row", // Keep two columns side by side
    justifyContent: "space-between", // Space between the columns
  },
  imageColumn: {
    width: "49%", // Each column takes up 49% of the width to leave space between columns
  },
  workImage: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
});

export default PreviousWorks;
