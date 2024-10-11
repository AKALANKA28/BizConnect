import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const PaymentStatusScreen = () => {
    const router = useRouter(); 
  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
          <TouchableOpacity style={styles.navIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Payment Status</Text>
          {/* <TouchableOpacity style={styles.navIcon} onPress={() => alert('Open Settings')}>
            <Ionicons name="settings" size={24} color="black" />
          </TouchableOpacity> */}
        </View>

      <View style={styles.card}>
        <View style={styles.statusContainer}>
          <Image
            source={require('../../assets/images/successor2r.png')} // Replace with your success check icon
            style={styles.icon}
          />
          <Text style={styles.statusText}>Your Payment Is Successful</Text>
          <Text style={styles.thankText}>Thank you very much for joining the fund</Text>
          <Image
            source={require('../../assets/images/auth4.png')} // Replace with your illustration image
            style={styles.illustration}
          />
        </View>
        <TouchableOpacity style={styles.okButton} onPress={() => router.push('/fund/requestFund')}>
            <Text style={styles.okText}>OK</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 14,
  },
  navIcon: {
    padding: 10,
  },
  navTitle: {
    fontSize: 18,
    marginRight: 160,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: '#D2673D',
    borderRadius: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statusContainer: {
    alignItems: 'center',
    marginLeft:8,
    marginBottom: 20,
    marginTop:10,
  },
  icon: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  thankText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 12,
    textAlign: 'center',
  },
  illustration: {
    width: 60,
    height: 60,
    marginBottom: 20,
    marginTop:5,
  },
  okButton: {
    backgroundColor: '#D2673D',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginTop: 100,
  },
  okText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
//onPress={() => navigation.goBack()
export default PaymentStatusScreen;
