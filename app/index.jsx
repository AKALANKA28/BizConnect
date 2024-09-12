import { ActivityIndicator, Text, View } from "react-native";
import React from 'react'


export default function OnBoardingScreen() {


  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color={'#000'} />
    </View>
  )

}
