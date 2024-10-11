import React, { useState } from 'react';
import { View, TextInput, Button, Alert,StyleSheet } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

const RequestFundForm = () => {
  const [amountRequested, setAmountRequested] = useState('');
  const [reason, setReason] = useState('');

  const submitFundRequest = async () => {
    try {
      // Adding the request to Firestore
      const docRef = await addDoc(collection(db, "requestFunds"), {
        amountRequested: amountRequested,
        reason: reason,
        timestamp: new Date(),
      });
      Alert.alert("Success", "Fund request has been submitted!");
    } catch (error) {
      console.error("Error submitting fund request: ", error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Amount Requested"
        value={amountRequested}
        onChangeText={(text) => setAmountRequested(text)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Reason"
        value={reason}
        onChangeText={(text) => setReason(text)}
      />
      <Button title="Submit" onPress={submitFundRequest} />
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      paddingHorizontal: 20,
    },
    form: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    label: {
      fontSize: 18,
      marginBottom: 8,
      color: '#555',
      marginTop: 30,
    },
    input: {
      height: 40,
      fontSize: 18,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: '#FFF',
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    iconButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    iconText: {
      fontSize: 16,
      marginLeft: 8,
      color: '#555',
    },
    submitButtonContainer: {
      borderTopWidth: 1,
      borderColor: '#E0E0E0',
      paddingTop: 10,
      paddingBottom: 20,
      backgroundColor: '#FFF',
    },
    submitButton: {
      backgroundColor: '#C89D57',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 50,
    },
    submitText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginBottom: 5,
    },
    errorInput: {
      borderColor: 'red',
    },
    dummyScreen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
export default RequestFundForm;
