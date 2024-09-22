import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

export default function Loading() {
  return (
    <View style={{height: 40, aspectRatio:1}}>
        <LottieView style={{flex:1}} source={require('../assets/lottie/loading.json')} autoPlay loop speed={1.5}></LottieView>
    </View>
  )
}