import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig'; // Adjust path as necessary
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


const PaymentsList = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'fundRequests'));
        const paymentsList = querySnapshot.docs.map(doc => ({
          id: doc.id, // Capture document ID
          ...doc.data() // Spread the document data
        }));
        setPayments(paymentsList);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const renderDate = (date) => {
    if (date && date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return date;
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.statusContainer}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Image
          source={require('../../assets/images/document.png')} // Replace with your icon
          style={styles.icon}
        />
      </View>

      {/* Message and Date */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>You have successfully paid an amount of Rs.{item.amount}/= as your fund installment.</Text>
        <Text style={styles.dateText}>{renderDate(item.createdAt)}</Text>
      </View>

      {/* View Button */}
      {/* <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity> */}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Payment History</Text>
        {/* <TouchableOpacity style={styles.navIcon} onPress={() => alert('Open Settings')}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity> */}
      </View>

      {/* Payments List */}
      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
      />

      {/* OK Button */}
      <TouchableOpacity
            style={styles.okButton}
            onPress={() => router.push('/fund/method')}
        >
            <Text style={styles.okButtonText}>Pay Now</Text>
        </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 15,
    marginTop: 10,
  },
  navIcon: {
    padding: 10,
  },
  navTitle: {
    fontSize: 18,
    marginRight:170,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
  },
  icon: {
    width: 40,
    height: 40,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: '#b26a27',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  okButton: {
    backgroundColor: '#b26a27',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignSelf: 'center',
    marginTop: 20,
    width: 200,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 'auto'
  },
});

export default PaymentsList;
