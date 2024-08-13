import { View, Text } from 'react-native'
import React from 'react'

export default function About({Business}) {
  return (
    <View style={{padding: 20, backgroundColor: "#fff", height: "100%"}}>
      <Text style={{fontSize: 20, fontFamily: "roboto-bold"}}>About</Text>
      <Text styele={{fontSize: 25, fontFamily: "roboto"}}>{Business?.about}</Text>
    </View>
  )
}