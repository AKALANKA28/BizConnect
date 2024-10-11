import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const UploadSlipForm = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadSlip = async () => {
    if (!image) {
      Alert.alert("No image selected");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `slips/${new Date().toISOString()}`);
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Save the image URL to Firestore
      await addDoc(collection(db, "uploadSlips"), {
        imageURL: storageRef.fullPath,
        timestamp: new Date(),
      });

      Alert.alert("Success", "Slip uploaded successfully!");
    } catch (error) {
      console.error("Error uploading slip: ", error);
    }
  };

  return (
    <View>
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Button title="Upload Slip" onPress={uploadSlip} />}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    navIcon: {
      padding: 10,
    },
    navTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
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
      //marginTop:40,
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
      backgroundColor: '#D2673D',
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
  

export default UploadSlipForm;
