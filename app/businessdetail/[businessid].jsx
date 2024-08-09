import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './../../config/FirebaseConfig'
import { ActivityIndicator } from 'react-native-web'

export default function BusinessDetail() {

  const { businessid } = useLocalSearchParams()
  const [business, setBusiness] = useState();
  const [loading, setLoading] = useState(false);
    useEffect(() =>{
      GetBusinessDetailById()
    }, [])

  /**
   * Used to get business detail by id
   */
  const GetBusinessDetailById=async()=>{
    setLoading(true);

     const docRef=doc(db,'BusinessList',businessid);
     const docSnap=await getDoc(docRef);
     if (docSnap.exists()) {
      
      setBusiness(docSnap.data());
      setLoading(false)
    }
    else{
        // doc.data() will be undefined in this case
      console.log("No such document!");
      setLoading(false)
        
    }



     
  }
  return (
    <View>
        {loading?
        <ActivityIndicator 
        style={{
            marginTop:'70%'
        }}
        size={"large"} 
        color={Colors.PRIMARY} 
        />:
         <View>
          {/*Intro*/}
          <Intro business={business}/>

          {/*Action Buttons*/}


          {/*About Section*/}


          
    </View>
   }

   </View>
 )

}