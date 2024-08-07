import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';

export default function CategoryItem({ category, onCategoryPress }) {
  return (
    <TouchableOpacity onPress={() => onCategoryPress(category)}>
    <View>
    <View style={{
          padding: 15,
          backgroundColor: "#F8F9FA",
          borderRadius: 99,
          borderColor: "000000",
          borderWidth: 0.5,
        //   marginRight: 15,
        }}>
        <Image source={{ uri: category.icon }}
          style={{ width: 40, height: 40 }} />
       
      </View>
      <Text style={{ 
            fontSize: 13,
            fontFamily: "roboto-bold",
            textTransform: "capitalize",
            textAlign: "center",
            marginTop: 5,
             }}>{category.name}
        </Text>
    </View>
      
     
      
    </TouchableOpacity>
  );
}
