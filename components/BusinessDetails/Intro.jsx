import { View, Text, Image } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

export default function Intro({ business }) {

  return (
    <View>
        <View>

        </View>
      <Image
        source={{ uri: business.imageUrl }}
        style={{ width: "100%", height: 350 }}
      />
      <Text style={{ color: Colors.secondaryColor, fontSize: 24, fontWeight: "bold"}}>{business.name}</Text>
      {/* Display other business data here */}
    </View>
  );
}
