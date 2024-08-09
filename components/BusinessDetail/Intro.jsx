import {view, Text } from 'react-native'
import React from 'react'

export default function Intro(business){
    return(
        <view>
            <view>
            <Ionicons name="arrow-back-circle" size={24} color="black" />
            <Ionicons name="heart-outline" size={24} color="black" />
            </view>
            <Image source={{uri:business.imageUrl}}
                style={{
                     width:'200',
                     height:340
                    }}

                />
        </view>
    )
}