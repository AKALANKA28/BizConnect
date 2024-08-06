import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import * as WebBrowser from 'expo-web-browser'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'


export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()
export default function LoginScreen() {

  useWarmUpBrowser()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        setActive({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../assets/images/react-logo.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
          Welcome to the app
        </Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "roboto-medium",
          color: "black",
          marginTop: 20,
        }}
      >
        Lets Grow Together
      </Text>

      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
          }}
        >
          Let's Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    color: "black",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },

  btn: {
    backgroundColor: "#7F57F1",
    borderRadius: 80,
    padding: 16,
    width: "80%",
    marginTop: 30,
    alignItems: "center",
  },
});
