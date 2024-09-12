import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  StatusBar,
  Alert,
} from "react-native";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(''); // Declare email state
  const [password, setPassword] = useState(''); // Declare password state
  const { signup } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Please Fill All Fields");
      return;
    }
    setLoading(true);

    let response = await signup(email, password);
    console.log(response);
    setLoading(false);
    if (!response.success) {
      Alert.alert("Error", response.data);
      return;
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
        value={email}
        onChangeText={setEmail}
        placeholder="arunperera@gmail.com"
        style={styles.input}
        placeholderTextColor="#61677d"
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="********"
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="#61677d"
        />
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forget Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <View>
        {loading ? (
          <View>
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
        <Text style={styles.signUpText}> Have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signIn")}>
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
