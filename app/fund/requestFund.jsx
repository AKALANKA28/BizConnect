import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { db } from '../../config/FirebaseConfig'; // Adjust this import according to your Firebase config file
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const RequestFund = () => {
    const router = useRouter();
    const navigation = useNavigation();

  const [reason, setReason] = useState('');
  const [impact, setImpact] = useState('');
  const [amount, setAmount] = useState('');
  const [fileResponse, setFileResponse] = useState(null);
  const [errors, setErrors] = useState({});

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      
      // Check if the file selection was successful
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0]; // Extract the first file from the assets array
        console.log('File selected:', file); // Debugging log

        setFileResponse(file); // Store the file response
        Alert.alert('File Selected', `You have selected: ${file.name}`);
      } else if (result.canceled) {
        console.log('File selection was canceled'); // Debugging log
        Alert.alert('File selection canceled');
      } else {
        console.log('File selection failed:', result); // Debugging log
        Alert.alert('File selection failed');
      }
    } catch (error) {
      console.log('Error during file selection:', error); // Debugging log
      Alert.alert('An error occurred during file selection');
    }
  };

  const validateForm = () => {
    let valid = true;
    let validationErrors = {};

    if (reason.trim() === '') {
      valid = false;
      validationErrors.reason = 'Reason is required';
    }

    if (impact.trim() === '') {
      valid = false;
      validationErrors.impact = 'Impact description is required';
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      valid = false;
      validationErrors.amount = 'Enter a valid amount greater than 0';
    }

    setErrors(validationErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Adding document to Firestore
        const docRef = await addDoc(collection(db, 'fundRequests'), {
          reason,
          impact,
          amount,
          file: fileResponse ? fileResponse.uri : null, // Store the file URI
          createdAt: new Date(),
        });
        Alert.alert('Success', 'Document has been successful', [
            { text: 'OK', onPress: () => router.push('/fund/status') }, // Navigate using router.push
          ]);          
        setReason('');
        setImpact('');
        setAmount('');
        setFileResponse(null);
      } catch (error) {
        console.error("Error adding document: ", error);
        Alert.alert('Error', 'Failed to submit your request. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please correct the highlighted errors.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Fund Request</Text>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>What is the reason you are getting funding?</Text>
        <TextInput
          style={[styles.input, errors.reason ? styles.errorInput : null]}
          placeholder="Reason"
          value={reason}
          onChangeText={setReason}
        />
        {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}

        <Text style={styles.label}>Briefly describe the impact of the above on your business</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.impact ? styles.errorInput : null]}
          placeholder="Explain"
          multiline={true}
          numberOfLines={4}
          value={impact}
          onChangeText={setImpact}
        />
        {errors.impact && <Text style={styles.errorText}>{errors.impact}</Text>}

        <Text style={styles.label}>Amount You Required</Text>
        <TextInput
          style={[styles.input, errors.amount ? styles.errorInput : null]}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

        <Text style={styles.label}>Upload the proof</Text>
        <TouchableOpacity style={styles.iconButton} onPress={pickDocument}>
          <Icon name="attach-file" size={24} color="#555" />
          <Text style={styles.iconText}>
            {fileResponse ? `Selected: ${fileResponse.name}` : 'Attach File'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 15,
  },
  navIcon: {
    padding: 10,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 170,
  },
  form: {
    flexGrow: 1,
    paddingBottom: 20,
    marginTop: 40,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
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
});

export default RequestFund;
