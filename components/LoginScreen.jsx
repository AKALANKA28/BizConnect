import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function LoginScreen() {
  return (
    <View style= {styles.container}>
      

        <View>
          <Image source={require('../assets/images/react-logo.png')} style={{width: 100, height: 100}} />

        </View>
      
        <View>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>Welcome to the app</Text>

        </View>
        <Text style= {{
            fontSize: 20,
            fontFamily: 'roboto-medium',
            color: 'black',
            marginTop: 20
        }}>
            Lets Grow Together
        </Text>

        <TouchableOpacity style={styles.btn}>
            <Text style= {{
                textAlign: 'center',
                color: '#fff'
            }}>Let's Get Started</Text>
        </TouchableOpacity>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    color: 'black'
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },

  btn: {
    backgroundColor: '#7F57F1',
    borderRadius: 80,
    padding: 10,
    width: '50%',
    marginTop: 30,
    alignItems: 'center',
  },
})