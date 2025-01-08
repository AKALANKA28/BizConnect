import React, { useRef, useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Colors } from "../../constants/Colors";

const RecommendPostCards = ({ business }) => {
  // Hooks and State
  const router = useRouter();
  const db = getFirestore();
  const { width } = Dimensions.get("window");
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const [userDetails, setUserDetails] = useState(null);

  // Process images from business data
  const images = useMemo(() => {
    if (!business) return [];
    if (Array.isArray(business.images)) return business.images;
    if (business.imageUrl) return [business.imageUrl];
    return [];
  }, [business]);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchEntrepreneurDetails = async () => {
      if (!business?.userId) return;

      try {
        const userRef = doc(db, "entrepreneurs", business.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserDetails({ ...userSnap.data(), uid: business.userId });
        }
      } catch (error) {
        console.error("Error fetching entrepreneur details:", error);
      }
    };

    fetchEntrepreneurDetails();
  }, [business?.userId]);

  const handleProfileNavigation = () => {
    if (!business?.userId) {
      console.error("No entrepreneur ID available");
      return;
    }
    // Navigate to entrepreneur's profile
    router.push({
      pathname: "/profile/entrepreneurProfile/[entrepreneurid]",
      params: { id: business.userId }
    });  };

  // Helper function to format post time
  const getTimeDifference = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const times = {
      year: Math.floor(seconds / (60 * 60 * 24 * 365)),
      day: Math.floor(seconds / (60 * 60 * 24)),
      hour: Math.floor(seconds / (60 * 60)),
      minute: Math.floor(seconds / 60),
    };

    if (times.year > 0) return `${times.year}y`;
    if (times.day > 0) return `${times.day}d`;
    if (times.hour > 0) return `${times.hour}h`;
    if (times.minute > 0) return `${times.minute}m`;
    return `${seconds}s`;
  };

  // Handle image slider scroll
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / width);

    if (Math.abs(contentOffsetX - activeIndex * width) > width * 0.1) {
      setActiveIndex(newIndex);
    }
  };

  // Render Components
  const renderProfileHeader = () => (
    <TouchableOpacity
      onPress={handleProfileNavigation}
      style={styles.profileHeader}
    >
      <Image
        source={{ uri: userDetails?.profileImage }}
        style={styles.profileImage}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>
          {userDetails?.firstName || "Anonymous"} {userDetails?.lastName || ""}
        </Text>
        <Text style={styles.jobRole}>
          {userDetails?.title} | {business?.address}
        </Text>
        <Text style={styles.time}>
          {getTimeDifference(business?.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderImageSlider = () => (
    <Animated.View>
      <Animated.FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={[styles.image, { width }]} />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </Animated.View>
  );

  const renderDotIndicators = () =>
    images.length > 1 && (
      <View style={styles.dotsContainer}>
        {images.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              width * (index - 1),
              width * index,
              width * (index + 1),
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View key={index} style={[styles.dot, { opacity }]} />
          );
        })}
      </View>
    );

  return (
    <View style={styles.card}>
      {renderProfileHeader()}
      {renderImageSlider()}
      {renderDotIndicators()}

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{business?.name}</Text>
        <Text style={styles.category}>{business?.category}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 9,
    borderColor: "#EFEFF0",
    borderWidth: 1,
    width: "100%",
    marginBottom: 15,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 60,
    marginRight: 10,
  },
  profileInfo: {
    justifyContent: "center",
  },
  userName: {
    fontFamily: "lato-bold",
    fontSize: RFValue(14),
    textTransform: "capitalize",
    color: "#333",
  },
  jobRole: {
    fontFamily: "lato",
    fontSize: RFValue(10),
    color: "#6D4C41",
  },
  time: {
    fontFamily: "lato",
    fontSize: RFValue(8),
    color: "#6D4C41",
    marginTop: 2,
  },
  image: {
    height: 400,
    borderRadius: 0,
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -30,
    marginRight: 20,
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 6,
    borderRadius: 4,
    backgroundColor: Colors.primaryColor,
    marginHorizontal: 4,
  },
  infoContainer: {
    paddingHorizontal: 10,
    marginTop: 15,
  },
  name: {
    fontFamily: "lato-bold",
    textTransform: "capitalize",
    fontSize: RFValue(14),
  },
  category: {
    fontFamily: "roboto-medium",
    backgroundColor: Colors.primaryColor,
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 10,
    textTransform: "capitalize",
  },
});

export default RecommendPostCards;
