import { useContext, createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/FirebaseConfig"; // Import auth and db from config
import { doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        await updateUserData(user.uid);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser((prevUser) => ({
          ...prevUser,
          email: data.email,
          uid: data.uid,
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const signin = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, data: response.user };
    } catch (e) {
      let errorMsg = "An error occurred. Please try again.";

      // Check specific error codes and set appropriate messages
      if (e.code === "auth/invalid-email") {
        errorMsg = "Invalid email address.";
      } else if (e.code === "auth/user-disabled") {
        errorMsg = "Your account has been disabled.";
      } else if (e.code === "auth/user-not-found") {
        errorMsg = "No user found with this email.";
      } else if (e.code === "auth/wrong-password") {
        errorMsg = "Incorrect password.";
      } else if (e.code === "auth/network-request-failed") {
        errorMsg = "Network error. Please check your connection.";
      }

      console.error(e.message);
      return { success: false, data: errorMsg };
    }
  };

  const signup = async (email, password) => {
    try {
      // Create a new user with email and password
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save user data to Firestore
      await setDoc(doc(db, "users", response.user.uid), {
        uid: response.user.uid,
        email: email,
        // username: username, // Uncomment when you have username
        // phone: phone, // Uncomment when you have phone
      });

      return { success: true, data: response.user };
    } catch (e) {
      // Extract the error message
      let msg = e.message || "An error occurred";

      // Customize error messages based on the error code
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Invalid Email";
      } else if (msg.includes("(auth/weak-password)")) {
        msg = "Password should be at least 6 characters";
      } else if (msg.includes("(auth/email-already-in-use)")) {
        msg = "Email already in use";
      } else if (msg.includes("(auth/missing-email)")) {
        msg = "Email is required";
      }

      return { success: false, data: msg };
    }
  };

  const signout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    }
  };

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

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signin, signout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return value;
};
