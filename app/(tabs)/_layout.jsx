import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {

  
  return (
  <Tabs screenOptions={{
    headerShown:false,
    tabBarActiveTintColor: Colors.primaryColor}}>
    <Tabs.Screen name="home" options={{ 
        title: 'Home',
        tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} />
    }} />

    <Tabs.Screen name="explore" options={{ 
      title: 'Explore',
      tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} />
     }} /> 

    <Tabs.Screen name="profile" options={{ 
      title: 'Profile',
      tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color}/>
     }} />   
  
  </Tabs>
  )
}