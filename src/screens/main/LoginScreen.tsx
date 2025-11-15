import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


// Konfigurasi Google Sign-In
GoogleSignin.configure({
  webClientId: '371483061040-cdrfivf8pprtbesa273qg095k39jqq4e.apps.googleusercontent.com',
});

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 🔹 Checkbox animasi
  const handleRememberPress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    setRememberMe(!rememberMe);
  };

  // 🔥 Login Email & Password
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please fill in both email and password.');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
      const user = userCredential.user;

      await user.reload();

      if (!user.emailVerified) {
        setWaitingForVerification(true);
        Alert.alert('Email Not Verified', 'Please verify your email before continuing.', [
          {
            text: 'Resend Verification',
            onPress: async () => {
              await user.sendEmailVerification();
              Alert.alert('Verification Sent', 'A new verification link has been sent to your email.');
            },
          },
          { text: 'OK' },
        ]);
        await auth().signOut();
        return;
      }

      Alert.alert('Welcome Back', `Hello, ${user.email}!`);
      navigation.replace('ChooseInterestScreen');
    } catch (error: any) {
      console.log(error);
      let message = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/invalid-email') message = 'Invalid email format.';
      if (error.code === 'auth/user-not-found') message = 'User not found.';
      if (error.code === 'auth/wrong-password') message = 'Wrong password.';
      if (error.code === 'auth/too-many-requests')
        message = 'Too many login attempts. Try again later.';
      Alert.alert('Login Failed', message);
    }
  };

  // 🔄 Cek verifikasi email tiap 5 detik
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (waitingForVerification) {
      interval = setInterval(async () => {
        const currentUser = auth().currentUser;
        if (currentUser) {
          await currentUser.reload();
          if (currentUser.emailVerified) {
            clearInterval(interval);
            setWaitingForVerification(false);
            Alert.alert('Verified!', 'Your email is now verified.');
            navigation.replace('ChooseInterestScreen');
          }
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [waitingForVerification]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Login to Your Account</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#777"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry={!passwordVisible}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Remember Me */}
      <TouchableOpacity style={styles.rememberContainer} onPress={handleRememberPress}>
        <Animated.View
          style={[
            styles.checkbox,
            rememberMe && styles.checkboxChecked,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {rememberMe && <Ionicons name="checkmark" size={16} color="#000" />}
        </Animated.View>
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity
        style={[styles.button, waitingForVerification && { opacity: 0.6 }]}
        disabled={waitingForVerification}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          {waitingForVerification ? 'Waiting for Verification...' : 'Sign in'}
        </Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate('IdentifyAccountScreen')}>
        <Text style={styles.forgotPasswordText}>Forgot the password?</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or continue with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>

        {/* Tampilkan tombol Apple di Android juga */}
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="apple" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Sign Up */}
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 110,
    height: 110,
    marginTop: 70,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '100%',
    height: 55,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 10,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#00E676',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#00E676',
    borderColor: '#00E676',
    shadowColor: '#00E676',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  rememberText: { color: '#ccc', fontSize: 15 },
  button: {
    backgroundColor: '#00E676',
    width: '100%',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  forgotPasswordText: { color: '#00E676', marginTop: 12, fontSize: 14 },
  separatorContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: { flex: 1, height: 1, backgroundColor: '#222' },
  orText: { color: '#999', marginHorizontal: 10 },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: -10,
  },
  socialButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    elevation: 4,
    shadowColor: '#00E676',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 7,
  },
  bottomTextContainer: { flexDirection: 'row', marginTop: 25 },
  bottomText: { color: '#888' },
  signUpText: { color: '#00E676', fontWeight: '600' },
});
