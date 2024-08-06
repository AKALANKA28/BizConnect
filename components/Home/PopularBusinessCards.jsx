import { View, Text, Image } from 'react-native'
import React from 'react'
import {Colors} from "../../constants/Colors";


export default function PopularBusinessCards({business}) {
  return (
    <View style={{
      padding: 10,
      marginLeft:20,
      backgroundColor: "#fff",
      borderRadius: 15,
      }}>
        <Image source={{uri:business?.imageUrl}}
          style={{
            width: 200,
            height: 130,
            borderRadius: 15,
          }}
        />
        <View style={{marginTop:7}}>
          <Text style={{
            fontFamily:"roboto-bold",
            textTransform:"capitalize",
            fontSize: 17,
          }}
          >{business?.name}</Text>
          <Text style={{
            fontFamily:"roboto-bold",
            fontSize: 13,
            textTransform:"capitalize",
            color:Colors.GRAY
          }}
          >{business?.address}</Text>
        </View>

     
    </View>
  )
}