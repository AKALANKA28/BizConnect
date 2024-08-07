import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import Category from '../../components/Home/Category'
import PopularBusiness from '../../components/Home/PopularBusiness'
import {Colors} from '../../constants/Colors'

export default function home() {
  return (
    <ScrollView style={{backgroundColor:Colors.background}}>
      {/* Header */}
      <Header/>
      {/* Slider */}
      <Slider/>
      {/* Category */}
      <Category/>
      {/* Pupular Business List */}
      <PopularBusiness/>
    </ScrollView>
  )
}