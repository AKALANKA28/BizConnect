import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';

const PaymentScreen = () => {
    const router = useRouter();
    const navigation = useNavigation(); // Use the navigation prop for the back button

    const [bankName, setBankName] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [expDate, setExpDate] = useState('');
    const [cvv, setCVV] = useState('');

    const handlePayment = async () => {
        // Simple validation for empty fields
        if (!bankName || !cardHolderName || !accountNumber || !expDate || !cvv) {
            Alert.alert('Error', 'Please fill in all the fields.');
            return;
        }

        // Validate bank name (assuming no special validation needed)
        if (bankName.length < 2) {
            Alert.alert('Error', 'Bank name must be at least 2 characters long.');
            return;
        }

        // Validate card holder name (assuming no special validation needed)
        if (cardHolderName.length < 2) {
            Alert.alert('Error', 'Card holder name must be at least 2 characters long.');
            return;
        }

        // Validate account number (should be numeric and typically between 12-16 digits)
        const accountNumberRegex = /^[0-9]{12,16}$/;
        if (!accountNumberRegex.test(accountNumber)) {
            Alert.alert('Error', 'Account number must be 12 to 16 digits.');
            return;
        }

        // Validate expiry date (should be in MM/YY format and a future date)
        const expDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!expDateRegex.test(expDate)) {
            Alert.alert('Error', 'Expiry date must be in MM/YY format.');
            return;
        }

        // Validate CVV (should be a 3-digit number)
        const cvvRegex = /^[0-9]{3}$/;
        if (!cvvRegex.test(cvv)) {
            Alert.alert('Error', 'CVV must be a 3-digit number.');
            return;
        }

        // If all validations pass, proceed with the payment
        try {
            await addDoc(collection(db, 'payments'), {
                bankName,
                cardHolderName,
                accountNumber,
                expDate,
                cvv,
            });

            Alert.alert('Success', 'Payment successful', [
                { text: 'OK', onPress: () => router.push('/fund/success') },
            ]);

        } catch (error) {
            Alert.alert('Error', 'Payment failed: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back button and navigation title */}
            <View style={styles.topNav}>
                <TouchableOpacity style={styles.navIcon} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Payment</Text>
            </View>

            {/* Card Image and Payment Info */}
            <View style={styles.cardContainer}>
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png' }}
                    style={styles.cardImage}
                />
                <Text style={styles.paymentText}>Payment</Text>
                <Text style={styles.amountText}>500 LKR</Text>
                {/* Card Number and Exp Date in a Row */}
                <View style={styles.cardDetailsRow}>
                    <Text style={styles.cardNumberText}>5282 3456 7890 1289</Text>
                    <Text style={styles.expDateText}>09/25</Text>
                </View>
            </View>

            {/* Payment Form */}
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Bank Name"
                    value={bankName}
                    onChangeText={setBankName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Card Holder Name"
                    value={cardHolderName}
                    onChangeText={setCardHolderName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Account Number"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    keyboardType="numeric"
                />
                <View style={styles.row}>
                    <TextInput
                        style={styles.smallInput}
                        placeholder="EXP"
                        value={expDate}
                        onChangeText={setExpDate}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.smallInput}
                        placeholder="CVV"
                        value={cvv}
                        onChangeText={setCVV}
                        keyboardType="numeric"
                        secureTextEntry
                    />
                </View>
            </View>

            {/* Pay Now Button */}
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
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
        marginLeft: 250,
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
        width: '100%',
    },
    cardNumberText: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
        marginTop: 15,
    },
    expDateText: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
        marginTop: 15,
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
        backgroundColor: '#b26a27',
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

export default PaymentScreen;
