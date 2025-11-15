import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBack from '../components/HeaderBack';
import auth from '@react-native-firebase/auth';

const IdentifyAccountScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // ===================================================
  // 🔍 IDENTIFY ACCOUNT BY EMAIL ONLY (FINAL)
  // ===================================================
  const handleContinue = async () => {
    console.log("CHECK PROJECT:", auth().app.options);
    console.log("CHECK EMAIL INPUT RAW:", email);
    console.log("CHECK EMAIL SEND TO FIREBASE:", email);
    console.log(
      "CHECK PROJECT FULL:",
      JSON.stringify(auth().app.options, null, 2)
    );

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      Alert.alert("Missing Info", "Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      console.log("Checking email:", cleanedEmail);

      const methods = await auth().fetchSignInMethodsForEmail(cleanedEmail);

      console.log("Providers for this email:", methods);

      if (!methods || methods.length === 0) {
        Alert.alert(
          "Account Not Found",
          "We couldn't find any account registered with this email."
        );
        setLoading(false);
        return;
      }

      if (methods.includes("password")) {
        navigation.navigate("ForgotPasswordScreen", { email: cleanedEmail });
        setLoading(false);
        return;
      }

      if (methods.includes("google.com")) {
        Alert.alert(
          "Google Account Detected",
          "This email is registered using Google Sign-In. Please log in using Google."
        );
        setLoading(false);
        return;
      }

      if (methods.includes("facebook.com")) {
        Alert.alert(
          "Facebook Account Detected",
          "This email uses Facebook Login. Please log in with Facebook."
        );
        setLoading(false);
        return;
      }

      Alert.alert(
        "Unsupported Provider",
        "This account uses a sign-in method that is not supported here."
      );

    } catch (error: any) {
      console.log("Firebase Error:", error);

      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
      } else {
        Alert.alert("Error", "Something went wrong, please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <HeaderBack title="Find Your Account" onBack={() => navigation.goBack()} />

      <Text style={styles.title}>Forgot your password?</Text>
      <Text style={styles.subtitle}>
        Enter your registered email address to reset your password.
      </Text>

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={22}
          color="#00E676"
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#777"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.button, { opacity: email ? 1 : 0.5 }]}
        disabled={!email || loading}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          {loading ? "Checking..." : "Continue"}
        </Text>
      </TouchableOpacity>

      {/* NOTE SYSTEM DEV */}
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          Note: This system is still in development. If you need to reset your
          password manually, please contact admin via WhatsApp at{' '}
          <Text style={styles.noteHighlight}>089520736931</Text> (Ranggis).
        </Text>
      </View>
    </View>
  );
};

export default IdentifyAccountScreen;

/* ==============================
      STYLES
================================*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 55,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#00E676',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },

  // NOTE STYLE
  noteBox: {
    marginTop: 25,
    paddingHorizontal: 5,
  },
  noteText: {
    color: '#888',
    fontSize: 12,
    lineHeight: 18,
  },
  noteHighlight: {
    color: '#00E676',
    fontWeight: '600',
  },
});
