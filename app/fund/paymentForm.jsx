import React, { useState } from 'react';
import { View, TextInput, Button, Alert,StyleSheet } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

const PaymentForm = () => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  const submitPayment = async () => {
    try {
      // Adding the payment data to Firestore
      const docRef = await addDoc(collection(db, "payments"), {
        paymentAmount: paymentAmount,
        paymentDate: paymentDate,
        timestamp: new Date(),
      });
      Alert.alert("Success", "Payment has been recorded successfully!");
    } catch (error) {
      console.error("Error submitting payment: ", error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Payment Amount"
        value={paymentAmount}
        onChangeText={(text) => setPaymentAmount(text)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Payment Date"
        value={paymentDate}
        onChangeText={(text) => setPaymentDate(text)}
      />
      <Button title="Submit" onPress={submitPayment} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    backButton: {
      backgroundColor: '#FF6E40',
      borderRadius: 20,
      padding: 10,
    },
    backText: {
      fontSize: 18,
      color: '#fff',
    },
    menuButton: {
      backgroundColor: '#FF6E40',
      borderRadius: 20,
      padding: 10,
    },
    menuText: {
      fontSize: 18,
      color: '#fff',
    },
    cardContainer: {
      backgroundColor: '#34495e',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      alignItems: 'center',
    },
    cardImage: {
      width: 60,
      height: 40,
      marginBottom: 10,
      marginLeft:250,
    },
    paymentText: {
      color: '#fff',
      fontSize: 16,
    },
    amountText: {
      color: '#fff',
      fontSize: 24,
      marginVertical: 10,
    },
    cardDetailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%', // Take up full width of the cardContainer
    },
    cardNumberText: {
      color: '#fff',
      fontSize: 14,
      marginBottom: 10,
      marginTop:15,
    },
    expDateText: {
      color: '#fff',
      fontSize: 14,
      marginBottom: 10,
      marginTop:15
    },
    formContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 20,
      padding: 10,
      fontSize: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    smallInput: {
      width: '48%',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      padding: 10,
      fontSize: 16,
    },
    payButton: {
      backgroundColor: '#FF6E40',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    payButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  

export default PaymentForm;
