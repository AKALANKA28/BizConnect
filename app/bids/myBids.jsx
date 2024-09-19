import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { db } from '../../config/FirebaseConfig'; // Firebase config import
import { getDocs, collection, query } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for FAB
import { useRouter } from 'expo-router'; // Import useRouter for navigation

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const router = useRouter(); // For navigation

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const q = query(collection(db, 'Bids'));
      const querySnapshot = await getDocs(q);
      const bidsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBids(bidsData);
    } catch (error) {
      console.error('Error fetching bids: ', error);
    }
  };

  const renderBid = ({ item }) => {
    return (
      <View style={styles.bidContainer}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.bidImage} />
        )}
        <Text style={styles.bidTitle}>{item.name}</Text>
        <Text style={styles.bidDescription}>{item.description}</Text>
        <Text style={styles.bidCategory}>Category: {item.categories}</Text>
  
        {/* Check if bidClosingTime exists and has a 'seconds' property */}
        {item.bidClosingTime?.seconds ? (
          <Text style={styles.bidClosingTime}>
            Closing Time: {new Date(item.bidClosingTime.seconds * 1000).toLocaleString()}
          </Text>
        ) : (
          <Text style={styles.bidClosingTime}>
            Closing Time: No closing time available
          </Text>
        )}
        
        <Text style={styles.bidAddress}>Address: {item.address}</Text>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bids</Text>
      {bids.length > 0 ? (
        <FlatList
          data={bids}
          renderItem={renderBid}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noBidsText}>No bids available</Text>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/bids/addBid')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bidContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  bidImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  bidTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bidDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  bidCategory: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  bidClosingTime: {
    fontSize: 14,
    color: '#888',
  },
  bidAddress: {
    fontSize: 14,
    color: '#888',
  },
  noBidsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#AA6A1C', // Customize color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
 