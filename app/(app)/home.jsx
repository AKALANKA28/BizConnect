import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "../../context/authContext"; // Import your Auth context

export default function Home() {
  const { signout, user } = useAuth(); // Get signout function from Auth context

  const handleLogout = async () => {
    await signout(); // Call the signout function
  };

  console.log('user data', user);
  
  return (
    <View>
      <Text>Home</Text>
      <Button title="Logout" onPress={handleLogout} />
      {/* Pass the function reference */}
    </View>
  );
}
