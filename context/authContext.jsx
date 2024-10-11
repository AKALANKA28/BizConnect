import React, { useContext, createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, db } from "../config/FirebaseConfig";
import { doc, setDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "react-native";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To handle loading state while fetching user data

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserRoleAndData(currentUser.uid);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false); // Finished loading when auth state changes
    });
    return unsub;
  }, []);

  // Function to fetch user data from either the 'entrepreneurs' or 'buyers' collection based on role
  const fetchUserRoleAndData = async (uid) => {
    try {
      const usersRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(usersRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const role = userData.role;

        // Now fetch the data from the relevant collection
        const collectionName =
          role === "entrepreneur" ? "entrepreneurs" : "buyers";
        const specificUserDocRef = doc(db, collectionName, uid);
        const specificUserDocSnap = await getDoc(specificUserDocRef);

        if (specificUserDocSnap.exists()) {
          const specificData = specificUserDocSnap.data();
          setUser({
            ...userData,
            ...specificData, // Merge data from 'entrepreneurs' or 'buyers' collection
          });
          // console.log("User data retrieved from Firestore:", specificData);
        } else {
          console.log(
            `No data found in Firestore for UID: ${uid} in ${collectionName}`
          );
        }
      } else {
        console.log(`No user data found in Firestore for UID: ${uid}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Update profile function
  const updateProfile = async (updatedData, imageUri = null) => {
    try {
      if (!user) throw new Error("No user is currently logged in");

      // Determine which collection to update based on the role
      const collectionName =
        user.role === "entrepreneur" ? "entrepreneurs" : "buyers";
      const userRef = doc(db, collectionName, user.uid);

      // Create an object to hold the data to update
      const dataToUpdate = { ...updatedData };

      // If imageUri is provided, add it to the update object
      if (imageUri) {
        dataToUpdate.profileImage = imageUri;
      }

      // Update Firestore with the new profile data
      await setDoc(userRef, dataToUpdate, { merge: true });

      // Optionally update the in-memory user state
      setUser((prevUser) => ({
        ...prevUser,
        ...dataToUpdate,
      }));

      // console.log("Profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error };
    }
  };

  // Sign In function (supports both email and phone number)
  const signin = async (identifier, password) => {
    try {
      if (identifier.includes("@")) {
        // Sign in with email and password
        const response = await signInWithEmailAndPassword(
          auth,
          identifier,
          password
        );
        await fetchUserRoleAndData(response.user.uid); // Fetch user data after sign-in
        return { success: true, data: response.user };
      } else {
        // Sign in with phone number (phone authentication flow required)
        await signInWithPhoneNumber(auth, identifier, password);
        // Phone number sign-in does not need password
      }
    } catch (e) {
      const errorMsg = handleFirebaseError(e.code);
      return { success: false, data: errorMsg };
    }
  };

  // Sign Up function with email, username, and phone number
  const signup = async (email, password, username, phoneNumber, role) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in the main "users" collection
      const userDocRef = doc(db, "users", response.user.uid);
      await setDoc(userDocRef, {
        uid: response.user.uid,
        email: response.user.email,
        username: username,
        phoneNumber: phoneNumber,
        role: role,
        createdAt: new Date(),
      });

      // Create document in either "entrepreneurs" or "buyers" collection based on role
      const collectionName =
        role === "entrepreneur" ? "entrepreneurs" : "buyers";
      const specificUserDocRef = doc(db, collectionName, response.user.uid);
      await setDoc(specificUserDocRef, {
        uid: response.user.uid,
        email: response.user.email,
        username: username,
        phoneNumber: phoneNumber,
        // Additional specific data related to the user role
      });

      await fetchUserRoleAndData(response.user.uid); // Fetch the newly created user data
      return { success: true, data: response.user };
    } catch (e) {
      let msg = e.message || "An error occurred";
      return { success: false, data: msg };
    }
  };

  // Sign Out function
  const signout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Firebase authentication errors
  const handleFirebaseError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/invalid-credential":
        return "The credentials provided are invalid.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  if (loading) {
    return  (
      <View style={styles.container}>
        <Image
          source={require("../assets/Bizconnect_Logo.png")} // Replace with your logo's path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );; // You can replace this with a loading spinner or similar UI
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signin, signout, signup, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return value;
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Change to your desired background color
  },
  logo: {
    width: 100, // Adjust the size according to your logo dimensions
    height: 100, // Adjust the size according to your logo dimensions
    marginBottom: 20, // Space between the logo and spinner
  },
  spinner: {
    marginTop: 20,
  },
});