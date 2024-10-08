import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/authContext";
import { Colors } from "../../constants/Colors";

export default function SignUp() {
  const router = useRouter();
  const { role } = useLocalSearchParams(); // Retrieve the 'role' from the route params
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); // Declare email state
  const [password, setPassword] = useState(""); // Declare password state
  const [username, setUsername] = useState(""); // New username state
  const [phoneNumber, setPhoneNumber] = useState(""); // New phone number state
  const { signup } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password || !username || !phoneNumber || !role) {
      Alert.alert("Please fill all fields");
      return;
    }
    setLoading(true);

    let response = await signup(email, password, username, phoneNumber, role); // Include new fields in signup function
    console.log(response);
    setLoading(false);

    if (!response.success) {
      Alert.alert("Error", response.data);
      return;
    }

    // Navigate based on user role
    if (role === "buyer") {
      router.push("/(tabsBuyer)/home");
    } else if (role === "entrepreneur") {
      router.push("/(tabsEntrepeneur)/home");
    } else {
      Alert.alert("Invalid role");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Sign Up</Text>

      {/* Social Login Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/icons/facebook.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/icons/google.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>Or</Text>

      {/* Email Input */}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#61677d"
      />

      {/* Username Input */}
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
        placeholderTextColor="#61677d"
      />

      {/* Phone Number Input */}
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#61677d"
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="#61677d"
        />
      </View>

      {/* Sign Up Button */}
      <View>
        {loading ? (
          <View styles={styles.loadingContainer}>
            <Loading />
          </View>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sign In Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/signIn")}>
          <Text style={styles.signUpLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.secondaryColor,
    textAlign: "left",
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  socialButton: {
    width: "48%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#000",
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#61677d",
  },
  input: {
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  loadingContainer:{
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: Colors.secondaryColor,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "#61677d",
  },
  signUpLink: {
    color: Colors.secondaryColor,
    fontWeight: "bold",
  },
});
