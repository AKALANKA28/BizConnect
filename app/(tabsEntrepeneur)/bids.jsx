import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { db } from "../../config/FirebaseConfig"; // Update with your actual Firebase config path
import { collection, getDocs, query } from "firebase/firestore";
import BidItem from "../../components/BuyerBidList/BidItem";

export default function Bids() {
  const [bids, setBids] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBids = async () => {
   
      try {
        const bidsCollection = collection(db, "Bids");
        const q = query(bidsCollection);
        const bidsSnapshot = await getDocs(q);
        const bidsList = bidsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBids(bidsList);
      } catch (error) {
        console.error("Error fetching bids: ", error);
      }
    };

    fetchBids();
  });

  const renderBidItem = ({ item }) => <BidItem item={item} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={bids}
        renderItem={renderBidItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 80, // Adjusted to account for FAB size
  },
});
