import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignup = () => {
    navigation.navigate("RegisterScreen1");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#007B5D" barStyle="light-content" />

      {/* Main content */}
      <View style={styles.content}>
        <Image
          source={require("../assets/vectors/students.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to HostelCare</Text>
        <Text style={styles.subtitle}>
          Find, manage, and book hostels easily.
        </Text>
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: Platform.OS === "android" ? 50 : 10, // Extra bottom padding for Android
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10, // if supported
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#007B5D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    flex: 1,
    backgroundColor: "#007B5D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
