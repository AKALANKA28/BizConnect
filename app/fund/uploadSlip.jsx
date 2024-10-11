import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const BankDetailsScreen = () => {
    const navigation = useNavigation();
    const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);

  const bankData = [
    { id: '1', bankName: 'Bank A', branch: 'Branch 1', accNumber: '123456789' },
    { id: '2', bankName: 'Bank B', branch: 'Branch 2', accNumber: '987654321' },
    { id: '3', bankName: 'Bank C', branch: 'Branch 3', accNumber: '456123789' },
    { id: '4', bankName: 'Bank D', branch: 'Branch 4', accNumber: '321654987' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.bankName}</Text>
      <Text style={styles.cell}>{item.branch}</Text>
      <Text style={styles.cell}>{item.accNumber}</Text>
    </View>
  );

  const generatePDF = async () => {
    let html = `
      <style>
        h1 {
          text-align: center;
          color: #4CAF50;
          font-family: Arial, sans-serif;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        th {
          background-color: #f2f2f2;
          color: #333;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      </style>

      <h1>Bank Details</h1>
      <table>
        <thead>
          <tr>
            <th>Bank Name</th>
            <th>Branch</th>
            <th>Account Number</th>
          </tr>
        </thead>
        <tbody>
          ${bankData
            .map(
              (item) => `
              <tr>
                <td>${item.bankName}</td>
                <td>${item.branch}</td>
                <td>${item.accNumber}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      Alert.alert('Success', 'Bank Details PDF has been generated!', [
        {
          text: 'OK',
          onPress: () => sharePDF(uri),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const sharePDF = async (fileUri) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('Error', 'Sharing is not available on this device.');
    }
  };

  const uploadBankSlip = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'], // Allow PDFs and images
        copyToCacheDirectory: true,
      });
  
      console.log(result); // Log the result for debugging
  
      if (result && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0]; // Get the first file from the assets array
        setSelectedFile(selectedFile);
        Alert.alert('File Selected', `You selected: ${selectedFile.name}`);
  
        // Create a document in the "slip" collection
        await setDoc(doc(db, "slip", selectedFile.name), {
          name: selectedFile.name,
          uri: selectedFile.uri,
          size: selectedFile.size,
          type: selectedFile.mimeType,
          createdAt: new Date(),
        });
  
        Alert.alert('Success', 'Registration successful', [
            { text: 'OK', onPress: () => router.push('/fund/success') }, // Navigate using router.push
          ]);
      } else if (result.canceled) {
        Alert.alert('Cancelled', 'File selection was cancelled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Something went wrong while picking the file');
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Bank Details</Text>
        {/* <TouchableOpacity style={styles.navIcon} onPress={() => alert('Open Settings')}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity> */}
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Bank Name</Text>
        <Text style={styles.headerCell}>Branch</Text>
        <Text style={styles.headerCell}>Account Number</Text>
      </View>

      <FlatList
        data={bankData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.table}
      />

      {/* Download Button */}
      <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
        <Image
          source={require('../../assets/images/download.png')} // Replace with your download icon path
          style={styles.downloadIcon}
        />
        <Text style={styles.downloadText}>Download Bank Details</Text>
      </TouchableOpacity>

      {/* Upload Bank Slip */}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadBankSlip}>
        <Image
          source={require('../../assets/images/attachment.png')} // Replace with your upload icon path
          style={styles.uploadIcon}
        />
        <Text style={styles.uploadText}>Upload Bank Slip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    marginTop: 20,
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
  },
  navIcon: {
    padding: 10,
  },
  navTitle: {
    fontSize: 18,
    marginRight: 170,
    fontWeight: 'bold',
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#D2673D',
    paddingVertical: 10,
    marginBottom: 5,
    marginTop: 40,
  },
  headerCell: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    marginBottom: 60,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D2673D',
    justifyContent: 'space-around',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  downloadIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b26a27',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BankDetailsScreen;
