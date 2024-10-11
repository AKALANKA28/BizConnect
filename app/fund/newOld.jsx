import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const NewOld = () => {
    const router = useRouter();
  return (
    <ImageBackground
    source={require('../../assets/images/ssscribble.png')} // Replace with your background image path
      style={styles.background}
      resizeMode="cover" // Adjust the image scaling, 'cover' keeps aspect ratio and fills the screen
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Are You New For The Fund System ?</Text>

        <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('/fund/fundRegisterForm')}
        >
            <Text style={styles.optionText}>Yes</Text>
        </TouchableOpacity>


        <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('/fund/status')}
        >
            <Text style={styles.optionText}>No</Text>
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

export default NewOld;
