import React, { useState, useRef } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleRememberPress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    setRememberMe(!rememberMe);
  };

  // 🔥 FIX: Signup + Email Verification
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Incomplete', 'Please fill in both email and password.');
      return;
    }

    try {
      const cleanedEmail = email.trim().toLowerCase();

      console.log('Creating user with:', cleanedEmail);

      // 🔥 FIX utamanya: cek fetchSignInMethodsForEmail dulu
      const providers = await auth().fetchSignInMethodsForEmail(cleanedEmail);

      console.log('PROVIDERS CHECK:', providers);

      if (providers.length > 0) {
        return Alert.alert('Error', 'This email is already registered.');
      }

      // 🔥 Create user
      const userCredential = await auth().createUserWithEmailAndPassword(
        cleanedEmail,
        password
      );

      const user = userCredential.user;

      console.log('User created:', user.uid);

      // 🔥 Kirim verifikasi email
      await user.sendEmailVerification();

      Alert.alert(
        'Verify Email',
        `A verification link has been sent to ${cleanedEmail}. Please verify before logging in.`,
        [{ text: 'OK', onPress: () => navigation.navigate('LoginScreen') }]
      );
    } catch (error: any) {
      console.log('SIGNUP ERROR:', error);

      let message = 'Something went wrong.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email format.';
          break;
        case 'auth/weak-password':
          message = 'Password must be at least 6 characters.';
          break;
        default:
          message = error.message;
      }

      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <Image
        source={require('../../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Create Your Account</Text>

      {/* Email */}
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

      {/* Password */}
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
          <Ionicons
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#999"
          />
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

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or continue with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="apple" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;

/* Styles tetap sama */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', paddingHorizontal: 25 },
  logo: { width: 110, height: 110, marginTop: 70, marginBottom: 20 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 30 },
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
  rememberContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginVertical: 10, gap: 10 },
  checkbox: {
    width: 22, height: 22, borderWidth: 1.5, borderColor: '#00E676',
    borderRadius: 6, justifyContent: 'center', alignItems: 'center'
  },
  checkboxChecked: { backgroundColor: '#00E676', borderColor: '#00E676' },
  rememberText: { color: '#ccc', fontSize: 15 },
  button: { backgroundColor: '#00E676', width: '100%', borderRadius: 30, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#222' },
  orText: { color: '#999', marginHorizontal: 10 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 },
  socialButton: {
    backgroundColor: '#1A1A1A', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center'
  },
  bottomTextContainer: { flexDirection: 'row', marginTop: 30 },
  bottomText: { color: '#888' },
  signInText: { color: '#00E676', fontWeight: '600' },
});
