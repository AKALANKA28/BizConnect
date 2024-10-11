import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook
import Icon from 'react-native-vector-icons/MaterialIcons';  // Importing icons
import RegistrationFormScreen from '../fund/fundRegisterForm';
import { useRouter } from 'expo-router';

// FundSystemScreen Component
const FundSystemScreen = () => {
    const router = useRouter();
  const navigation = useNavigation();  // Initialize navigation

  const handleNavigation = () => {
    router.push({
        pathname: '/fund/newOld',
        //params: { postId: post.id, proPic: post.profileImage}, // Pass only the post ID
      });
  };

  return (
    <View style={styles.container}>
      {/* Image Background */}
      <ImageBackground 
        source={require('../../assets/images/dddepth-345.jpg')} 
        style={styles.imageBackground}
      >
        <Text style={styles.titleText}>Let's understand about the Fund System</Text>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Description */}
        <Text style={styles.description}>
          Welcome to the funding system...
        </Text>
        <Text style={styles.paragraph}>
          It is our aim to provide you with a great service. Here your details will be taken and a fund account will be opened for you. Then you have to contribute a very small amount to this fund every month. Then when you have an emergency or calamity, you will be helped by this funding.
        </Text>
        <Text style={styles.paragraph}>
          We believe this will be of great service to you.
        </Text>

        {/* Fund Purpose List */}
        <Text style={styles.paragraph}>
          You can get funds for
        </Text>
        <Text style={styles.listItem}>1. Natural calamities</Text>
        <Text style={styles.listItem}>2. Sudden business failures</Text>
        <Text style={styles.listItem}>3. Business development</Text>
      </ScrollView>

      {/* Confirmation Button */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Do you understand?</Text>
        <TouchableOpacity style={styles.button} onPress={handleNavigation}>
          <Text style={styles.buttonText}>I understand</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 18,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#b26a27',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FundSystemScreen;
