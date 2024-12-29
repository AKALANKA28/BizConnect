import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useMemo } from "react";
import { Colors } from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");
const HORIZONTAL_MARGIN = 20;
const ITEM_WIDTH = width - (HORIZONTAL_MARGIN * 2);

export default function Intro({ business }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // Convert single imageUrl or multiple images into a consistent array format
  const images = useMemo(() => {
    if (!business) return [];
    if (business.images && Array.isArray(business.images)) {
      return business.images;
    }
    if (business.imageUrl) {
      return [business.imageUrl];
    }
    return [];
  }, [business]);

  const flatListRef = React.useRef(null);

  const handleMomentumScrollEnd = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.floor(scrollPosition / (ITEM_WIDTH + HORIZONTAL_MARGIN * 2));
    const maxIndex = images.length - 1;
    const boundedIndex = Math.min(Math.max(0, index), maxIndex);
    setActiveIndex(boundedIndex);

    // Ensure we don't over-scroll
    if (index > maxIndex) {
      flatListRef.current?.scrollToIndex({
        index: maxIndex,
        animated: true,
      });
    }
  };

  const handleScrollBegin = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(scrollPosition / (ITEM_WIDTH + HORIZONTAL_MARGIN * 2));
    const velocity = event.nativeEvent.velocity?.x || 0;
    
    if (Math.abs(velocity) > 0.05) {
      const maxIndex = images.length - 1;
      const nextIndex = velocity < 0 
        ? Math.min(currentIndex + 1, maxIndex)
        : Math.max(currentIndex - 1, 0);
        
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: 0,
      });
    }
  };
  
  const renderImage = ({ item, index }) => (
    <View style={{ 
      width: ITEM_WIDTH,
      marginLeft: HORIZONTAL_MARGIN,
      marginRight: index === images.length - 1 ? HORIZONTAL_MARGIN : 0,
      marginBottom: 20 
    }}>
      <Image
        source={{ uri: item }}
        style={{
          width: "100%",
          height: 600,
          borderRadius: 26,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 20,
          elevation: 7,
        }}
        resizeMode="cover"
      />
    </View>
  );

  const renderDots = () => {
    if (images.length <= 1) return null;

    return (
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 60,
          alignSelf: "center",
          zIndex: 1,
        }}
      >
        {images.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                activeIndex === index ? Colors.primaryColor : "#fff",
              marginHorizontal: 4,
              opacity: activeIndex === index ? 1 : 0.5,
            }}
          />
        ))}
      </View>
    );
  };

  if (images.length === 0) {
    return (
      <View style={{ backgroundColor: Colors.primaryColor }}>
        <Text style={{ color: "#fff", padding: 20 }}>No images available</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: Colors.primaryColor }}>
      {/* Back Button */}
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          padding: 20,
          top: 32,
          left: 10,
          right: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: 8,
            borderRadius: 20,
          }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: 8,
            borderRadius: 20,
          }}
        >
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Image Slider */}
      <View style={{ marginTop: 40, marginBottom: 20 }}>
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderImage}
          horizontal
          pagingEnabled={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollBeginDrag={handleScrollBegin}
          snapToInterval={ITEM_WIDTH + HORIZONTAL_MARGIN}
          snapToAlignment="start"
          decelerationRate={0.85}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH + HORIZONTAL_MARGIN,
            offset: (ITEM_WIDTH + HORIZONTAL_MARGIN) * index,
            index,
          })}
        />

        {renderDots()}
      </View>

      {/* Business Details Section */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 10,
          marginTop: -20,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(22),
            fontFamily: "lato-bold",
            textTransform: "capitalize",
          }}
        >
          {business?.name || "Business Name"}
        </Text>
      </View>
    </View>
  );
}