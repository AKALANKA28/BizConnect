import React, { useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router"; // Import router for navigation

const Index = () =>{
  return (
    <View>
      <ActivityIndicator size={"large"} color={"#000"} />
    </View>
  );
}

export default Index;
