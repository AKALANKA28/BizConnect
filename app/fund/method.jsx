import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const PaymentTypeScreen = ({ navigation }) => {
  return (
    <ImageBackground
    source={require('../assets/images/ssscribble.svg')} // Replace with your background image path
      style={styles.background}
      resizeMode="cover" // Adjust the image scaling, 'cover' keeps aspect ratio and fills the screen
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Select Payment Type</Text>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('CardPaymentScreen')}
        >
          <Text style={styles.optionText}>Card Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('PaymentSlipScreen')}
        >
          <Text style={styles.optionText}>Payment Slip</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light overlay to make text readable
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  optionButton: {
    backgroundColor: '#D2673D',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentTypeScreen;
