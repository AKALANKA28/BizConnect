import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../config/FirebaseConfig'; // Firestore DB
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { auth } from '../../config/FirebaseConfig'; // Import Firebase auth

const RegistrationFormScreen = () => {
  const router = useRouter(); // Initialize useRouter from expo-router
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [yearStarted, setYearStarted] = useState('');
  const [businessIdentity, setBusinessIdentity] = useState('');
  const [madeOnlinePayments, setMadeOnlinePayments] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');

  const [nameError, setNameError] = useState(false);
  const [yearError, setYearError] = useState(false);
  const [identityError, setIdentityError] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  const validateForm = () => {
    let isValid = true;

    if (name.trim() === '') {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }

    if (yearStarted === '' || isNaN(yearStarted) || yearStarted < 1900 || yearStarted > new Date().getFullYear()) {
      setYearError(true);
      isValid = false;
    } else {
      setYearError(false);
    }

    if (businessIdentity.trim() === '') {
      setIdentityError(true);
      isValid = false;
    } else {
      setIdentityError(false);
    }

    if (madeOnlinePayments === '') {
      setPaymentError(true);
      isValid = false;
    } else {
      setPaymentError(false);
    }

    if (monthlyAmount === '') {
      setAmountError(true);
      isValid = false;
    } else {
      setAmountError(false);
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const userId = auth.currentUser?.uid; // Get the current user's ID
  
        // Add data to Firestore, including the user ID and registration status
        await addDoc(collection(db, 'fundReg'), {
          name,
          yearStarted,
          businessIdentity,
          madeOnlinePayments,
          monthlyAmount,
          userId, // Store the user ID in the document
          registrationStatus: true, // New field to indicate registration status
        });
  
        Alert.alert('Success', 'Registration successful', [
          { text: 'OK', onPress: () => router.push('/fund/method') }, // Navigate using router.push
        ]);
  
      } catch (error) {
        Alert.alert('Error', 'Failed to register: ' + error.message);
      }
    } else {
      Alert.alert('Error', 'Please fill all required fields correctly.');
    }
  };
  

  return (
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <Header title={"Fund Registration"} />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Fill The Registration Form</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Your Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, nameError ? styles.errorInput : null]}
              placeholder="e.g., Saman Silva"
              value={name}
              onChangeText={text => {
                setName(text);
                setNameError(false);
              }}
            />
            {nameError && <Text style={styles.errorText}>This field is required</Text>}
          </View>

          {/* Year Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>The year the business was started?</Text>
            <TextInput
              style={[styles.input, yearError ? styles.errorInput : null]}
              placeholder="e.g., 2018"
              value={yearStarted}
              keyboardType="numeric"
              onChangeText={text => {
                setYearStarted(text);
                setYearError(false);
              }}
            />
            {yearError && <Text style={styles.errorText}>Enter a valid year (e.g., 1900 - {new Date().getFullYear()})</Text>}
          </View>

          {/* Business Identity Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Your Business Identity</Text>
            <TextInput
              style={[styles.input, identityError ? styles.errorInput : null]}
              placeholder="e.g., CMY6166"
              value={businessIdentity}
              onChangeText={text => {
                setBusinessIdentity(text);
                setIdentityError(false);
              }}
            />
            {identityError && <Text style={styles.errorText}>This field is required</Text>}
          </View>

          {/* Online Payments Select */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Have you made online payments before?</Text>
            <View style={[styles.pickerContainer, paymentError ? styles.errorInput : null]}>
              <Picker
                selectedValue={madeOnlinePayments}
                style={styles.picker}
                onValueChange={value => {
                  setMadeOnlinePayments(value);
                  setPaymentError(false);
                }}
              >
                <Picker.Item label="Select.." value="" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
            {paymentError && <Text style={styles.errorText}>This field is required</Text>}
          </View>

          {/* Monthly Amount Select */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Choose the amount you can afford to pay monthly.</Text>
            <View style={[styles.pickerContainer, amountError ? styles.errorInput : null]}>
              <Picker
                selectedValue={monthlyAmount}
                style={styles.picker}
                onValueChange={value => {
                  setMonthlyAmount(value);
                  setAmountError(false);
                }}
              >
                <Picker.Item label="Select.." value="" />
                <Picker.Item label="1000" value="1000" />
                <Picker.Item label="2000" value="2000" />
                <Picker.Item label="5000" value="5000" />
              </Picker>
            </View>
            {amountError && <Text style={styles.errorText}>This field is required</Text>}
          </View>
        </ScrollView>

        {/* Register Button at the Bottom */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Make sure background is transparent so the image shows
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensure the image covers the entire background
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  button: {
    backgroundColor: '#b26a27',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
});

export default RegistrationFormScreen;
