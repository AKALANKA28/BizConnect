import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";

export default function SignIn() {
  const router = useRouter();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signin } = useAuth();

  const handleSubmit = async () => {
    // Start the loading state
    setLoading(true);
  
    // Check if email and password fields are filled
    if (!email || !password) {
      // Show an alert if any field is missing
      Alert.alert("Please Fill All Fields");
      // Stop the loading state
      setLoading(false);
      return;
    }
  
    // Attempt to sign in with the provided email and password
    const response = await signin(email, password);
  
    // Stop the loading state once the sign-in attempt is complete
    setLoading(false);
  
    if (!response.success) {
      // If sign-in failed, show an error message
      Alert.alert("Error", response.data);
    } else {
      // If sign-in succeeded, show a success message
      Alert.alert("Success", "You have successfully signed in!");
      // Optionally, navigate to another screen here
      // router.push("/home");
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Sign In</Text>

      {/* Social Login Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
            }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png",
            }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>Or</Text>

      {/* Email Input */}
      <TextInput
        onChangeText={value => setEmail(value)}
        placeholder="arunperera@gmail.com"
        value={email}
        style={styles.input}
        placeholderTextColor="#61677d"
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          onChangeText={value => setPassword(value)}
          placeholder="********"
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholderTextColor="#61677d"
        />
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forget Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Log In Button */}
      <View>
        {loading ? (
          <View>
            <Loading />
          </View>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sign Up Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signUp")}>
          <Text style={styles.signUpLink}>Sign Up</Text>
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
    color: "#AA6A1C",
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
  forgotPasswordText: {
    position: "absolute",
    right: 0,
    top: 15,
    fontSize: 14,
    color: "#AA6A1C",
  },
  loginButton: {
    backgroundColor: "#AA6A1C",
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
    color: "#AA6A1C",
    fontWeight: "bold",
  },
});
