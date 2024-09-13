import { View, Text } from 'react-native'
import React from 'react'
// import { useUser } from '@clerk/clerk-expo'
import { collection, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function feed() {

    // // const {user} = useUser();
    // const GetUserBusiness = () => {
    //   const q = query(collection(db, "jobs"), where('userEmail', '==', user?.email));
    // }
  return (
    <View style={{padding:20}}>
      <Text style={{fontSize:30, fontFamily
        : "roboto-bold",
      }}>My Jobs</Text>
    </View>
  )
}