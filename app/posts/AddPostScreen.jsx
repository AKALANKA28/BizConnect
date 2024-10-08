import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from 'react-native-picker-select';

const AddPostScreen = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  // Image Picker Function
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  const handleSubmit = () => {
    // Handle post submission logic here
    console.log('Title:', title);
    console.log('Category:', category);
    console.log('Description:', description);
    console.log('Image:', image);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Upload the Image</Text>
      <TouchableOpacity style={styles.imageUploadBox} onPress={selectImage}>
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Tap to select an image</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Post Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Category</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        placeholder={{
          label: 'Select Product Category',
          value: null,
        }}
        items={[
          { label: 'Electronics', value: 'electronics' },
          { label: 'Furniture', value: 'furniture' },
          { label: 'Clothing', value: 'clothing' },
          // Add more categories as needed
        ]}
        style={pickerSelectStyles}
      />

      <Text style={styles.label}>Add Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Product Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add a Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  imageUploadBox: {
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  placeholder: {
    color: '#999',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#a1692d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
    marginBottom: 20,
  },
});

export default AddPostScreen;
