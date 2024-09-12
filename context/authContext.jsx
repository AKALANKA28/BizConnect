import { useContext, createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/FirebaseConfig";
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
          role: data.role,
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
      const errorMsg = handleFirebaseError(e.code);
      return { success: false, data: errorMsg };
    }
  };

  const signup = async (email, password, role) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      const userDocRef = doc(db, role === "buyer" ? "buyers" : "entrepreneurs", response.user.uid);
      await setDoc(userDocRef, {
        uid: response.user.uid,
        email: response.user.email,
        role: role,
        createdAt: new Date(),
      });

      return { success: true, data: response.user };
    } catch (e) {
      let msg = e.message || "An error occurred";
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
    <AuthContext.Provider value={{ user, isAuthenticated, signin, signout, signup }}>
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
