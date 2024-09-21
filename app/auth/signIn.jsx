import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo
import Loading from "../../components/Loading";
import { useAuth } from "../../context/authContext";

export default function SignIn() {
  const router = useRouter();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisibility] = useState(false); // New state for password visibility
  const { signin } = useAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible); // Toggles the visibility of the password
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!email || !password) {
      Alert.alert("Please Fill All Fields");
      setLoading(false);
      return;
    }

    const response = await signin(email, password);
    setLoading(false);

    if (!response.success) {
      Alert.alert("Error", response.message);
      return;
    }

    // Conditional navigation based on user role
    if (response.role === "buyer") {
      router.push("/(tabsBuyer)/home");
    } else if (response.role === "entrepreneur") {
      router.push("/(tabsEntrepreneur)/home");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior for iOS and Android
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // Dismiss the keyboard when tapping outside
      >
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Sign In</Text>

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
          onChangeText={(value) => setEmail(value)}
          placeholder="arunperera@gmail.com"
          value={email}
          style={styles.input}
          placeholderTextColor="#61677d"
        />

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            onChangeText={(value) => setPassword(value)}
            placeholder="********"
            secureTextEntry={!isPasswordVisible} // Toggle visibility based on state
            value={password}
            style={styles.input}
            placeholderTextColor="#61677d"
          />
          <TouchableOpacity
            style={styles.eyeIcon} // Positioning for the eye icon
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"} // Conditional icon
              size={24}
              color="#61677d"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forget Password?</Text>
        </TouchableOpacity>

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
          <Text style={styles.signUpText}> Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signUp")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    marginTop: 160,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
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
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 13,
  },
  forgotPasswordText: {
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
