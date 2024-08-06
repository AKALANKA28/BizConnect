import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo';
import {Colors} from '../../constants/Colors';

import Ionicons from '@expo/vector-icons/Ionicons';
export default function Header() {

  const {user} =useUser();
  return (
    <View style={
      {
        padding:20,
        paddingTop: 40,
        backgroundColor: Colors.primaryColor,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
      }
    }

    >
      <View style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
      }}>
        <Image source={{uri:user?.imageUrl}}
          style={{ 
            width: 45,
            height: 45,
            borderRadius: 99,
          
          }}
        />

        <View>
          <Text>Welcome</Text>
          <Text style={{
            fontSize:19,
            fontFamily: "roboto-medium"
          }}>Akalanka Dias</Text>

          {/* <Text>{user?.fullName}</Text> */}
        </View>
      </View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 99,
        marginVertical: 10,
        marginTop: 15,
      }}>
        {/* Search Bar */}
        <Ionicons name="search" size={24} color="black" />
        <TextInput placeholder='Search...' style={{
          fontFamily: "roboto-regular",
          fontSize: 16,
        }}

        ></TextInput>

      </View>
    </View>
  )
}